-- Nowak Workshop OS v7.7.5
-- Expand supplier_orders into a purchase-order register.
alter table public.supplier_orders add column if not exists po_number text;
alter table public.supplier_orders add column if not exists notes text;
alter table public.supplier_orders add column if not exists received_at timestamptz;
alter table public.supplier_orders add column if not exists freight_type text;
alter table public.supplier_orders add column if not exists shipping_cost numeric(12,2);
create unique index if not exists supplier_orders_po_number_unique on public.supplier_orders(po_number) where po_number is not null;
