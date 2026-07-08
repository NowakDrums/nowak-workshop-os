-- Nowak Workshop OS v1.3 database update
-- Run this once in Supabase SQL Editor before deploying v1.3.

alter table public.drums add column if not exists build_client text default 'Nowak';
alter table public.drums add column if not exists cb_number text;
alter table public.drums add column if not exists customer_email text;
alter table public.drums add column if not exists custom_price numeric default 0;
alter table public.drums add column if not exists shipping_cost numeric default 0;
alter table public.drums add column if not exists total_price numeric default 0;
alter table public.drums add column if not exists due_date date;
alter table public.drums add column if not exists veneer_1_thickness numeric;
alter table public.drums add column if not exists veneer_2_thickness numeric;
alter table public.drums add column if not exists veneer_3_thickness numeric;
alter table public.drums add column if not exists veneer_4_thickness numeric;
alter table public.drums add column if not exists veneer_5_thickness numeric;

-- Optional: show that the columns exist
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
and table_name = 'drums'
and column_name in (
  'build_client','cb_number','customer_email','custom_price','shipping_cost','total_price','due_date',
  'veneer_1_thickness','veneer_2_thickness','veneer_3_thickness','veneer_4_thickness','veneer_5_thickness'
)
order by column_name;