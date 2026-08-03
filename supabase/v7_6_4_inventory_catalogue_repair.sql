-- Nowak Workshop OS v7.6.4
-- Complete repair for the hardware catalogue.
-- Safe to run after v7.6.2 or after the v7.6.3 script failed part-way through.
-- Preserves stock quantities and existing drum allocations.

create extension if not exists pgcrypto;

alter table public.hardware_parts
  add column if not exists sku_key text;

-- Codes are display codes and may legitimately repeat across different sizes.
drop index if exists public.hardware_parts_code_unique;

-- First assign stable internal SKU keys to known catalogue items.
update public.hardware_parts
set sku_key = case
  when category='Lugs' and (coalesce(size,'') ilike '%127%' or coalesce(part_name,'') ilike '%127%') then 'TL01-127'
  when category='Lugs' and (coalesce(size,'') ilike '%114%' or coalesce(part_name,'') ilike '%114%') then 'LUG-114'
  when category='Lugs' and (coalesce(size,'') ilike '%88%' or coalesce(part_name,'') ilike '%88%') then 'LUG-88'
  when category='Lugs' and (coalesce(size,'') ilike '%70%' or coalesce(part_name,'') ilike '%70%') then 'LUG-70'
  when category='Lugs' and (coalesce(size,'') ilike '%38%' or coalesce(part_name,'') ilike '%38%' or code='ATL01') then 'LUG-38'
  when category='Lugs' and coalesce(part_name,'') ilike '%bass%' then 'TLB01S-51'
  when category='Lugs' and coalesce(part_name,'') ilike '%single%' then 'TL01S-40'
  when category='Tension Rods' and (coalesce(size,'') ilike '%45%' or coalesce(part_name,'') ilike '%45%' or code='TROD-45') then 'TROD-45'
  when category='Hoops' and (coalesce(size,'') ilike '%10%6%' or coalesce(part_name,'') ilike '%10%6%') and (coalesce(part_name,'') ilike '%snare%' or coalesce(size,'') ilike '%snare%' or code ilike '%SNR%') then 'HOOP-10-6-SNR'
  when category='Hoops' and (coalesce(size,'') ilike '%10%6%' or coalesce(part_name,'') ilike '%10%6%') then 'HOOP-10-6-BAT'
  when category='Hoops' and (coalesce(size,'') ilike '%12%8%' or coalesce(part_name,'') ilike '%12%8%') and (coalesce(part_name,'') ilike '%snare%' or coalesce(size,'') ilike '%snare%' or code ilike '%SNR%') then 'HOOP-12-8-SNR'
  when category='Hoops' and (coalesce(size,'') ilike '%12%8%' or coalesce(part_name,'') ilike '%12%8%') then 'HOOP-12-8-BAT'
  when category='Hoops' and (coalesce(size,'') ilike '%13%8%' or coalesce(part_name,'') ilike '%13%8%') and (coalesce(part_name,'') ilike '%snare%' or coalesce(size,'') ilike '%snare%' or code ilike '%SNR%') then 'HOOP-13-8-SNR'
  when category='Hoops' and (coalesce(size,'') ilike '%13%8%' or coalesce(part_name,'') ilike '%13%8%') then 'HOOP-13-8-BAT'
  when category='Hoops' and (coalesce(size,'') ilike '%14%10%' or coalesce(part_name,'') ilike '%14%10%') and (coalesce(part_name,'') ilike '%snare%' or coalesce(size,'') ilike '%snare%' or code ilike '%SNR%') then 'HOOP-14-10-SNR'
  when category='Hoops' and (coalesce(size,'') ilike '%14%10%' or coalesce(part_name,'') ilike '%14%10%') then 'HOOP-14-10-BAT'
  when category='Drum Heads' and (coalesce(size,'') ilike '%10%' or coalesce(part_name,'') ilike '%10%') and (coalesce(part_name,'') ilike '%snare%' or coalesce(size,'') ilike '%snare%') then 'HEAD-10-SNR'
  when category='Drum Heads' and (coalesce(size,'') ilike '%10%' or coalesce(part_name,'') ilike '%10%') then 'HEAD-10-BAT'
  when category='Drum Heads' and (coalesce(size,'') ilike '%12%' or coalesce(part_name,'') ilike '%12%') and (coalesce(part_name,'') ilike '%snare%' or coalesce(size,'') ilike '%snare%') then 'HEAD-12-SNR'
  when category='Drum Heads' and (coalesce(size,'') ilike '%12%' or coalesce(part_name,'') ilike '%12%') then 'HEAD-12-BAT'
  when category='Drum Heads' and (coalesce(size,'') ilike '%13%' or coalesce(part_name,'') ilike '%13%') and (coalesce(part_name,'') ilike '%snare%' or coalesce(size,'') ilike '%snare%') then 'HEAD-13-SNR'
  when category='Drum Heads' and (coalesce(size,'') ilike '%13%' or coalesce(part_name,'') ilike '%13%') then 'HEAD-13-BAT'
  when category='Drum Heads' and (coalesce(size,'') ilike '%14%' or coalesce(part_name,'') ilike '%14%') and (coalesce(part_name,'') ilike '%snare%' or coalesce(size,'') ilike '%snare%') then 'HEAD-14-SNR'
  when category='Drum Heads' and (coalesce(size,'') ilike '%14%' or coalesce(part_name,'') ilike '%14%') then 'HEAD-14-BAT'
  when category='Snare Wires' and (coalesce(size,'') ilike '%10%' or coalesce(part_name,'') ilike '%10%') then 'WIRE-10'
  when category='Snare Wires' and (coalesce(size,'') ilike '%12%' or coalesce(part_name,'') ilike '%12%') then 'WIRE-12'
  when category='Snare Wires' and (coalesce(size,'') ilike '%13%' or coalesce(part_name,'') ilike '%13%') then 'WIRE-13'
  when category='Snare Wires' and (coalesce(size,'') ilike '%14%' or coalesce(part_name,'') ilike '%14%') then 'WIRE-14'
  when category='Throw-Offs' and coalesce(part_name,'') ilike '%trick%' then 'THROW-TRICK'
  when category='Air Vents' and (coalesce(size,'') ilike '%20%' or coalesce(part_name,'') ilike '%20%' or code in ('AV02','VENT-20')) then 'VENT-20'
  when category='Air Vents' and (coalesce(size,'') ilike '%30%' or coalesce(part_name,'') ilike '%30%' or code in ('AV03','VENT-30','AIR01')) then 'VENT-30'
  else coalesce(sku_key, code, id::text)
