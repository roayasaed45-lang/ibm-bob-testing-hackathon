-- Add CHECK constraints for input validation on appointments table
ALTER TABLE public.appointments
ADD CONSTRAINT appointments_customer_name_length CHECK (char_length(customer_name) <= 100),
ADD CONSTRAINT appointments_customer_phone_format CHECK (customer_phone ~ '^[0-9+\-\s]{7,20}$'),
ADD CONSTRAINT appointments_service_type_length CHECK (char_length(service_type) <= 500),
ADD CONSTRAINT appointments_notes_length CHECK (notes IS NULL OR char_length(notes) <= 1000);

-- Create a function to validate service types
CREATE OR REPLACE FUNCTION public.validate_appointment_service_types()
RETURNS TRIGGER AS $$
DECLARE
  valid_services text[] := ARRAY['haircut', 'child-haircut', 'straightening', 'facial-mask', 'barber-at-home', 'groom-haircut'];
  service_list text[];
  service text;
BEGIN
  -- Split the service_type by comma and trim whitespace
  service_list := string_to_array(NEW.service_type, ',');
  
  FOREACH service IN ARRAY service_list
  LOOP
    service := btrim(service);
    IF NOT (service = ANY(valid_services)) THEN
      RAISE EXCEPTION 'Invalid service type: %', service;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for service type validation
CREATE TRIGGER validate_appointment_services
BEFORE INSERT OR UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.validate_appointment_service_types();

-- Update the RLS policy for public insert to be more restrictive
DROP POLICY IF EXISTS "Public can create appointments" ON public.appointments;

CREATE POLICY "Public can create appointments with valid data" 
ON public.appointments 
FOR INSERT 
WITH CHECK (
  -- Ensure required fields are not empty
  customer_name IS NOT NULL AND 
  char_length(btrim(customer_name)) > 0 AND
  customer_phone IS NOT NULL AND
  char_length(btrim(customer_phone)) >= 7 AND
  service_type IS NOT NULL AND
  char_length(btrim(service_type)) > 0 AND
  appointment_date IS NOT NULL AND
  appointment_time IS NOT NULL AND
  -- Ensure status is valid
  status IN ('pending', 'confirmed', 'completed', 'cancelled')
);