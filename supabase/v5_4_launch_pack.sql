-- Nowak Workshop OS v5.4 Launch Pack
-- Safe to run after the existing v5.3 photo-storage migration.

alter table public.drum_photos
  add column if not exists media_type text default 'image';

create table if not exists public.launch_pack_drafts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  drum_id uuid not null references public.drums(id) on delete cascade,
  platform text not null,
  subject text,
  content text not null,
  status text not null default 'Draft',
  published_at timestamptz
);

create index if not exists launch_pack_drafts_drum_id_idx
  on public.launch_pack_drafts(drum_id);

create index if not exists launch_pack_drafts_status_idx
  on public.launch_pack_drafts(status);

alter table public.launch_pack_drafts enable row level security;

drop policy if exists "Workshop OS read launch drafts" on public.launch_pack_drafts;
drop policy if exists "Workshop OS create launch drafts" on public.launch_pack_drafts;
drop policy if exists "Workshop OS update launch drafts" on public.launch_pack_drafts;
drop policy if exists "Workshop OS delete launch drafts" on public.launch_pack_drafts;

create policy "Workshop OS read launch drafts"
on public.launch_pack_drafts for select
to anon, authenticated
using (true);

create policy "Workshop OS create launch drafts"
on public.launch_pack_drafts for insert
to anon, authenticated
with check (true);

create policy "Workshop OS update launch drafts"
on public.launch_pack_drafts for update
to anon, authenticated
using (true)
with check (true);

create policy "Workshop OS delete launch drafts"
on public.launch_pack_drafts for delete
to anon, authenticated
using (true);

grant select, insert, update, delete
on table public.launch_pack_drafts
to anon, authenticated;

select 'v5.4 Launch Pack setup complete' as status;
