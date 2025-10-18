do $$
begin
  create type public.user_role as enum ('admin', 'editor');
exception
  when duplicate_object then null;
end;
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users on delete cascade,
  role public.user_role not null default 'editor',
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

alter table public.profiles enable row level security;

-- Grant table permissions
grant select on public.profiles to authenticated;
grant insert, update, delete on public.profiles to authenticated;

drop policy if exists "Users read own profile" on public.profiles;

create policy "Users read own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.is_admin_or_editor()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where user_id = auth.uid()
      and role in ('admin', 'editor')
  );
$$;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_admin_or_editor() to authenticated;

drop policy if exists "Admins manage profiles" on public.profiles;

create policy "Admins manage profiles"
  on public.profiles
  for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, role, full_name)
  values (new.id, 'editor', new.raw_user_meta_data->>'full_name')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  headline text,
  location text,
  status text check (status in ('預售', '施工中', '已完工')) default '預售',
  area_range text,
  unit_type text,
  price_range text,
  description text,
  highlights text[],
  hero_image text,
  gallery text[],
  contact_phone text,
  address text,
  launch_date text,
  is_featured boolean default false,
  created_at timestamptz not null default now()
);

alter table public.projects
  add column if not exists is_featured boolean default false;

alter table public.projects
  add column if not exists hero_image_delete_token text;

alter table public.projects
  add column if not exists gallery_delete_tokens text[];

create index if not exists projects_slug_idx on public.projects (slug);
create index if not exists projects_is_featured_idx on public.projects (is_featured) where is_featured = true;

alter table public.projects enable row level security;

-- Grant table permissions
grant select on public.projects to authenticated, anon;
grant insert, update, delete on public.projects to authenticated;

drop policy if exists "Allow public read" on public.projects;

create policy "Allow public read"
  on public.projects
  for select
  to authenticated, anon
  using (true);

drop policy if exists "Admins manage projects" on public.projects;

create policy "Admins manage projects"
  on public.projects
  for all
  to authenticated
  using ((select public.is_admin_or_editor()))
  with check ((select public.is_admin_or_editor()));

-- Leads table
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  message text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Grant table permissions
grant select on public.leads to authenticated;
grant insert on public.leads to authenticated, anon;
grant delete on public.leads to authenticated;

drop policy if exists "Allow public insert" on public.leads;

create policy "Allow public insert"
  on public.leads
  for insert
  to authenticated, anon
  with check (true);

drop policy if exists "Admins read leads" on public.leads;

create policy "Admins read leads"
  on public.leads
  for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins delete leads" on public.leads;

create policy "Admins delete leads"
  on public.leads
  for delete
  to authenticated
  using ((select public.is_admin()));

-- About page content table
create table if not exists public.about_page (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  description text not null,
  stats jsonb not null default '[]'::jsonb,
  core_practices jsonb not null default '[]'::jsonb,
  milestones jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);

-- Create index for faster queries
create index if not exists about_page_updated_at_idx on public.about_page (updated_at desc);

-- Enable RLS
alter table public.about_page enable row level security;

-- Grant table permissions
grant select on public.about_page to authenticated, anon;
grant insert, update, delete on public.about_page to authenticated;

-- Allow public read access
drop policy if exists "Allow public read" on public.about_page;

create policy "Allow public read"
  on public.about_page
  for select
  to authenticated, anon
  using (true);

-- Only admins can manage about page content
drop policy if exists "Admins manage about page" on public.about_page;

create policy "Admins manage about page"
  on public.about_page
  for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
