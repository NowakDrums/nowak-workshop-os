-- Nowak Workshop OS v7.7.9
-- Tom, floor-tom and bass-drum hardware catalogue, brass options,
-- and hardware selection fields on drum records.

create extension if not exists pgcrypto;

alter table public.drums add column if not exists hardware_option text not null default 'Standard Hardware';
alter table public.drums add column if not exists hardware_finish text not null default 'Chrome Plated';
alter table public.hardware_parts add column if not exists sku_key text;

-- Existing SKU uniqueness rules are retained.

create temporary table nowak_v778_parts (
  sku_key text primary key,
  part_name text,
  category text,
  code text,
  finish text,
  size text,
  supplier text,
  reorder_level numeric,
  landed_cost_aud numeric
) on commit drop;

insert into nowak_v778_parts values
-- Snare lugs: chrome and brass
('LUG-38-CHROME','Agile Tube Lug','Lugs','ATL01','Chrome Plated','38mm','Lea Hung',20,0),
('LUG-38-BRASS','Agile Tube Lug','Lugs','ATL01','Brass Plated','38mm','Lea Hung',10,0),
('LUG-70-CHROME','Agile Tube Lug','Lugs','ATL01','Chrome Plated','70mm','Lea Hung',20,0),
('LUG-70-BRASS','Agile Tube Lug','Lugs','ATL01','Brass Plated','70mm','Lea Hung',10,0),
('LUG-88-CHROME','Agile Tube Lug','Lugs','ATL01','Chrome Plated','88mm','Lea Hung',20,0),
('LUG-88-BRASS','Agile Tube Lug','Lugs','ATL01','Brass Plated','88mm','Lea Hung',10,0),
('LUG-114-CHROME','114mm Lug','Lugs','LUG-114','Chrome Plated','114mm','Rech',20,0),
('LUG-114-BRASS','114mm Lug','Lugs','LUG-114','Brass Plated','114mm','Rech',10,0),
-- Ball lugs for toms
('BALL-LUG-CHROME','Agile Tube Lug – Ball','Lugs','ATL01-01','Chrome Plated','Ball lug','Lea Hung',24,0),
('BALL-LUG-BRASS','Agile Tube Lug – Ball','Lugs','ATL01-01','Brass Plated','Ball lug','Lea Hung',12,0),
-- Air vents
('VENT-20-CHROME','Air Vent','Air Vents','AV02-20','Chrome Plated','20mm','Lea Hung',10,0),
('VENT-20-BRASS','Air Vent','Air Vents','AV02-20','Brass Plated','20mm','Lea Hung',5,0),
('VENT-30-CHROME','Air Vent','Air Vents','AV02-30','Chrome Plated','30mm','Lea Hung',10,0),
('VENT-30-BRASS','Air Vent','Air Vents','AV02-30','Brass Plated','30mm','Lea Hung',5,0),
-- Rods
('TROD-45','Tension Rods (stainless steel)','Tension Rods','TR01','Stainless Steel','45mm','Lea Hung',40,0),
('TROD-110','Bass Drum Tension Rod','Tension Rods','TR02','Stainless Steel','110mm','Lea Hung',32,0),
-- Snare hoops
('HOOP-10-6-BAT-CHROME','10 inch 2.3mm Hoop','Hoops','HA01','Chrome Plated','10 x 6','Lea Hung',2,0),
('HOOP-10-6-BAT-BRASS','10 inch 2.3mm Hoop','Hoops','HA01','Brass Plated','10 x 6','Lea Hung',2,0),
('HOOP-10-6-SNR-CHROME','10 inch 2.3mm Hoop – Snare Side','Hoops','HA01-S','Chrome Plated','10 x 6','Lea Hung',2,0),
('HOOP-10-6-SNR-BRASS','10 inch 2.3mm Hoop – Snare Side','Hoops','HA01-S','Brass Plated','10 x 6','Lea Hung',2,0),
('HOOP-12-8-BAT-CHROME','12 inch 2.3mm Hoop','Hoops','HA01','Chrome Plated','12 x 8','Lea Hung',2,0),
('HOOP-12-8-BAT-BRASS','12 inch 2.3mm Hoop','Hoops','HA01','Brass Plated','12 x 8','Lea Hung',2,0),
('HOOP-12-8-SNR-CHROME','12 inch 2.3mm Hoop – Snare Side','Hoops','HA01-S','Chrome Plated','12 x 8','Lea Hung',2,0),
('HOOP-12-8-SNR-BRASS','12 inch 2.3mm Hoop – Snare Side','Hoops','HA01-S','Brass Plated','12 x 8','Lea Hung',2,0),
('HOOP-13-8-BAT-CHROME','13 inch 2.3mm Hoop','Hoops','HA01','Chrome Plated','13 x 8','Lea Hung',2,0),
('HOOP-13-8-BAT-BRASS','13 inch 2.3mm Hoop','Hoops','HA01','Brass Plated','13 x 8','Lea Hung',2,0),
('HOOP-13-8-SNR-CHROME','13 inch 2.3mm Hoop – Snare Side','Hoops','HA01-S','Chrome Plated','13 x 8','Lea Hung',2,0),
('HOOP-13-8-SNR-BRASS','13 inch 2.3mm Hoop – Snare Side','Hoops','HA01-S','Brass Plated','13 x 8','Lea Hung',2,0),
('HOOP-14-10-BAT-CHROME','14 inch 2.3mm Hoop','Hoops','HA01','Chrome Plated','14 x 10','Lea Hung',2,0),
('HOOP-14-10-BAT-BRASS','14 inch 2.3mm Hoop','Hoops','HA01','Brass Plated','14 x 10','Lea Hung',2,0),
('HOOP-14-10-SNR-CHROME','14 inch 2.3mm Hoop – Snare Side','Hoops','HA01-S','Chrome Plated','14 x 10','Lea Hung',2,0),
('HOOP-14-10-SNR-BRASS','14 inch 2.3mm Hoop – Snare Side','Hoops','HA01-S','Brass Plated','14 x 10','Lea Hung',2,0),
-- Tom hoops, top and bottom use same stock item
('TOM-HOOP-8-6-CHROME','8 inch 2.3mm Tom Hoop','Hoops','HA01','Chrome Plated','8 x 6','Lea Hung',4,0),
('TOM-HOOP-8-6-BRASS','8 inch 2.3mm Tom Hoop','Hoops','HA01','Brass Plated','8 x 6','Lea Hung',2,0),
('TOM-HOOP-10-6-CHROME','10 inch 2.3mm Tom Hoop','Hoops','HA01','Chrome Plated','10 x 6','Lea Hung',4,0),
('TOM-HOOP-10-6-BRASS','10 inch 2.3mm Tom Hoop','Hoops','HA01','Brass Plated','10 x 6','Lea Hung',2,0),
('TOM-HOOP-12-6-CHROME','12 inch 2.3mm Tom Hoop','Hoops','HA01','Chrome Plated','12 x 6','Lea Hung',4,0),
('TOM-HOOP-12-6-BRASS','12 inch 2.3mm Tom Hoop','Hoops','HA01','Brass Plated','12 x 6','Lea Hung',2,0),
-- Floor-tom hoops
('FLOOR-HOOP-14-8-CHROME','14 inch 2.3mm Floor Tom Hoop','Hoops','HA01','Chrome Plated','14 x 8','Lea Hung',4,0),
('FLOOR-HOOP-14-8-BRASS','14 inch 2.3mm Floor Tom Hoop','Hoops','HA01','Brass Plated','14 x 8','Lea Hung',2,0),
('FLOOR-HOOP-16-8-CHROME','16 inch 2.3mm Floor Tom Hoop','Hoops','HA01','Chrome Plated','16 x 8','Lea Hung',4,0),
('FLOOR-HOOP-16-8-BRASS','16 inch 2.3mm Floor Tom Hoop','Hoops','HA01','Brass Plated','16 x 8','Lea Hung',2,0),
('FLOOR-HOOP-18-8-CHROME','18 inch 2.3mm Floor Tom Hoop','Hoops','HA01','Chrome Plated','18 x 8','Lea Hung',4,0),
('FLOOR-HOOP-18-8-BRASS','18 inch 2.3mm Floor Tom Hoop','Hoops','HA01','Brass Plated','18 x 8','Lea Hung',2,0),
-- Floor tom fittings
('FLOOR-LEG-SET','Floor Tom Leg Set (3 piece)','Floor Tom Hardware','FL05-120540','Chrome Plated','3 piece set','Lea Hung',4,0),
('TOM-MOUNT','Tom Mount','Floor Tom Hardware','TM001','Chrome Plated','Tom mount','Lea Hung',12,0),
-- Bass drum fittings
('BASS-CLAW-CHROME','Bass Drum Claw','Bass Drum Hardware','BC-010CR','Chrome Plated','Bass drum claw','Lea Hung',32,0),
('BASS-SPUR-CHROME','Bass Drum Spur','Bass Drum Hardware','BDS008CR','Chrome Plated','Spur set','Lea Hung',2,0),
('BASS-BALL-LUG-CHROME','Bass Drum Ball Lug','Lugs','ATL01-00CR','Chrome Plated','Bass drum ball lug','Lea Hung',32,0),
('BASS-LUG-GASKET','Bass Drum Lug Gasket','Bass Drum Hardware','ATL01-00CR','Black','Lug gasket','Lea Hung',32,0),
-- Maple bass-drum hoops (two per bass drum)
('BASS-HOOP-18','Maple Bass Drum Hoop','Hoops','HA06','Natural Maple','18 inch','Lea Hung',4,0),
('BASS-HOOP-20','Maple Bass Drum Hoop','Hoops','HA06','Natural Maple','20 inch','Lea Hung',4,0),
('BASS-HOOP-22','Maple Bass Drum Hoop','Hoops','HA06','Natural Maple','22 inch','Lea Hung',4,0),
('BASS-HOOP-24','Maple Bass Drum Hoop','Hoops','HA06','Natural Maple','24 inch','Lea Hung',4,0),
-- Snare wire chrome and brass
('WIRE-10-CHROME','Snare Wire','Snare Wires','SE04-1020CI','Chrome Plated','10 inch','Lea Hung',4,0),
('WIRE-10-BRASS','Snare Wire','Snare Wires','SE04-1020CI','Brass Plated','10 inch','Lea Hung',2,0),
('WIRE-12-CHROME','Snare Wire','Snare Wires','SE04-1220CI','Chrome Plated','12 inch','Lea Hung',4,0),
('WIRE-12-BRASS','Snare Wire','Snare Wires','SE04-1220CI','Brass Plated','12 inch','Lea Hung',2,0),
('WIRE-13-CHROME','Snare Wire','Snare Wires','SE04-1320CI','Chrome Plated','13 inch','Lea Hung',4,0),
('WIRE-13-BRASS','Snare Wire','Snare Wires','SE04-1320CI','Brass Plated','13 inch','Lea Hung',2,0),
('WIRE-14-CHROME','Snare Wire','Snare Wires','SE04-1420CI','Chrome Plated','14 inch','Lea Hung',6,0),
('WIRE-14-BRASS','Snare Wire','Snare Wires','SE04-1420CI','Brass Plated','14 inch','Lea Hung',2,0);

