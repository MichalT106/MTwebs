-- Motorcycle Maintenance tables, RLS, and realtime.
-- Run this in the dedicated Moto Maintenance Supabase project only.
-- Do not run this in the Flowtask Supabase project.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Motorcycles
-- ---------------------------------------------------------------------------
create table if not exists public.moto_motorcycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  manufacturer text not null check (char_length(trim(manufacturer)) > 0),
  model text not null check (char_length(trim(model)) > 0),
  year integer not null,
  current_mileage integer not null default 0 check (current_mileage >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists moto_motorcycles_user_id_idx
  on public.moto_motorcycles (user_id);

drop trigger if exists moto_motorcycles_set_updated_at on public.moto_motorcycles;
create trigger moto_motorcycles_set_updated_at
before update on public.moto_motorcycles
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Custom maintenance types (user-created only)
-- ---------------------------------------------------------------------------
create table if not exists public.moto_custom_maintenance_types (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists moto_custom_maintenance_types_user_id_idx
  on public.moto_custom_maintenance_types (user_id);

drop trigger if exists moto_custom_types_set_updated_at on public.moto_custom_maintenance_types;
create trigger moto_custom_types_set_updated_at
before update on public.moto_custom_maintenance_types
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Maintenance items
-- ---------------------------------------------------------------------------
create table if not exists public.moto_maintenance_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  motorcycle_id uuid not null references public.moto_motorcycles (id) on delete cascade,
  custom_type_id uuid references public.moto_custom_maintenance_types (id) on delete set null,
  name text not null check (char_length(trim(name)) > 0),
  catalog_key text not null,
  tracking_method text not null check (tracking_method in ('date', 'mileage')),
  last_maintenance_date date,
  last_maintenance_mileage integer,
  interval_value integer not null check (interval_value > 0),
  interval_unit text not null check (interval_unit in ('days', 'months', 'years', 'km')),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists moto_maintenance_items_user_id_idx
  on public.moto_maintenance_items (user_id);
create index if not exists moto_maintenance_items_motorcycle_id_idx
  on public.moto_maintenance_items (motorcycle_id);

drop trigger if exists moto_maintenance_items_set_updated_at on public.moto_maintenance_items;
create trigger moto_maintenance_items_set_updated_at
before update on public.moto_maintenance_items
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.moto_motorcycles enable row level security;
alter table public.moto_custom_maintenance_types enable row level security;
alter table public.moto_maintenance_items enable row level security;

drop policy if exists moto_motorcycles_select_own on public.moto_motorcycles;
drop policy if exists moto_motorcycles_insert_own on public.moto_motorcycles;
drop policy if exists moto_motorcycles_update_own on public.moto_motorcycles;
drop policy if exists moto_motorcycles_delete_own on public.moto_motorcycles;

create policy moto_motorcycles_select_own
on public.moto_motorcycles for select to authenticated
using (auth.uid() = user_id);

create policy moto_motorcycles_insert_own
on public.moto_motorcycles for insert to authenticated
with check (auth.uid() = user_id);

create policy moto_motorcycles_update_own
on public.moto_motorcycles for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy moto_motorcycles_delete_own
on public.moto_motorcycles for delete to authenticated
using (auth.uid() = user_id);

drop policy if exists moto_custom_types_select_own on public.moto_custom_maintenance_types;
drop policy if exists moto_custom_types_insert_own on public.moto_custom_maintenance_types;
drop policy if exists moto_custom_types_update_own on public.moto_custom_maintenance_types;
drop policy if exists moto_custom_types_delete_own on public.moto_custom_maintenance_types;

create policy moto_custom_types_select_own
on public.moto_custom_maintenance_types for select to authenticated
using (auth.uid() = user_id);

create policy moto_custom_types_insert_own
on public.moto_custom_maintenance_types for insert to authenticated
with check (auth.uid() = user_id);

create policy moto_custom_types_update_own
on public.moto_custom_maintenance_types for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy moto_custom_types_delete_own
on public.moto_custom_maintenance_types for delete to authenticated
using (auth.uid() = user_id);

drop policy if exists moto_items_select_own on public.moto_maintenance_items;
drop policy if exists moto_items_insert_own on public.moto_maintenance_items;
drop policy if exists moto_items_update_own on public.moto_maintenance_items;
drop policy if exists moto_items_delete_own on public.moto_maintenance_items;

create policy moto_items_select_own
on public.moto_maintenance_items for select to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1 from public.moto_motorcycles m
    where m.id = motorcycle_id and m.user_id = auth.uid()
  )
);

create policy moto_items_insert_own
on public.moto_maintenance_items for insert to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.moto_motorcycles m
    where m.id = motorcycle_id and m.user_id = auth.uid()
  )
);

create policy moto_items_update_own
on public.moto_maintenance_items for update to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1 from public.moto_motorcycles m
    where m.id = motorcycle_id and m.user_id = auth.uid()
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.moto_motorcycles m
    where m.id = motorcycle_id and m.user_id = auth.uid()
  )
);

create policy moto_items_delete_own
on public.moto_maintenance_items for delete to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1 from public.moto_motorcycles m
    where m.id = motorcycle_id and m.user_id = auth.uid()
  )
);

-- ---------------------------------------------------------------------------
-- Realtime (ignore if already added)
-- ---------------------------------------------------------------------------
do $$
begin
  alter publication supabase_realtime add table public.moto_motorcycles;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.moto_custom_maintenance_types;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.moto_maintenance_items;
exception
  when duplicate_object then null;
end $$;
