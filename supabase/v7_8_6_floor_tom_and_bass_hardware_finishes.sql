-- Nowak Workshop OS v7.8.6
-- Pre-create Brass Plated and Black Nickel variants for floor tom and bass drum hardware.
-- Safe to run more than once. Existing variants are left unchanged.

insert into public.hardware_parts (part_name, category, code, finish, size, qty_on_hand, reorder_level, landed_cost_aud, supplier, notes)
select
  base.part_name,
  base.category,
  coalesce(base.code, 'HW') || suffix.code_suffix,
  suffix.finish,
  base.size,
  0,
  coalesce(base.reorder_level, 0),
  coalesce(base.landed_cost_aud, 0),
  base.supplier,
  'Colour variant of ' || coalesce(base.code, base.part_name)
from public.hardware_parts base
cross join (values ('Brass Plated','-BR'),('Black Nickel','-BN')) as suffix(finish, code_suffix)
where base.category in ('Floor Tom Hardware','Bass Drum Hardware')
  and lower(coalesce(base.finish,'')) like '%chrome%'
  and not exists (
    select 1
    from public.hardware_parts existing
    where existing.category = base.category
      and lower(coalesce(existing.part_name,'')) = lower(coalesce(base.part_name,''))
      and lower(coalesce(existing.size,'')) = lower(coalesce(base.size,''))
      and lower(coalesce(existing.finish,'')) = lower(suffix.finish)
  );
