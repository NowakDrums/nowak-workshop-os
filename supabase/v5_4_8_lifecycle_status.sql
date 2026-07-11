-- Nowak Workshop OS v5.4.8 lifecycle status fix
-- Run once in the Supabase SQL Editor before deploying v5.4.8.

alter table public.drums
  add column if not exists lifecycle_status text;

-- Backfill existing records.
-- Legacy Sold/Shipped records are treated as Shipped because they had already
-- completed both sale and shipment in the old combined status.
update public.drums
set lifecycle_status = case
  when sales_status = 'Shipped' then 'Shipped'
  when sales_status = 'Sold' then 'Sold'
  when sales_status = 'Sold/Shipped' then 'Shipped'
  when production_status = 'Manufacturing Complete' then 'Completed'
  else lifecycle_status
end
where lifecycle_status is null or lifecycle_status = '';

create index if not exists drums_lifecycle_status_idx
  on public.drums(lifecycle_status);

select 'v5.4.8 lifecycle status setup complete' as status;
