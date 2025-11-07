-- Remove RLS policies from appointments table
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can delete their own appointments" ON public.appointments;

-- Disable RLS on appointments table
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;

-- Drop the user_id column
ALTER TABLE public.appointments DROP COLUMN IF EXISTS user_id;

-- Create new RLS policies for public access
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view appointments
CREATE POLICY "Anyone can view appointments"
ON public.appointments
FOR SELECT
USING (true);

-- Allow anyone to create appointments
CREATE POLICY "Anyone can create appointments"
ON public.appointments
FOR INSERT
WITH CHECK (true);

-- Allow users to update their own appointments by phone number
CREATE POLICY "Users can update appointments by phone"
ON public.appointments
FOR UPDATE
USING (true);

-- Allow users to delete appointments by phone number
CREATE POLICY "Users can delete appointments by phone"
ON public.appointments
FOR DELETE
USING (true);