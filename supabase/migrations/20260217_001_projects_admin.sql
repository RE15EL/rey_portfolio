create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  stack text[] not null default '{}',
  image_url text,
  project_url text,
  repo_url text,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create index if not exists idx_projects_published
  on public.projects (is_published);

create index if not exists idx_projects_sort_order
  on public.projects (sort_order);

create index if not exists idx_projects_created_at
  on public.projects (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;

drop policy if exists "admin users can select themselves" on public.admin_users;
create policy "admin users can select themselves"
on public.admin_users
for select
to authenticated
using (
  email = auth.jwt() ->> 'email'
);

drop policy if exists "public can view published projects" on public.projects;
create policy "public can view published projects"
on public.projects
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "admins can read all projects" on public.projects;
create policy "admins can read all projects"
on public.projects
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.email = auth.jwt() ->> 'email'
      and au.is_active = true
  )
);

drop policy if exists "admins can insert projects" on public.projects;
create policy "admins can insert projects"
on public.projects
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admin_users au
    where au.email = auth.jwt() ->> 'email'
      and au.is_active = true
  )
);

drop policy if exists "admins can update projects" on public.projects;
create policy "admins can update projects"
on public.projects
for update
to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.email = auth.jwt() ->> 'email'
      and au.is_active = true
  )
)
with check (
  exists (
    select 1
    from public.admin_users au
    where au.email = auth.jwt() ->> 'email'
      and au.is_active = true
  )
);

drop policy if exists "admins can delete projects" on public.projects;
create policy "admins can delete projects"
on public.projects
for delete
to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.email = auth.jwt() ->> 'email'
      and au.is_active = true
  )
);

insert into public.admin_users (email, is_active)
values ('reiselvalle@gmail.com', true)
on conflict (email) do update
set is_active = excluded.is_active;
