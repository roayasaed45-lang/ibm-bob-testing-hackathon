-- =============================================================================
-- Customer authentication support: profiles table + appointments.user_id
--
-- DRAFT FOR REVIEW ONLY. Not applied to the remote database until approved.
--
-- Scope of this migration:
--   1. New `profiles` table (customer full_name + canonical local-format
--      phone, 1:1 with auth.users). Customers may only SELECT their own row
--      in this phase — no client-side insert/update/delete path exists.
--   2. Trigger that auto-provisions a profile row on customer signup only
--      (admin users created via the existing create-admin edge function are
--      untouched, since they carry no `phone` signup metadata), failing the
--      signup cleanly if required metadata is missing or invalid
--   3. Nullable `appointments.user_id` column, FK to auth.users
--   4. Tightened public INSERT policy on appointments so user_id can only ever
--      be NULL (guest) or the caller's own auth.uid() (customer) — never
--      someone else's id
--   5. New SELECT policy so authenticated customers can see only their own
--      linked appointments, additive to (not replacing) the existing
--      admin-can-view-all policy
--
-- Explicitly NOT touched: has_role, user_roles, booked_slots, admin
-- UPDATE/DELETE policies, get_appointments_by_phone, existing validation
-- triggers/constraints, the appointment date+time uniqueness index.
-- No existing appointment rows are modified. No automatic linking of legacy
-- appointments to accounts happens anywhere in this migration.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1) profiles table
--
-- One row per customer auth user. Deliberately minimal: full_name + a single
-- normalized phone, mirroring the length/format constraints already used on
-- public.appointments for consistency.
-- -----------------------------------------------------------------------------
-- Canonical phone shape enforced below: digits only, leading national trunk
-- "0", matching exactly what src/pages/BookAppointment.tsx's
-- normalizeCustomerPhone() and src/pages/CustomerAppointments.tsx's
-- normalizePhoneNumbers() already produce as their "local" form (e.g.
-- "0522691339"). "+9725XXXXXXXX", "9725XXXXXXXX", and any punctuated/spaced
-- variant are rejected — they are different representations of the same
-- number, not the canonical one. Length 9-10 digits after the leading 0
-- covers both Israeli mobile and landline numbers without inventing a new
-- normalization scheme.
CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_full_name_length CHECK (char_length(full_name) <= 100),
  CONSTRAINT profiles_full_name_not_blank CHECK (btrim(full_name) <> ''),
  CONSTRAINT profiles_phone_format CHECK (phone ~ '^0[0-9]{8,9}$')
);

-- One phone can back at most one customer account.
CREATE UNIQUE INDEX profiles_phone_key ON public.profiles (phone);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Customers may read only their own profile.
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Deliberately no INSERT, UPDATE, or DELETE policy for authenticated/anon in
-- this phase: the only path that creates a profile is the SECURITY DEFINER
-- trigger below, which runs as the table owner and bypasses RLS. Direct
-- client inserts/updates/deletes against profiles are all denied by default.
-- A profile-edit flow is intentionally out of scope for now.


-- -----------------------------------------------------------------------------
-- 2) Auto-provision a profile on customer signup
--
-- Fires after every new row in auth.users. Only inserts a profile when the
-- signup metadata included a `phone` — i.e. only for customer signups made
-- through the new customer registration flow. Admin users created via the
-- existing supabase/functions/create-admin edge function pass no such
-- metadata, so they are silently skipped and completely unaffected.
--
-- If a phone was supplied but full_name is missing/blank, or the phone fails
-- the profiles_phone_format/uniqueness constraints, the INSERT/RAISE below
-- fails the whole transaction — the signup itself is rejected rather than
-- creating an incomplete or malformed profile. No COALESCE fallback is used.
--
-- Because the trigger runs in the same transaction as the auth.users insert,
-- a duplicate-phone race (two people registering the same number at once)
-- causes the losing signup to fail cleanly and atomically, rather than
-- leaving an orphaned auth user with no profile.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_customer_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_full_name text := NEW.raw_user_meta_data ->> 'full_name';
  v_phone text := NEW.raw_user_meta_data ->> 'phone';
BEGIN
  IF v_phone IS NULL THEN
    -- Not a customer signup (e.g. an admin created via create-admin) — skip.
    RETURN NEW;
  END IF;

  IF v_full_name IS NULL OR btrim(v_full_name) = '' THEN
    RAISE EXCEPTION 'Customer signup requires a non-empty full_name';
  END IF;

  INSERT INTO public.profiles (user_id, full_name, phone)
  VALUES (NEW.id, v_full_name, v_phone);

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_customer_profile() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER on_auth_user_created_provision_profile
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_customer_profile();


-- -----------------------------------------------------------------------------
-- 3) appointments.user_id
--
-- Nullable so every existing row (and every future guest/web booking) is
-- completely unaffected. ON DELETE SET NULL so deleting a customer account
-- never deletes the underlying appointment record (admins keep their history).
-- -----------------------------------------------------------------------------
ALTER TABLE public.appointments
  ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX appointments_user_id_idx ON public.appointments (user_id);


-- -----------------------------------------------------------------------------
-- 4) Tighten the public INSERT policy
--
-- Same validation as before (name/phone/service/date/time required,
-- status forced to 'pending') PLUS: user_id must be NULL (anonymous/guest
-- web booking, exactly today's behavior) or equal to the caller's own
-- auth.uid() (authenticated customer booking for themselves). No caller,
-- authenticated or not, can ever insert a row claiming another user's id.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can create appointments with valid data" ON public.appointments;

CREATE POLICY "Public can create appointments with valid data"
ON public.appointments
FOR INSERT
TO public
WITH CHECK (
  customer_name IS NOT NULL
  AND char_length(btrim(customer_name)) > 0
  AND customer_phone IS NOT NULL
  AND char_length(btrim(customer_phone)) >= 7
  AND service_type IS NOT NULL
  AND char_length(btrim(service_type)) > 0
  AND appointment_date IS NOT NULL
  AND appointment_time IS NOT NULL
  AND status = 'pending'
  AND (user_id IS NULL OR user_id = auth.uid())
);


-- -----------------------------------------------------------------------------
-- 5) Customer SELECT access to their own appointments
--
-- Additive: the existing "Admins can view all appointments" policy is
-- untouched. Postgres OR's together permissive policies for the same
-- command, so an admin still sees everything via their policy, and a
-- non-admin authenticated customer sees exactly their own linked rows via
-- this one. Rows with user_id IS NULL (guest/legacy bookings, never linked
-- automatically) remain invisible to customers, exactly as intended.
-- -----------------------------------------------------------------------------
CREATE POLICY "Customers can view their own appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
