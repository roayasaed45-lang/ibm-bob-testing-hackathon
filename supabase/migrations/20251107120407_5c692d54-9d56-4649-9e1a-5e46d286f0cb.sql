-- Create appointments table
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  service_type text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own appointments
CREATE POLICY "Users can view their own appointments"
  ON public.appointments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own appointments"
  ON public.appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments"
  ON public.appointments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own appointments"
  ON public.appointments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Unique constraint to prevent double booking
CREATE UNIQUE INDEX appointments_date_time_idx 
  ON public.appointments(appointment_date, appointment_time);

-- Index for faster queries
CREATE INDEX appointments_user_date_idx 
  ON public.appointments(user_id, appointment_date);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_appointments_updated_at();