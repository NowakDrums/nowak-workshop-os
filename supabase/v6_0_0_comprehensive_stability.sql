A-- Nowak Workshop OS v6.0.0 comprehensive stability migration
-- Safe to run even if previous migrations were already applied.

-- DRUM LIFECYCLE
alter table public.drums
  add column if not exists lifecycle_status text;

create index if not exists drums_lifecycle_status_idx
  on public.drums(lifecycle_status);

-- SALES / SHIPPING DETAILS
alter table public.sales
  add column if not exists shipping_charged numeric default 0,
  add column if not exists actual_shipping_cost numeric default 0,
  add column if not exists shipping_profit numeric default 0,
  add column if not exists payment_status text default 'Awaiting Payment',
  add column if not exists total_revenue numeric default 0;

-- Normalise legacy lifecycle values.
update public.drums
set lifecycle_status = case
  when lifecycle_status in ('Completed','Sold','Shipped') then lifecycle_status
  when sales_status = 'Shipped' then 'Shipped'
  when sales_status = 'Sold' then 'Sold'
  when sales_status = 'Sold/Shipped' then 'Shipped'
  when production_status = 'Manufacturing Complete' then 'Completed'
  else lifecycle_status
end
where lifecycle_status is null or lifecycle_status = '';

-- Normalise existing sales records.
update public.sales
set
  shipping_charged = coalesce(shipping_charged,0),
  actual_shipping_cost = coalesce(actual_shipping_cost,0),
  shipping_profit = coalesce(shipping_charged,0)-coalesce(actual_shipping_cost,0),
  payment_status = coalesce(nullif(payment_status,''),'Awaiting Payment'),
  total_revenue = case
    when coalesce(total_revenue,0)=0
      then coalesce(sale_price,0)+coalesce(shipping_charged,0)
    else total_revenue
  end;

select 'v6.0.0 comprehensive stability setup complete' as status;
