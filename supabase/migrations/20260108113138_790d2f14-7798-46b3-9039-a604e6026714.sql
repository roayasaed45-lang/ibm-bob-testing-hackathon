-- Allow public to read appointment dates and times for availability checking
CREATE POLICY "Public can view booked slots"
ON public.appointments
FOR SELECT
TO public
USING (true);