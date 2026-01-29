-- Create property_requirements table
create table public.property_requirements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  location text not null,
  min_budget numeric,
  max_budget numeric,
  property_type text,
  bedrooms integer,
  bathrooms integer,
  status text default 'active' check (status in ('active', 'fulfilled', 'archived')),
  notes text
);

-- Create saved_properties table
create table public.saved_properties (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  property_id integer not null, -- Assuming property IDs are integers based on existing code
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, property_id)
);

-- Enable RLS
alter table public.property_requirements enable row level security;
alter table public.saved_properties enable row level security;

-- Policies for property_requirements
create policy "Users can view their own requirements"
  on public.property_requirements for select
  using (auth.uid() = user_id);

create policy "Users can insert their own requirements"
  on public.property_requirements for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own requirements"
  on public.property_requirements for update
  using (auth.uid() = user_id);

create policy "Users can delete their own requirements"
  on public.property_requirements for delete
  using (auth.uid() = user_id);

-- Policies for saved_properties
create policy "Users can view their own saved properties"
  on public.saved_properties for select
  using (auth.uid() = user_id);

create policy "Users can insert their own saved properties"
  on public.saved_properties for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own saved properties"
  on public.saved_properties for delete
  using (auth.uid() = user_id);
