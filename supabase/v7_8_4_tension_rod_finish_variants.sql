-- Nowak Workshop OS v7.8.4
-- Adds Brass Plated and Black Nickel variants for every standard tension rod.
-- New variants start at zero stock and retain the base part's supplier, size,
-- reorder level and landed-cost estimate.

insert into hardware_parts (
  part_name, category, code, finish, size,
  qty_on_hand, reorder_level, landed_cost_aud, supplier, notes
)
select
  base.part_name,
  base.category,
  coalesce(nullif(base.code,''),'TROD') || finish_data.suffix,
  finish_data.finish,
  base.size,
  0,
  coalesce(base.reorder_level,0),
  coalesce(base.landed_cost_aud,0),
  base.supplier,
  'Colour variant of ' || coalesce(nullif(base.code,''),base.part_name)
from hardware_parts base
cross join (values
  ('Brass Plated','-BR'),
  ('Black Nickel','-BN')
) as finish_data(finish,suffix)
where base.category='Tension Rods'
  and (
    lower(coalesce(base.finish,'')) like '%stainless%'
    or lower(coalesce(base.finish,'')) like '%chrome%'
    or coalesce(base.finish,'')=''
  )
  and not exists (
    select 1
    from hardware_parts existing
    where existing.category='Tension Rods'
      and lower(regexp_replace(coalesce(existing.part_name,''),'[^a-z0-9]+','','g'))
          = lower(regexp_replace(coalesce(base.part_name,''),'[^a-z0-9]+','','g'))
      and lower(regexp_replace(coalesce(existing.size,''),'[^a-z0-9]+','','g'))
          = lower(regexp_replace(coalesce(base.size,''),'[^a-z0-9]+','','g'))
      and lower(coalesce(existing.finish,''))=lower(finish_data.finish)
  );
