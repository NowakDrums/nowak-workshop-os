-- Nowak Workshop OS v7.7.0 — Shopify/Xero integration foundation and alerts
create table if not exists public.integration_connections (
  id uuid primary key default gen_random_uuid(),
  provider text not null unique,
  status text not null default 'Not connected',
  display_name text,
  external_account_id text,
  config jsonb not null default '{}'::jsonb,
  secret_data jsonb not null default '{}'::jsonb,
  last_sync_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.external_orders (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  external_id text not null,
  order_number text,
  order_name text,
  customer_name text,
  customer_email text,
  customer_phone text,
  shipping_address jsonb not null default '{}'::jsonb,
  billing_address jsonb not null default '{}'::jsonb,
  line_items jsonb not null default '[]'::jsonb,
  notes jsonb,
  financial_status text,
  fulfilment_status text,
  total_amount numeric(12,2) not null default 0,
  currency text not null default 'AUD',
  ordered_at timestamptz,
  import_status text not null default 'Awaiting review',
  linked_drum_ids jsonb not null default '[]'::jsonb,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(provider,external_id)
);

create table if not exists public.app_notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  message text,
  entity_type text,
  entity_id uuid,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.external_orders enable row level security;
alter table public.app_notifications enable row level security;
alter table public.integration_connections enable row level security;

drop policy if exists "Allow external order access" on public.external_orders;
create policy "Allow external order access" on public.external_orders for all using (true) with check (true);
drop policy if exists "Allow notification access" on public.app_notifications;
create policy "Allow notification access" on public.app_notifications for all using (true) with check (true);
-- Connection secrets remain server-side. The browser gets sanitised status through /api/integrations-status.

grant select,insert,update,delete on public.external_orders to anon, authenticated;
grant select,insert,update,delete on public.app_notifications to anon, authenticated;

insert into public.integration_connections(provider,status)
values ('shopify','Not connected'),('xero','Not connected')
on conflict(provider) do nothing;
