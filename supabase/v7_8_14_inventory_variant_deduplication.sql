-- Nowak Workshop OS v7.8.14
-- Repairs duplicate finish variants without inflating physical stock.
-- For true duplicates, retain the oldest row and use the highest recorded quantity.

begin;

-- Standardise finish wording first.
update hardware_parts
set finish = case
  when lower(coalesce(finish,'')) like '%black%nickel%' then 'Black Nickel'
  when category = 'Snare Wires' and lower(coalesce(finish,'')) like '%brass%' then 'Brass'
  when lower(coalesce(finish,'')) like '%brass%' or lower(coalesce(finish,'')) like '%gold%' then 'Brass Plated'
  when lower(coalesce(finish,'')) like '%stainless%' then 'Stainless Steel'
  when lower(coalesce(finish,'')) like '%chrome%' then 'Chrome Plated'
  else finish
end;

-- Special hardware finishes do not drive reorder alerts. Snare wires are the exception.
update hardware_parts
set reorder_level = 0
where category <> 'Snare Wires'
  and (lower(coalesce(finish,'')) like '%brass%'
       or lower(coalesce(finish,'')) like '%gold%'
       or lower(coalesce(finish,'')) like '%black%nickel%');

with ranked as (
  select
    id,
    first_value(id) over (
      partition by
        lower(trim(coalesce(category,''))),
        regexp_replace(upper(trim(coalesce(code,''))), '-(BR|BN)$', ''),
        lower(trim(coalesce(size,''))),
        case
          when lower(coalesce(finish,'')) like '%black%nickel%' then 'black nickel'
          when lower(coalesce(finish,'')) like '%brass%' or lower(coalesce(finish,'')) like '%gold%' then 'brass'
          when lower(coalesce(finish,'')) like '%stainless%' then 'stainless steel'
          when lower(coalesce(finish,'')) like '%chrome%' then 'chrome'
          else lower(trim(coalesce(finish,'')))
        end
      order by created_at nulls last, id
    ) as keep_id,
    max(coalesce(qty_on_hand,0)) over (
      partition by lower(trim(coalesce(category,''))), regexp_replace(upper(trim(coalesce(code,''))), '-(BR|BN)$', ''), lower(trim(coalesce(size,''))),
      case when lower(coalesce(finish,'')) like '%black%nickel%' then 'black nickel' when lower(coalesce(finish,'')) like '%brass%' or lower(coalesce(finish,'')) like '%gold%' then 'brass' when lower(coalesce(finish,'')) like '%stainless%' then 'stainless steel' when lower(coalesce(finish,'')) like '%chrome%' then 'chrome' else lower(trim(coalesce(finish,''))) end
    ) as max_qty,
    max(coalesce(reorder_level,0)) over (
      partition by lower(trim(coalesce(category,''))), regexp_replace(upper(trim(coalesce(code,''))), '-(BR|BN)$', ''), lower(trim(coalesce(size,''))),
      case when lower(coalesce(finish,'')) like '%black%nickel%' then 'black nickel' when lower(coalesce(finish,'')) like '%brass%' or lower(coalesce(finish,'')) like '%gold%' then 'brass' when lower(coalesce(finish,'')) like '%stainless%' then 'stainless steel' when lower(coalesce(finish,'')) like '%chrome%' then 'chrome' else lower(trim(coalesce(finish,''))) end
    ) as max_minimum
  from hardware_parts
), keep_values as (
  select keep_id, max(max_qty) max_qty, max(max_minimum) max_minimum
  from ranked group by keep_id
)
update hardware_parts h
set qty_on_hand = k.max_qty,
    reorder_level = case when h.category='Snare Wires' then k.max_minimum else h.reorder_level end
from keep_values k
where h.id = k.keep_id;

with ranked as (
  select id,
    row_number() over (
      partition by lower(trim(coalesce(category,''))), regexp_replace(upper(trim(coalesce(code,''))), '-(BR|BN)$', ''), lower(trim(coalesce(size,''))),
      case when lower(coalesce(finish,'')) like '%black%nickel%' then 'black nickel' when lower(coalesce(finish,'')) like '%brass%' or lower(coalesce(finish,'')) like '%gold%' then 'brass' when lower(coalesce(finish,'')) like '%stainless%' then 'stainless steel' when lower(coalesce(finish,'')) like '%chrome%' then 'chrome' else lower(trim(coalesce(finish,''))) end
      order by created_at nulls last, id
    ) rn
  from hardware_parts
)
delete from hardware_parts h using ranked r where h.id=r.id and r.rn>1;

commit;
