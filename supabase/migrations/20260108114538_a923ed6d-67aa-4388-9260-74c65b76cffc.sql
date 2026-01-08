-- Fix the security definer view warning by setting security invoker
ALTER VIEW public.booked_slots SET (security_invoker = true);

-- Also add restrictive INSERT policy for user_roles to prevent privilege escalation
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));