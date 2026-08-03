-- Nowak Workshop OS v7.7.7
-- Editable purchase orders and partial receiving history.
-- Safe additive migration. Existing orders and inventory are unchanged.

alter table public.supplier_orders add column if not exists receiving_history jsonb not null default '[]'::jsonb;
alter table public.supplier_orders add column if not exists supplier_invoice text;
alter table public.supplier_orders add column if not exists tracking_number text;

select 'v7.7.7 purchase order editing and receiving setup complete' as status;
