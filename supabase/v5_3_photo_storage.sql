-- Nowak Workshop OS v5.3 milestone photo storage
-- Safe to run once in Supabase SQL Editor.

create table if not exists public.drum_photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  drum_id uuid not null references public.drums(id) on delete cascade,
  milestone text not null,
  storage_path text not null,
  public_url text,
  caption text
);

create index if not exists drum_photos_drum_id_idx on public.drum_photos(drum_id);

alter table public.drum_photos enable row level security;

drop policy if exists "Workshop OS read drum photos" on public.drum_photos;
drop policy if exists "Workshop OS create drum photos" on public.drum_photos;
drop policy if exists "Workshop OS update drum photos" on public.drum_photos;
drop policy if exists "Workshop OS delete drum photos" on public.drum_photos;

create policy "Workshop OS read drum photos"
on public.drum_photos for select to anon, authenticated using (true);

create policy "Workshop OS create drum photos"
on public.drum_photos for insert to anon, authenticated with check (true);

create policy "Workshop OS update drum photos"
on public.drum_photos for update to anon, authenticated using (true) with check (true);

create policy "Workshop OS delete drum photos"
on public.drum_photos for delete to anon, authenticated using (true);

grant select, insert, update, delete on table public.drum_photos to anon, authenticated;

insert into storage.buckets (id,name,public)
values ('drum-photos','drum-photos',true)
on conflict (id) do update set public=true;

drop policy if exists "Workshop OS read drum photo files" on storage.objects;
drop policy if exists "Workshop OS upload drum photo files" on storage.objects;
drop policy if exists "Workshop OS update drum photo files" on storage.objects;
drop policy if exists "Workshop OS delete drum photo files" on storage.objects;

create policy "Workshop OS read drum photo files"
on storage.objects for select to anon, authenticated
using (bucket_id='drum-photos');

create policy "Workshop OS upload drum photo files"
on storage.objects for insert to anon, authenticated
with check (bucket_id='drum-photos');

create policy "Workshop OS update drum photo files"
on storage.objects for update to anon, authenticated
using (bucket_id='drum-photos')
with check (bucket_id='drum-photos');

create policy "Workshop OS delete drum photo files"
on storage.objects for delete to anon, authenticated
using (bucket_id='drum-photos');

select 'v5.3 photo storage setup complete' as status;
