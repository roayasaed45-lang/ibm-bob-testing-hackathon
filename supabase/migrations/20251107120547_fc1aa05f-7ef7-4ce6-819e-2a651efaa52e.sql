-- Fix security warning: Set search_path for function with CASCADE
DROP FUNCTION IF EXISTS public.update_appointments_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_appointments_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_appointments_updated_at();