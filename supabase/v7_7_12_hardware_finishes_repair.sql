-- Nowak Workshop OS v7.7.12
-- Repair migration for stores where hardware_parts does not yet contain sku_key.
-- Adds Black Nickel finish variants and sets Brass wording for snare wires.
-- Safe to run after the failed v7.7.11 migration.

create extension if not exists pgcrypto;

alter table public.hardware_parts
  add column if not exists sku_key text,
  add column if not exists finish text,
  add column if not exists size text,
  add column if not exists supplier text,
  add column if not exists qty_on_hand numeric not null default 0,
  add column if not exists reorder_level numeric not null default 0,
  add column if not exists landed_cost_aud numeric not null default 0;

-- Populate stable SKU keys for existing rows that do not yet have one.
update public.hardware_parts
set sku_key = coalesce(
  nullif(sku_key,''),
  upper(regexp_replace(
    coalesce(category,'PART') || '-' || coalesce(code,part_name,'ITEM') || '-' ||
    coalesce(size,'') || '-' || coalesce(finish,''),
    '[^A-Za-z0-9]+','-','g'
  ))
)
where sku_key is null or trim(sku_key)='';

-- Ensure duplicate generated keys are made unique before adding an index.
with ranked as (
  select id, sku_key,
         row_number() over (partition by sku_key order by created_at nulls last, id) as rn
  from public.hardware_parts
  where sku_key is not null
)
update public.hardware_parts hp
set sku_key = hp.sku_key || '-' || ranked.rn::text
from ranked
where hp.id=ranked.id and ranked.rn>1;

create unique index if not exists hardware_parts_sku_key_unique
  on public.hardware_parts(sku_key)
  where sku_key is not null;

-- Standardise snare-wire finish wording.
update public.hardware_parts
set finish = case
  when lower(coalesce(finish,'')) like '%brass%' then 'Brass'
  when lower(coalesce(finish,'')) like '%chrome%' then 'Chrome'
  else finish
end
where category='Snare Wires';

-- Brass snare wires: update existing rows or add missing rows.
create temporary table nowak_v7712_wires (
  sku_key text primary key, part_name text, category text, code text,
  finish text, size text, supplier text, reorder_level numeric
) on commit drop;

insert into nowak_v7712_wires values
('WIRE-10-BRASS','Snare Wire','Snare Wires','SE04-1020CI','Brass','10 inch','Lea Hung',2),
('WIRE-12-BRASS','Snare Wire','Snare Wires','SE04-1220CI','Brass','12 inch','Lea Hung',2),
('WIRE-13-BRASS','Snare Wire','Snare Wires','SE04-1320CI','Brass','13 inch','Lea Hung',2),
('WIRE-14-BRASS','Snare Wire','Snare Wires','SE04-1420CI','Brass','14 inch','Lea Hung',2);

update public.hardware_parts hp
set part_name=t.part_name, category=t.category, code=t.code, finish=t.finish,
    size=t.size, supplier=t.supplier,
    reorder_level=case when coalesce(hp.reorder_level,0)=0 then t.reorder_level else hp.reorder_level end
from nowak_v7712_wires t
where hp.sku_key=t.sku_key;

insert into public.hardware_parts
(id,sku_key,part_name,category,code,finish,size,qty_on_hand,reorder_level,landed_cost_aud,supplier)
select gen_random_uuid(),t.sku_key,t.part_name,t.category,t.code,t.finish,t.size,0,t.reorder_level,0,t.supplier
from nowak_v7712_wires t
where not exists (select 1 from public.hardware_parts hp where hp.sku_key=t.sku_key);

-- Create Black Nickel variants from Chrome records. New variants start at zero stock.
insert into public.hardware_parts
(id,sku_key,part_name,category,code,finish,size,qty_on_hand,reorder_level,landed_cost_aud,supplier)
select gen_random_uuid(),
       regexp_replace(hp.sku_key,'-CHROME$','') || '-BLACK-NICKEL',
       hp.part_name,hp.category,hp.code,'Black Nickel',hp.size,0,
       hp.reorder_level,hp.landed_cost_aud,hp.supplier
from public.hardware_parts hp
where hp.category in ('Lugs','Air Vents','Hoops','Snare Wires','Floor Tom Hardware','Bass Drum Hardware')
  and (
    upper(coalesce(hp.sku_key,'')) like '%-CHROME' or
    lower(coalesce(hp.finish,'')) like '%chrome%'
  )
  and not exists (
    select 1 from public.hardware_parts ex
    where ex.sku_key = regexp_replace(hp.sku_key,'-CHROME$','') || '-BLACK-NICKEL'
  );

select 'v7.7.12 hardware finishes repair installed' as status;
