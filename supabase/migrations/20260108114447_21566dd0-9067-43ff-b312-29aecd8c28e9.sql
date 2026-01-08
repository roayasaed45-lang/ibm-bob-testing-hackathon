-- Drop the overly permissive policy that exposes customer data
DROP POLICY IF EXISTS "Public can view booked slots" ON public.appointments;

-- Create a secure view that only exposes date, time, and status for availability checking
CREATE OR REPLACE VIEW public.booked_slots AS
SELECT 
  appointment_date,
  appointment_time,
  status
FROM public.appointments
WHERE status != 'cancelled';

-- Grant access to the view for public (anon) and authenticated users
GRANT SELECT ON public.booked_slots TO anon;
GRANT SELECT ON public.booked_slots TO authenticated;