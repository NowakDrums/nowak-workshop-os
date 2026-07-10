-- Nowak Workshop OS v4.0 projects / kits
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

alter table public.drums add column if not exists project_id uuid references public.projects(id) on delete set null;

select 'v4.0 migration complete' as status;
