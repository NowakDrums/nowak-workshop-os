-- Nowak Workshop OS v6.4.0 Repairs & Modifications
-- Safe to run in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.repair_jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  job_number text not null unique,
  customer_name text not null default '',
  phone text,
  email text,
  drum_brand text,
  drum_description text,
  services jsonb not null default '[]'::jsonb,
  notes text,
  agreed_price numeric not null default 0,
  status text not null default 'Received',
  date_received date default current_date,
  due_date date,
  completed_at timestamptz,
  paid_at timestamptz
);

create index if not exists repair_jobs_status_idx on public.repair_jobs(status);
create index if not exists repair_jobs_customer_idx on public.repair_jobs(customer_name);

create table if not exists public.repair_photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  repair_job_id uuid not null references public.repair_jobs(id) on delete cascade,
  photo_type text not null default 'General',
  storage_path text not null,
  public_url text,
  caption text
);

create index if not exists repair_photos_job_idx on public.repair_photos(repair_job_id);

alter table public.repair_jobs enable row level security;
alter table public.repair_photos enable row level security;

drop policy if exists "Workshop OS read repair jobs" on public.repair_jobs;
drop policy if exists "Workshop OS create repair jobs" on public.repair_jobs;
drop policy if exists "Workshop OS update repair jobs" on public.repair_jobs;
drop policy if exists "Workshop OS delete repair jobs" on public.repair_jobs;

create policy "Workshop OS read repair jobs" on public.repair_jobs for select to anon, authenticated using (true);
create policy "Workshop OS create repair jobs" on public.repair_jobs for insert to anon, authenticated with check (true);
create policy "Workshop OS update repair jobs" on public.repair_jobs for update to anon, authenticated using (true) with check (true);
create policy "Workshop OS delete repair jobs" on public.repair_jobs for delete to anon, authenticated using (true);

drop policy if exists "Workshop OS read repair photos" on public.repair_photos;
drop policy if exists "Workshop OS create repair photos" on public.repair_photos;
drop policy if exists "Workshop OS update repair photos" on public.repair_photos;
drop policy if exists "Workshop OS delete repair photos" on public.repair_photos;

create policy "Workshop OS read repair photos" on public.repair_photos for select to anon, authenticated using (true);
create policy "Workshop OS create repair photos" on public.repair_photos for insert to anon, authenticated with check (true);
create policy "Workshop OS update repair photos" on public.repair_photos for update to anon, authenticated using (true) with check (true);
create policy "Workshop OS delete repair photos" on public.repair_photos for delete to anon, authenticated using (true);

grant select, insert, update, delete on table public.repair_jobs to anon, authenticated;
grant select, insert, update, delete on table public.repair_photos to anon, authenticated;

insert into storage.buckets (id,name,public)
values ('drum-photos','drum-photos',true)
on conflict (id) do update set public=true;

select 'v6.4.0 repairs setup complete' as status;
