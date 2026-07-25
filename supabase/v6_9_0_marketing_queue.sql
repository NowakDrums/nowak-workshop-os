-- Nowak Workshop OS v6.9.0 Marketing Queue
-- Additive migration. Run once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.marketing_queue (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  drum_id uuid not null references public.drums(id) on delete cascade,
  milestone text not null,
  status text not null default 'To Review'
);

create unique index if not exists marketing_queue_drum_milestone_uidx
  on public.marketing_queue(drum_id,milestone);

create index if not exists marketing_queue_status_idx
  on public.marketing_queue(status);

alter table public.marketing_queue enable row level security;

drop policy if exists "Workshop OS read marketing queue" on public.marketing_queue;
drop policy if exists "Workshop OS create marketing queue" on public.marketing_queue;
drop policy if exists "Workshop OS update marketing queue" on public.marketing_queue;
drop policy if exists "Workshop OS delete marketing queue" on public.marketing_queue;

create policy "Workshop OS read marketing queue"
on public.marketing_queue for select to anon, authenticated using (true);

create policy "Workshop OS create marketing queue"
on public.marketing_queue for insert to anon, authenticated with check (true);

create policy "Workshop OS update marketing queue"
on public.marketing_queue for update to anon, authenticated using (true) with check (true);

create policy "Workshop OS delete marketing queue"
on public.marketing_queue for delete to anon, authenticated using (true);

grant select, insert, update, delete on table public.marketing_queue to anon, authenticated;

select 'v6.9.0 marketing queue setup complete' as status;
