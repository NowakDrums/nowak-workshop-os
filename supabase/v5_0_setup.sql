-- Nowak Workshop OS v5.0 database repair and kit/project setup
-- Safe to run even if earlier migrations were already run.

create extension if not exists pgcrypto;

alter table public.drums
  add column if not exists stage_history jsonb default '[]'::jsonb;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  customer text,
  customer_email text,
  shipping_address text,
  due_date date,
  notes text
);

alter table public.drums
  add column if not exists project_id uuid references public.projects(id) on delete set null;

create index if not exists drums_project_id_idx on public.drums(project_id);

-- The current Workshop OS uses the Supabase anonymous browser key.
-- These policies permit the same browser access pattern used by the existing drums table.
alter table public.projects enable row level security;

drop policy if exists "Workshop OS read projects" on public.projects;
drop policy if exists "Workshop OS create projects" on public.projects;
drop policy if exists "Workshop OS update projects" on public.projects;
drop policy if exists "Workshop OS delete projects" on public.projects;

create policy "Workshop OS read projects"
on public.projects for select
to anon, authenticated
using (true);

create policy "Workshop OS create projects"
on public.projects for insert
to anon, authenticated
with check (true);

create policy "Workshop OS update projects"
on public.projects for update
to anon, authenticated
using (true)
with check (true);

create policy "Workshop OS delete projects"
on public.projects for delete
to anon, authenticated
using (true);

grant select, insert, update, delete on table public.projects to anon, authenticated;

select
  'v5.0 setup complete' as status,
  exists(
    select 1 from information_schema.columns
    where table_schema='public' and table_name='drums' and column_name='project_id'
  ) as project_id_ready,
  exists(
    select 1 from information_schema.columns
    where table_schema='public' and table_name='drums' and column_name='stage_history'
  ) as stage_history_ready;
