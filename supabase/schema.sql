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

drop policy if exists "Users read own profile" on public.profiles;

create policy "Users read own profile"
  on public.profiles
  for select
  using (auth.uid() = user_id);

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
  using (public.is_admin())
  with check (public.is_admin());

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

drop policy if exists "Allow public read" on public.projects;

create policy "Allow public read"
  on public.projects
  for select
  using (true);

drop policy if exists "Admins manage projects" on public.projects;

create policy "Admins manage projects"
  on public.projects
  for all
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

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

drop policy if exists "Allow public insert" on public.leads;

create policy "Allow public insert"
  on public.leads
  for insert
  with check (true);

drop policy if exists "Admins read leads" on public.leads;

create policy "Admins read leads"
  on public.leads
  for select
  using (public.is_admin());

drop policy if exists "Admins delete leads" on public.leads;

create policy "Admins delete leads"
  on public.leads
  for delete
  using (public.is_admin());

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

-- Allow public read access
drop policy if exists "Allow public read" on public.about_page;

create policy "Allow public read"
  on public.about_page
  for select
  using (true);

-- Only admins can manage about page content
drop policy if exists "Admins manage about page" on public.about_page;

create policy "Admins manage about page"
  on public.about_page
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- Insert default about page content
insert into public.about_page (title, subtitle, description, stats, core_practices, milestones)
values (
  'Uphouse 的建築哲學：穩健、誠信、貼近生活',
  'Our Story',
  'Uphouse 建設成立於 2001 年，以「讓家回歸生活本質」為信念。20 餘年來我們專注於住宅開發，從土地評估、規劃設計到售後服務皆由專業團隊親自把關，累計交屋超過 2,800 戶，打造出一座座值得世代傳承的住宅地標。',
  '[
    {"label": "成立年", "value": "2001"},
    {"label": "累計交屋戶數", "value": "2,800+"},
    {"label": "永續建築認證", "value": "12 件"}
  ]'::jsonb,
  '[
    {
      "title": "城市選地策略",
      "description": "鎖定捷運、學區、醫療資源密集的交通門戶區域，結合生活機能與增值潛力。"
    },
    {
      "title": "永續建築工法",
      "description": "導入循環建材、智慧節能監控與低碳施工流程，追求建築與環境的長期共榮。"
    },
    {
      "title": "住戶全程陪伴",
      "description": "提供專屬顧問、雲端履約平台、交屋巡檢與保固維修，為住戶建立信任感。"
    }
  ]'::jsonb,
  '[
    {
      "year": "2005",
      "title": "首座北市捷運共構宅完銷",
      "description": "推出「擎天匯」系列首案，締造 45 天完銷紀錄。"
    },
    {
      "year": "2012",
      "title": "導入永續建築標準",
      "description": "跨足淡水新市鎮，取得首座 EEWH 銅級綠建築標章。"
    },
    {
      "year": "2019",
      "title": "數位交屋服務啟動",
      "description": "建立雲端履約系統，提供線上選配、保固追蹤與即時客服。"
    },
    {
      "year": "2024",
      "title": "品牌升級為 Uphouse",
      "description": "推出永續品牌策略，強化「建築即生活」品牌定位。"
    }
  ]'::jsonb
)
on conflict (id) do nothing;
