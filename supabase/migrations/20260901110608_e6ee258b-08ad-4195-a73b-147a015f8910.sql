CREATE OR REPLACE FUNCTION public.get_appointments_by_phone(p_phone text)
RETURNS TABLE (
  id uuid,
  service_type text,
  appointment_date date,
  appointment_time time without time zone,
  status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.id, a.service_type, a.appointment_date, a.appointment_time, a.status
  FROM public.appointments a
  WHERE a.customer_phone = p_phone
  ORDER BY a.appointment_date ASC, a.appointment_time ASC
$$;

REVOKE ALL ON FUNCTION public.get_appointments_by_phone(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_appointments_by_phone(text) TO anon, authenticated, service_role;