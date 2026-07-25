-- Nowak Workshop OS v7.4.0 Project / Kit Media
-- Safe additive migration. Existing drum and project data is unchanged.

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  project_id uuid not null references public.projects(id) on delete cascade,
  category text not null default 'general',
  storage_path text not null,
  public_url text not null,
  caption text not null default '',
  media_type text not null default 'image'
);

create index if not exists project_media_project_id_idx
  on public.project_media(project_id);

create index if not exists project_media_category_idx
  on public.project_media(category);

alter table public.project_media enable row level security;

drop policy if exists "project_media_select_all" on public.project_media;
create policy "project_media_select_all"
  on public.project_media for select
  to anon, authenticated
  using (true);

drop policy if exists "project_media_insert_all" on public.project_media;
create policy "project_media_insert_all"
  on public.project_media for insert
  to anon, authenticated
  with check (true);

drop policy if exists "project_media_update_all" on public.project_media;
create policy "project_media_update_all"
  on public.project_media for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "project_media_delete_all" on public.project_media;
create policy "project_media_delete_all"
  on public.project_media for delete
  to anon, authenticated
  using (true);

grant select, insert, update, delete on public.project_media to anon, authenticated;

select 'v7.4.0 project media setup complete' as status;
