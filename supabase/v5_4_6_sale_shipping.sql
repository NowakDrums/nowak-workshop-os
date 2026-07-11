-- Nowak Workshop OS v5.4.6 sale and shipping details
-- Run once in the Supabase SQL Editor.

alter table public.sales
  add column if not exists shipping_charged numeric default 0,
  add column if not exists actual_shipping_cost numeric default 0,
  add column if not exists shipping_profit numeric default 0,
  add column if not exists payment_status text default 'Awaiting Payment',
  add column if not exists total_revenue numeric default 0;

-- Backfill existing records without changing their original profit figures.
update public.sales
set
  shipping_charged = coalesce(shipping_charged,0),
  actual_shipping_cost = coalesce(actual_shipping_cost,0),
  shipping_profit = coalesce(shipping_profit,0),
  payment_status = coalesce(nullif(payment_status,''),'Awaiting Payment'),
  total_revenue = case
    when coalesce(total_revenue,0)=0 then coalesce(sale_price,0)+coalesce(shipping_charged,0)
    else total_revenue
  end;

select 'v5.4.6 sale and shipping setup complete' as status;
