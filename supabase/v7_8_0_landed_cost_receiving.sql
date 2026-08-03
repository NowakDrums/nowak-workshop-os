-- Nowak Workshop OS v7.8.0
-- Actual invoice currency, FX and landed-cost receiving.
-- Safe additive migration; existing purchase orders and receipts are preserved.

alter table public.supplier_orders add column if not exists currency text not null default 'AUD';
alter table public.supplier_orders add column if not exists exchange_rate_to_aud numeric(14,6) not null default 1;
alter table public.supplier_orders add column if not exists tax_cost numeric(12,2) not null default 0;
alter table public.supplier_orders add column if not exists duty_cost numeric(12,2) not null default 0;
alter table public.supplier_orders add column if not exists payment_fees numeric(12,2) not null default 0;
alter table public.supplier_orders add column if not exists allocation_method text not null default 'value';

update public.supplier_orders set currency='AUD' where currency is null or trim(currency)='';
update public.supplier_orders set exchange_rate_to_aud=1 where exchange_rate_to_aud is null or exchange_rate_to_aud<=0;
update public.supplier_orders set allocation_method='value' where allocation_method not in ('value','quantity','manual');

select 'v7.8.0 landed-cost receiving setup complete' as status;
