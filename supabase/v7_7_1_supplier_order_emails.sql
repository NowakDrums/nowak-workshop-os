-- Nowak Workshop OS v7.7.1
-- Supplier order history for generated hardware order emails.

create table if not exists public.supplier_orders (
  id uuid primary key default gen_random_uuid(),
  supplier text not null,
  supplier_email text,
  subject text,
  order_items jsonb not null default '[]'::jsonb,
  estimated_value numeric(12,2) not null default 0,
  status text not null default 'Draft',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.supplier_orders enable row level security;
drop policy if exists "Allow all supplier orders" on public.supplier_orders;
create policy "Allow all supplier orders"
  on public.supplier_orders for all
  using (true) with check (true);
grant all on public.supplier_orders to anon, authenticated;