end;

-- Merge duplicate catalogue rows that represent the same internal SKU.
do $$
declare
  r record;
  keeper uuid;
begin
  for r in
    select sku_key, array_agg(id order by created_at nulls last, id) ids
    from public.hardware_parts
    where sku_key is not null
    group by sku_key
    having count(*) > 1
  loop
    keeper := r.ids[1];

    update public.hardware_parts hp
    set qty_on_hand = x.qty,
        reorder_level = greatest(coalesce(hp.reorder_level,0),x.reorder_level),
        landed_cost_aud = case when coalesce(hp.landed_cost_aud,0)>0 then hp.landed_cost_aud else x.cost end
    from (
      select sum(coalesce(qty_on_hand,0)) qty,
             max(coalesce(reorder_level,0)) reorder_level,
             max(coalesce(landed_cost_aud,0)) cost
      from public.hardware_parts
      where id = any(r.ids)
    ) x
    where hp.id = keeper;

    if to_regclass('public.hardware_allocations') is not null then
      update public.hardware_allocations
      set hardware_part_id = keeper
      where hardware_part_id = any(r.ids[2:array_length(r.ids,1)]);
    end if;

    delete from public.hardware_parts
    where id = any(r.ids[2:array_length(r.ids,1)]);
  end loop;
end $$;

create unique index if not exists hardware_parts_sku_key_unique
  on public.hardware_parts(sku_key)
  where sku_key is not null;

-- Define the intended catalogue once, then update existing rows and insert missing rows.
-- This avoids PostgreSQL ON CONFLICT inference problems with a partial unique index.
create temporary table if not exists nowak_standard_hardware (
  sku_key text primary key,
  part_name text,
  category text,
  code text,
  finish text,
  size text,
  qty_on_hand numeric,
  reorder_level numeric,
  landed_cost_aud numeric,
  supplier text
) on commit drop;

truncate table nowak_standard_hardware;

insert into nowak_standard_hardware
  (sku_key,part_name,category,code,finish,size,qty_on_hand,reorder_level,landed_cost_aud,supplier)
