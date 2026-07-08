-- Nowak Workshop OS v2.0 database update
-- Run once in Supabase SQL Editor before deploying v2.0.

alter table public.drums add column if not exists drum_type text default 'Snare';
alter table public.drums add column if not exists build_client text default 'Nowak';
alter table public.drums add column if not exists cb_number text;
alter table public.drums add column if not exists customer_email text;
alter table public.drums add column if not exists shipping_address text;
alter table public.drums add column if not exists custom_price numeric default 0;
alter table public.drums add column if not exists wholesale_price numeric default 0;
alter table public.drums add column if not exists shipping_cost numeric default 0;
alter table public.drums add column if not exists total_price numeric default 0;
alter table public.drums add column if not exists due_date date;
alter table public.drums add column if not exists timber_story text;
alter table public.drums add column if not exists shell_thickness text;
alter table public.drums add column if not exists rering_size text;
alter table public.drums add column if not exists stave_triton_setting text;
alter table public.drums add column if not exists stave_width text;
alter table public.drums add column if not exists construction_note text;
alter table public.drums add column if not exists hardware_recipe text;
alter table public.drums add column if not exists price_rule text;
alter table public.drums add column if not exists photo_urls jsonb default '[]'::jsonb;

alter table public.drums add column if not exists veneer_1_thickness numeric;
alter table public.drums add column if not exists veneer_2_thickness numeric;
alter table public.drums add column if not exists veneer_3_thickness numeric;
alter table public.drums add column if not exists veneer_4_thickness numeric;
alter table public.drums add column if not exists veneer_5_thickness numeric;

-- Backfill sensible defaults
update public.drums set drum_type = 'Snare' where drum_type is null;
update public.drums set build_client = 'Nowak' where build_client is null;
update public.drums set price_rule = 'Stock Retail' where price_rule is null;

select column_name, data_type
from information_schema.columns
where table_schema = 'public'
and table_name = 'drums'
and column_name in (
  'drum_type','build_client','cb_number','customer_email','shipping_address',
  'custom_price','wholesale_price','shipping_cost','total_price','due_date',
  'timber_story','shell_thickness','rering_size','stave_triton_setting','stave_width',
  'construction_note','hardware_recipe','price_rule','photo_urls',
  'veneer_1_thickness','veneer_2_thickness','veneer_3_thickness','veneer_4_thickness','veneer_5_thickness'
)
order by column_name;