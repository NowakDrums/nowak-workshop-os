-- Nowak Workshop OS v7.9.1
-- One-time repair for hardware that earlier app versions deducted while the drum
-- was still in production. It restores the physical on-hand quantity and changes
-- those rows back to Allocated reservations.
-- Safe to run more than once: only rows still marked Consumed are processed.

begin;

with reservations_to_restore as (
  select
    ha.id as allocation_id,
    ha.hardware_part_id,
    ha.quantity
  from public.hardware_allocations ha
  join public.drums d on d.id = ha.drum_id
  where lower(coalesce(ha.status, '')) = 'consumed'
    and coalesce(d.notes, '') not like '%[x] Assembled%'
    and lower(coalesce(d.lifecycle_status, 'production')) not in ('completed','sold','shipped','archived')
), restored_totals as (
  select hardware_part_id, sum(quantity)::numeric as quantity_to_restore
  from reservations_to_restore
  group by hardware_part_id
)
update public.hardware_parts hp
set qty_on_hand = coalesce(hp.qty_on_hand, 0) + rt.quantity_to_restore
from restored_totals rt
where hp.id = rt.hardware_part_id;

with reservations_to_restore as (
  select ha.id
  from public.hardware_allocations ha
  join public.drums d on d.id = ha.drum_id
  where lower(coalesce(ha.status, '')) = 'consumed'
    and coalesce(d.notes, '') not like '%[x] Assembled%'
    and lower(coalesce(d.lifecycle_status, 'production')) not in ('completed','sold','shipped','archived')
)
update public.hardware_allocations ha
set status = 'Allocated',
    consumed_at = null,
    released_at = null
from reservations_to_restore r
where ha.id = r.id;

commit;
