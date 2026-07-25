-- Nowak Workshop OS v6.5.0 Daily Workshop Planning
-- Safe to run once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.work_plan_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  drum_id uuid references public.drums(id) on delete cascade,
  planned_date date not null,
  task_item text not null,
  task_label text not null,
  estimated_hours numeric not null default 0,
  drum_label text,
  batch_name text,
  status text not null default 'Planned'
);

create unique index if not exists work_plan_unique_task_idx
  on public.work_plan_items(drum_id,planned_date,task_item);

create index if not exists work_plan_date_idx
  on public.work_plan_items(planned_date);

alter table public.work_plan_items enable row level security;

drop policy if exists "Workshop OS read work plan" on public.work_plan_items;
drop policy if exists "Workshop OS create work plan" on public.work_plan_items;
drop policy if exists "Workshop OS update work plan" on public.work_plan_items;
drop policy if exists "Workshop OS delete work plan" on public.work_plan_items;

create policy "Workshop OS read work plan"
on public.work_plan_items for select to anon, authenticated using (true);

create policy "Workshop OS create work plan"
on public.work_plan_items for insert to anon, authenticated with check (true);

create policy "Workshop OS update work plan"
on public.work_plan_items for update to anon, authenticated using (true) with check (true);

create policy "Workshop OS delete work plan"
on public.work_plan_items for delete to anon, authenticated using (true);

grant select, insert, update, delete on table public.work_plan_items to anon, authenticated;

select 'v6.5.0 daily workshop planning setup complete' as status;
