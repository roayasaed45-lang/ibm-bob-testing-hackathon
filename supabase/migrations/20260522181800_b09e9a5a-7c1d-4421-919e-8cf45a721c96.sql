-- 1) Tighten public INSERT policy on appointments to force status='pending'
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
);

-- 2) Revoke EXECUTE on trigger-only SECURITY DEFINER functions from public/auth roles
REVOKE EXECUTE ON FUNCTION public.update_appointments_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_appointment_service_types() FROM PUBLIC, anon, authenticated;