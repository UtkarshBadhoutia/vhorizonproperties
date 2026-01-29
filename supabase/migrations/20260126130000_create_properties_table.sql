-- Create properties table
CREATE TABLE public.properties (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  area TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('villa', 'penthouse', 'estate', 'commercial', 'residential')),
  status TEXT NOT NULL CHECK (status IN ('sale', 'rent', 'lease')),
  beds INTEGER NOT NULL DEFAULT 0,
  baths INTEGER NOT NULL DEFAULT 0,
  sqft INTEGER NOT NULL DEFAULT 0,
  carpet_area INTEGER,
  super_area INTEGER,
  current_rent NUMERIC,
  amenities TEXT[] DEFAULT '{}',
  hero_image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  description TEXT,
  agent_id TEXT, -- Intentionally text to match existing IDs like ag_01
  virtual_tour_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Policies
-- Public read access
CREATE POLICY "Public can view properties"
  ON public.properties
  FOR SELECT
  USING (true);

-- Admin write access
CREATE POLICY "Admins can insert properties"
  ON public.properties
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update properties"
  ON public.properties
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete properties"
  ON public.properties
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
