-- Nowak Workshop OS v7.9.10 — schedule repairs in the daily workshop planner
alter table public.repair_jobs
  add column if not exists estimated_hours numeric not null default 1;

alter table public.work_plan_items
  add column if not exists repair_id uuid references public.repair_jobs(id) on delete cascade;

create unique index if not exists work_plan_unique_repair_date_idx
  on public.work_plan_items(repair_id, planned_date)
  where repair_id is not null;

create index if not exists work_plan_repair_idx
  on public.work_plan_items(repair_id)
  where repair_id is not null;

select 'v7.9.10 repair planning setup complete' as status;