-- Add or update rows without replacing stock quantities or entered costs.
update public.hardware_parts hp
set part_name=t.part_name, category=t.category, code=t.code, finish=t.finish,
    size=t.size, supplier=t.supplier,
    reorder_level=case when coalesce(hp.reorder_level,0)=0 then t.reorder_level else hp.reorder_level end,
    landed_cost_aud=case when coalesce(hp.landed_cost_aud,0)=0 then t.landed_cost_aud else hp.landed_cost_aud end
from nowak_v778_parts t where hp.sku_key=t.sku_key;

insert into public.hardware_parts
(id,sku_key,part_name,category,code,finish,size,qty_on_hand,reorder_level,landed_cost_aud,supplier)
select gen_random_uuid(),t.sku_key,t.part_name,t.category,t.code,t.finish,t.size,0,t.reorder_level,t.landed_cost_aud,t.supplier
from nowak_v778_parts t
where not exists (select 1 from public.hardware_parts hp where hp.sku_key=t.sku_key);

-- Preserve old chrome stock by moving it into the new chrome SKU where possible.
do $$
declare r record; old_id uuid; new_id uuid; old_qty numeric;
begin
  for r in select * from (values
    ('LUG-38','LUG-38-CHROME'),('LUG-70','LUG-70-CHROME'),('LUG-88','LUG-88-CHROME'),('LUG-114','LUG-114-CHROME'),
    ('VENT-20','VENT-20-CHROME'),('VENT-30','VENT-30-CHROME'),
    ('WIRE-10','WIRE-10-CHROME'),('WIRE-12','WIRE-12-CHROME'),('WIRE-13','WIRE-13-CHROME'),('WIRE-14','WIRE-14-CHROME'),
    ('HOOP-10-6-BAT','HOOP-10-6-BAT-CHROME'),('HOOP-10-6-SNR','HOOP-10-6-SNR-CHROME'),
    ('HOOP-12-8-BAT','HOOP-12-8-BAT-CHROME'),('HOOP-12-8-SNR','HOOP-12-8-SNR-CHROME'),
    ('HOOP-13-8-BAT','HOOP-13-8-BAT-CHROME'),('HOOP-13-8-SNR','HOOP-13-8-SNR-CHROME'),
    ('HOOP-14-10-BAT','HOOP-14-10-BAT-CHROME'),('HOOP-14-10-SNR','HOOP-14-10-SNR-CHROME')
  ) x(old_key,new_key)
  loop
    select id,coalesce(qty_on_hand,0) into old_id,old_qty from public.hardware_parts where sku_key=r.old_key limit 1;
    select id into new_id from public.hardware_parts where sku_key=r.new_key limit 1;
    if old_id is not null and new_id is not null then
      update public.hardware_parts set qty_on_hand=coalesce(qty_on_hand,0)+old_qty where id=new_id;
      if to_regclass('public.hardware_allocations') is not null then
        update public.hardware_allocations set hardware_part_id=new_id where hardware_part_id=old_id;
      end if;
      delete from public.hardware_parts where id=old_id;
    end if;
    old_id:=null;new_id:=null;old_qty:=0;
  end loop;
end $$;

select 'v7.7.9 tom, kit and HA06 bass-drum hoop setup complete' as status;
