-- WerkBuddy MVP schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles — one row per authenticated user, created on signup
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  company_name text,
  full_name text,
  phone text,
  kvk_number text,
  btw_number text,
  address text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- automatically create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, company_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'company_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- customers
-- ---------------------------------------------------------------------------
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  phone text,
  email text,
  address text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists customers_user_id_idx on public.customers (user_id);

alter table public.customers enable row level security;

create policy "customers_all_own" on public.customers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- jobs (klussen)
-- ---------------------------------------------------------------------------
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  customer_id uuid references public.customers (id) on delete set null,
  title text not null,
  description text,
  photo_urls text[] not null default '{}',
  status text not null default 'nieuw'
    check (status in ('nieuw', 'offerte_verstuurd', 'goedgekeurd', 'bezig', 'afgerond', 'betaald')),
  created_at timestamptz not null default now()
);

create index if not exists jobs_user_id_idx on public.jobs (user_id);
create index if not exists jobs_customer_id_idx on public.jobs (customer_id);

alter table public.jobs enable row level security;

create policy "jobs_all_own" on public.jobs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- quotes (offertes)
-- ---------------------------------------------------------------------------
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  job_id uuid references public.jobs (id) on delete set null,
  customer_id uuid references public.customers (id) on delete set null,
  title text not null,
  amount numeric(10, 2) not null default 0,
  description text,
  content jsonb,
  status text not null default 'concept'
    check (status in ('concept', 'verstuurd', 'geaccepteerd', 'afgewezen')),
  created_at timestamptz not null default now()
);

create index if not exists quotes_user_id_idx on public.quotes (user_id);
create index if not exists quotes_job_id_idx on public.quotes (job_id);

alter table public.quotes enable row level security;

create policy "quotes_all_own" on public.quotes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- invoices (facturen)
-- ---------------------------------------------------------------------------
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  customer_id uuid references public.customers (id) on delete set null,
  quote_id uuid references public.quotes (id) on delete set null,
  invoice_number text not null,
  amount numeric(10, 2) not null default 0,
  status text not null default 'openstaand'
    check (status in ('openstaand', 'betaald', 'te_laat')),
  due_date date,
  created_at timestamptz not null default now(),
  unique (user_id, invoice_number)
);

create index if not exists invoices_user_id_idx on public.invoices (user_id);
create index if not exists invoices_customer_id_idx on public.invoices (customer_id);

alter table public.invoices enable row level security;

create policy "invoices_all_own" on public.invoices
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
