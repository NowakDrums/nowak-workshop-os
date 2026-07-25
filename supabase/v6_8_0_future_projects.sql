-- Nowak Workshop OS v6.8.0 Future Projects
-- Safe additive migration. Run once in the Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.future_projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  title text not null,
  stage text not null default 'Idea captured',
  preferred_order text not null default 'Someday / no timeframe',
  next_action text,
  notes text
);

create index if not exists future_projects_stage_idx
  on public.future_projects(stage);

create index if not exists future_projects_created_at_idx
  on public.future_projects(created_at desc);

alter table public.future_projects enable row level security;

drop policy if exists "Workshop OS read future projects" on public.future_projects;
drop policy if exists "Workshop OS create future projects" on public.future_projects;
drop policy if exists "Workshop OS update future projects" on public.future_projects;
drop policy if exists "Workshop OS delete future projects" on public.future_projects;

create policy "Workshop OS read future projects"
on public.future_projects for select to anon, authenticated using (true);

create policy "Workshop OS create future projects"
on public.future_projects for insert to anon, authenticated with check (true);

create policy "Workshop OS update future projects"
on public.future_projects for update to anon, authenticated using (true) with check (true);

create policy "Workshop OS delete future projects"
on public.future_projects for delete to anon, authenticated using (true);

grant select, insert, update, delete on table public.future_projects to anon, authenticated;

select 'v6.8.0 future projects setup complete' as status;
