-- Flowtask: categories, tasks, RLS, and new-user inbox seeding

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  color text not null default 'hsl(262 83% 58%)',
  slug text,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  constraint categories_user_slug_unique unique (user_id, slug)
);

create index categories_user_id_idx on public.categories (user_id);

-- ---------------------------------------------------------------------------
-- Tasks
-- ---------------------------------------------------------------------------
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  title text not null check (char_length(trim(title)) > 0),
  description text not null default '',
  completed boolean not null default false,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date date,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_user_id_idx on public.tasks (user_id);
create index tasks_category_id_idx on public.tasks (category_id);
create index tasks_user_order_idx on public.tasks (user_id, order_index);

-- Keep updated_at current
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tasks_set_updated_at
before update on public.tasks
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Seed default Inbox category for new users
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.categories (user_id, name, color, slug, is_system)
  values (
    new.id,
    'Inbox',
    'hsl(262 83% 58%)',
    'inbox',
    true
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.tasks enable row level security;

-- Categories: authenticated users, own rows only
create policy categories_select_own
on public.categories
for select
to authenticated
using (auth.uid() = user_id);

create policy categories_insert_own
on public.categories
for insert
to authenticated
with check (auth.uid() = user_id);

create policy categories_update_own
on public.categories
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy categories_delete_own
on public.categories
for delete
to authenticated
using (auth.uid() = user_id and is_system = false);

-- Tasks: authenticated users, own rows only
create policy tasks_select_own
on public.tasks
for select
to authenticated
using (auth.uid() = user_id);

create policy tasks_insert_own
on public.tasks
for insert
to authenticated
with check (auth.uid() = user_id);

create policy tasks_update_own
on public.tasks
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy tasks_delete_own
on public.tasks
for delete
to authenticated
using (auth.uid() = user_id);

-- Realtime sync across devices
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.categories;
