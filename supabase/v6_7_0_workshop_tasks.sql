-- Nowak Workshop OS v6.7.0 Workshop Tasks
-- Safe to run once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.workshop_tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  title text not null,
  notes text,
  estimated_minutes integer not null default 15,
  recurrence text not null default 'None',
  next_due_date date not null default current_date,
  last_completed_date date,
  status text not null default 'Active'
);

create index if not exists workshop_tasks_due_date_idx
  on public.workshop_tasks(next_due_date);

create index if not exists workshop_tasks_status_idx
  on public.workshop_tasks(status);

alter table public.workshop_tasks enable row level security;

drop policy if exists "Workshop OS read workshop tasks" on public.workshop_tasks;
drop policy if exists "Workshop OS create workshop tasks" on public.workshop_tasks;
drop policy if exists "Workshop OS update workshop tasks" on public.workshop_tasks;
drop policy if exists "Workshop OS delete workshop tasks" on public.workshop_tasks;

create policy "Workshop OS read workshop tasks"
on public.workshop_tasks for select to anon, authenticated using (true);

create policy "Workshop OS create workshop tasks"
on public.workshop_tasks for insert to anon, authenticated with check (true);

create policy "Workshop OS update workshop tasks"
on public.workshop_tasks for update to anon, authenticated using (true) with check (true);

create policy "Workshop OS delete workshop tasks"
on public.workshop_tasks for delete to anon, authenticated using (true);

grant select, insert, update, delete on table public.workshop_tasks to anon, authenticated;

select 'v6.7.0 workshop tasks setup complete' as status;
