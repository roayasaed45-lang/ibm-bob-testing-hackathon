-- Fix overly permissive RLS policies on appointments table

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can delete appointments by phone" ON public.appointments;
DROP POLICY IF EXISTS "Users can update appointments by phone" ON public.appointments;

-- Create more secure policies

-- Anyone can create appointments (this is needed for booking)
CREATE POLICY "Public can create appointments"
ON public.appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can update appointments
CREATE POLICY "Admins can update appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete appointments
CREATE POLICY "Admins can delete appointments"
ON public.appointments
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));