values
  ('TL01-127','Tube Lug','Lugs','TL01','Chrome','127mm',0,20,0,'Lea Hung'),
  ('LUG-114','114mm Lug','Lugs','LUG-114','Chrome','114mm',0,20,0,'Rech'),
  ('LUG-88','Agile Tube Lug','Lugs','ATL01','Chrome','88mm',0,20,0,'Lea Hung'),
  ('LUG-70','Agile Tube Lug','Lugs','ATL01','Chrome','70mm',0,20,0,'Lea Hung'),
  ('LUG-38','Agile Tube Lug','Lugs','ATL01','Chrome','38mm',0,20,0,'Lea Hung'),
  ('TLB01S-51','Bass Tube Lug','Lugs','TLB01S','Chrome','51mm',0,20,0,'Lea Hung'),
  ('TL01S-40','Single Tube Lug','Lugs','TL01S','Chrome','40mm',0,20,0,'Lea Hung'),
  ('TROD-45','Tension Rod','Tension Rods','TROD-45','Chrome','45mm',0,40,0,'Lea Hung'),
  ('HOOP-10-6-BAT','10" 2.3mm Hoop','Hoops','HA01','Chrome','10 x 6',0,4,0,'Lea Hung'),
  ('HOOP-10-6-SNR','10" 2.3mm Hoop – Snare Side','Hoops','HA01-S','Chrome','10 x 6',0,4,0,'Lea Hung'),
  ('HOOP-12-8-BAT','12" 2.3mm Hoop','Hoops','HA01','Chrome','12 x 8',0,4,0,'Lea Hung'),
  ('HOOP-12-8-SNR','12" 2.3mm Hoop – Snare Side','Hoops','HA01-S','Chrome','12 x 8',0,4,0,'Lea Hung'),
  ('HOOP-13-8-BAT','13" 2.3mm Hoop','Hoops','HA01','Chrome','13 x 8',0,4,0,'Lea Hung'),
  ('HOOP-13-8-SNR','13" 2.3mm Hoop – Snare Side','Hoops','HA01-S','Chrome','13 x 8',0,4,0,'Lea Hung'),
  ('HOOP-14-10-BAT','14" 2.3mm Hoop','Hoops','HA01','Chrome','14 x 10',0,4,0,'Lea Hung'),
  ('HOOP-14-10-SNR','14" 2.3mm Hoop – Snare Side','Hoops','HA01-S','Chrome','14 x 10',0,4,0,'Lea Hung'),
  ('HEAD-10-BAT','10 inch Remo Batter Head','Drum Heads','HEAD-10-BAT','','10 inch batter',0,4,0,'Mega Music'),
  ('HEAD-10-SNR','10 inch Remo Snare-Side Head','Drum Heads','HEAD-10-SNR','','10 inch snare side',0,4,0,'Mega Music'),
  ('HEAD-12-BAT','12 inch Remo Batter Head','Drum Heads','HEAD-12-BAT','','12 inch batter',0,4,0,'Mega Music'),
  ('HEAD-12-SNR','12 inch Remo Snare-Side Head','Drum Heads','HEAD-12-SNR','','12 inch snare side',0,4,0,'Mega Music'),
  ('HEAD-13-BAT','13 inch Remo Batter Head','Drum Heads','HEAD-13-BAT','','13 inch batter',0,4,0,'Mega Music'),
  ('HEAD-13-SNR','13 inch Remo Snare-Side Head','Drum Heads','HEAD-13-SNR','','13 inch snare side',0,4,0,'Mega Music'),
  ('HEAD-14-BAT','14 inch Remo Batter Head','Drum Heads','HEAD-14-BAT','','14 inch batter',0,4,0,'Mega Music'),
  ('HEAD-14-SNR','14 inch Remo Snare-Side Head','Drum Heads','HEAD-14-SNR','','14 inch snare side',0,4,0,'Mega Music'),
  ('WIRE-10','10 inch Snare Wires','Snare Wires','WIRE-10','','10 inch',0,4,0,'Lea Hung'),
  ('WIRE-12','12 inch Snare Wires','Snare Wires','WIRE-12','','12 inch',0,4,0,'Lea Hung'),
  ('WIRE-13','13 inch Snare Wires','Snare Wires','WIRE-13','','13 inch',0,4,0,'Lea Hung'),
  ('WIRE-14','14 inch Snare Wires','Snare Wires','WIRE-14','','14 inch',0,4,0,'Lea Hung'),
  ('THROW-TRICK','Trick Throw-Off','Throw-Offs','THROW-TRICK','','Snare throw-off',0,4,0,'Trick Drums'),
  ('VENT-20','Air Vent','Air Vents','AV02','Chrome','20mm',0,6,0,'Lea Hung'),
  ('VENT-30','Air Vent','Air Vents','AV03','Chrome','30mm',0,6,0,'Lea Hung');

update public.hardware_parts hp
set part_name = s.part_name,
    category = s.category,
    code = s.code,
    finish = s.finish,
    size = s.size,
    reorder_level = s.reorder_level,
    supplier = s.supplier
from nowak_standard_hardware s
where hp.sku_key = s.sku_key;

insert into public.hardware_parts
  (sku_key,part_name,category,code,finish,size,qty_on_hand,reorder_level,landed_cost_aud,supplier)
select s.sku_key,s.part_name,s.category,s.code,s.finish,s.size,s.qty_on_hand,
       s.reorder_level,s.landed_cost_aud,s.supplier
from nowak_standard_hardware s
where not exists (
  select 1 from public.hardware_parts hp where hp.sku_key = s.sku_key
);

-- Ensure only the two intended air-vent items remain.
delete from public.hardware_parts
where category='Air Vents' and sku_key not in ('VENT-20','VENT-30');

alter table public.hardware_parts enable row level security;
drop policy if exists "Allow all hardware parts" on public.hardware_parts;
create policy "Allow all hardware parts"
  on public.hardware_parts for all using (true) with check (true);
grant all on public.hardware_parts to anon, authenticated;
