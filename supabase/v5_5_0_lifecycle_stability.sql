-- Nowak Workshop OS v5.5.0 lifecycle stability migration
-- Run once in the Supabase SQL Editor before deploying v5.5.0.

alter table public.drums
  add column if not exists lifecycle_status text;

-- Normalise lifecycle data from legacy records.
update public.drums
set lifecycle_status = case
  when lifecycle_status in ('Completed','Sold','Shipped') then lifecycle_status
  when sales_status = 'Shipped' then 'Shipped'
  when sales_status = 'Sold' then 'Sold'
  when sales_status = 'Sold/Shipped' then 'Shipped'
  when production_status = 'Manufacturing Complete' then 'Completed'
  else lifecycle_status
end;

-- Production #144 was confirmed as sold and shipped.
update public.drums
set
  lifecycle_status = 'Shipped',
  sales_status = 'Sold/Shipped',
  production_status = 'Manufacturing Complete',
  next_step = 'Complete'
where trim(leading '#' from serial::text) = '144';

create index if not exists drums_lifecycle_status_idx
  on public.drums(lifecycle_status);

select
  serial,
  lifecycle_status,
  sales_status,
  production_status,
  next_step
from public.drums
where trim(leading '#' from serial::text) = '144';

select 'v5.5.0 lifecycle stability setup complete' as status;
