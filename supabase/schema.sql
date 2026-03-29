-- Users (extends auth.users)
create table profiles (
  id uuid references auth.users primary key,
  email text,
  first_name text,
  last_name text,
  company text,
  phone text,
  role text default 'external', -- external | internal | studio | admin
  invoice_email text,
  studio_access boolean default false,
  anytime_access boolean default false,
  is_suspended boolean default false,
  created_at timestamptz default now()
);

-- Pass bundles (coworking)
create table pass_balances (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles,
  pass_type text, -- 'full_day' | 'half_day'
  total_passes int,
  used_passes int default 0,
  purchased_at timestamptz default now(),
  stripe_payment_id text
);

-- Bookings
create table bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles,
  space_type text, -- 'training_room' | 'hot_desk' | 'meeting_room' | 'studio'
  booking_date date,
  start_time time,
  end_time time,
  session_type text, -- 'half_day_am' | 'half_day_pm' | 'full_day' | 'hourly'
  duration_hours int,
  delegates int,
  total_ex_vat numeric,
  total_inc_vat numeric,
  status text default 'upcoming', -- upcoming | completed | cancelled
  reference text unique,
  stripe_payment_id text,
  invoice_url text,
  special_requirements text,
  created_at timestamptz default now()
);

-- Invoices
create table invoices (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles,
  booking_id uuid references bookings,
  invoice_number text unique,
  description text,
  amount_ex_vat numeric,
  vat_amount numeric,
  total_inc_vat numeric,
  pdf_url text,
  issued_at timestamptz default now()
);

-- Studio enquiries
create table studio_enquiries (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text,
  company text,
  session_type text,
  frequency text,
  preferred_start date,
  preferred_end date,
  attendees text,
  brief text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Room settings (admin controlled)
create table room_settings (
  space_type text primary key,
  is_active boolean default true,
  half_day_rate numeric,
  full_day_rate numeric,
  hourly_rate numeric
);

-- Insert defaults
insert into room_settings values
  ('training_room', true, 105, 185, null),
  ('hot_desk', true, null, 15, null),
  ('meeting_room', true, null, null, 15),
  ('studio', true, null, null, 18);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', split_part(new.raw_user_meta_data->>'full_name', ' ', 1), ''),
    coalesce(new.raw_user_meta_data->>'last_name', split_part(new.raw_user_meta_data->>'full_name', ' ', 2), ''),
    'external'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table profiles enable row level security;
alter table pass_balances enable row level security;
alter table bookings enable row level security;
alter table invoices enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Users can view own passes" on pass_balances for select using (auth.uid() = user_id);
create policy "Users can view own bookings" on bookings for select using (auth.uid() = user_id);
create policy "Users can insert bookings" on bookings for insert with check (auth.uid() = user_id);
create policy "Users can view own invoices" on invoices for select using (auth.uid() = user_id);
