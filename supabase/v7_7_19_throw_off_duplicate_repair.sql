-- Nowak Workshop OS v7.7.19
-- Repair duplicate Trick throw-off records and category spellings.
-- Safe to run more than once.

alter table public.hardware_parts add column if not exists sku_key text;

-- First use one category spelling everywhere.
update public.hardware_parts
set category='Throw-Offs'
where lower(regexp_replace(coalesce(category,''),'[^a-z]','','g')) in ('throwoff','throwoffs');

-- Normalise blank / legacy finish names for Trick throw-offs.
update public.hardware_parts
set finish = case
  when lower(coalesce(finish,'')) like '%gold%' or lower(coalesce(finish,'')) like '%brass%' then 'Gold'
  when lower(coalesce(finish,'')) like '%black%nickel%' then 'Black Nickel'
  else 'Chrome'
end,
part_name='Trick Throw-Off',
supplier='Trick Drums'
where category='Throw-Offs' and lower(coalesce(part_name,'')) like '%trick%';

-- Merge true duplicates while retaining separate finish variants.
do $$
declare
  finish_name text;
  keeper uuid;
  duplicate_row record;
  allocation_row record;
  existing_allocation uuid;
begin
  for finish_name in
    select distinct coalesce(nullif(trim(finish),''),'Chrome')
    from public.hardware_parts
    where category='Throw-Offs' and lower(coalesce(part_name,'')) like '%trick%'
  loop
    select id into keeper
    from public.hardware_parts
    where category='Throw-Offs'
      and lower(coalesce(part_name,'')) like '%trick%'
      and coalesce(nullif(trim(finish),''),'Chrome')=finish_name
    order by
      case when coalesce(qty_on_hand,0)>0 then 0 else 1 end,
      case when coalesce(landed_cost_aud,0)>0 then 0 else 1 end,
      created_at nulls last,
      id
    limit 1;

    if keeper is null then continue; end if;

    -- Give the retained row a stable identity.
    update public.hardware_parts
    set category='Throw-Offs',
        part_name='Trick Throw-Off',
        supplier='Trick Drums',
        finish=finish_name,
        code=case
          when finish_name='Gold' then 'THROW-TRICK-G'
          when finish_name='Black Nickel' then 'THROW-TRICK-BN'
          else 'THROW-TRICK'
        end,
        sku_key=case
          when finish_name='Gold' then 'THROW-TRICK-GOLD'
          when finish_name='Black Nickel' then 'THROW-TRICK-BLACK-NICKEL'
          else 'THROW-TRICK-CHROME'
        end
    where id=keeper;

    for duplicate_row in
      select * from public.hardware_parts
      where id<>keeper
        and category='Throw-Offs'
        and lower(coalesce(part_name,'')) like '%trick%'
        and coalesce(nullif(trim(finish),''),'Chrome')=finish_name
    loop
      update public.hardware_parts
      set qty_on_hand=coalesce(qty_on_hand,0)+coalesce(duplicate_row.qty_on_hand,0),
          reorder_level=greatest(coalesce(reorder_level,0),coalesce(duplicate_row.reorder_level,0)),
          landed_cost_aud=case
            when coalesce(landed_cost_aud,0)=0 then coalesce(duplicate_row.landed_cost_aud,0)
            else landed_cost_aud
          end
      where id=keeper;

      if to_regclass('public.hardware_allocations') is not null then
        for allocation_row in
          select * from public.hardware_allocations where hardware_part_id=duplicate_row.id
        loop
          select id into existing_allocation
          from public.hardware_allocations
          where drum_id=allocation_row.drum_id
            and hardware_part_id=keeper
            and status=allocation_row.status
          limit 1;

          if existing_allocation is not null then
            update public.hardware_allocations
            set quantity=coalesce(quantity,0)+coalesce(allocation_row.quantity,0)
            where id=existing_allocation;
            delete from public.hardware_allocations where id=allocation_row.id;
          else
            update public.hardware_allocations set hardware_part_id=keeper where id=allocation_row.id;
          end if;
          existing_allocation := null;
        end loop;
      end if;

      if to_regclass('public.purchase_order_items') is not null then
        update public.purchase_order_items
        set hardware_part_id=keeper
        where hardware_part_id=duplicate_row.id;
      end if;

      delete from public.hardware_parts where id=duplicate_row.id;
    end loop;
  end loop;
end $$;

select 'v7.7.19 throw-off duplicate repair installed' as status;
