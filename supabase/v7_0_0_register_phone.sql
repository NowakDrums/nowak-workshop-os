-- Nowak Workshop OS v7.0.0 Drum Register and customer phone
-- Safe additive migration.

alter table public.drums
  add column if not exists customer_phone text;

create index if not exists drums_customer_phone_idx
  on public.drums(customer_phone);

select 'v7.0.0 setup complete' as status;
