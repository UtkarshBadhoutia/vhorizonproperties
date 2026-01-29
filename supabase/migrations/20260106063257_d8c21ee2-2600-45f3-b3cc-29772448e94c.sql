-- Create leads table for contact form submissions
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  property_id INTEGER,
  property_title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (anyone can submit a lead)
CREATE POLICY "Anyone can submit a lead"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create policy to prevent public reads (leads are private)
-- Only authenticated users with proper roles should read leads (future admin feature)
CREATE POLICY "Leads are not publicly readable"
ON public.leads
FOR SELECT
TO authenticated
USING (false);