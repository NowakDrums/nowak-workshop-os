-- Nowak Workshop OS v7.7.19
-- Consolidates duplicate Trick throw-off records and category spellings.
-- Safe to run after v7.7.17 or later. Existing quantities, costs and allocations are preserved.

create extension if not exists pgcrypto;

alter table public.hardware_parts add column if not exists sku_key text;

-- Standardise every throw-off category spelling first.
update public.hardware_parts
set category='Throw-Offs'
where lower(regexp_replace(coalesce(category,''),'[^a-z]','','g')) in ('throwoff','throwoffs')
   or lower(coalesce(part_name,'')) like '%throw%off%';

-- Treat blank/legacy Trick rows as Chrome unless explicitly Gold/Brass.
update public.hardware_parts
set finish = case
  when lower(coalesce(finish,'')) ~ '(gold|brass)' then 'Gold'
  else 'Chrome'
end
where category='Throw-Offs'
  and lower(coalesce(part_name,'')) like '%trick%';

-- Merge all Chrome Trick rows into one record and all Gold Trick rows into one record.
do $$
declare
  finish_name text;
  canonical_sku text;
  canonical_code text;
  ids uuid[];
  keeper uuid;
  alloc record;
  existing_id uuid;
begin
  foreach finish_name in array array['Chrome','Gold']
  loop
    canonical_sku := case when finish_name='Gold' then 'THROW-TRICK-GOLD' else 'THROW-TRICK-CHROME' end;
    canonical_code := case when finish_name='Gold' then 'THROW-TRICK-G' else 'THROW-TRICK' end;

    select array_agg(id order by
      case when sku_key=canonical_sku then 0 else 1 end,
      created_at nulls last,
      id)
    into ids
    from public.hardware_parts
    where category='Throw-Offs'
      and lower(coalesce(part_name,'')) like '%trick%'
      and (case when lower(coalesce(finish,'')) ~ '(gold|brass)' then 'Gold' else 'Chrome' end)=finish_name;

    if coalesce(array_length(ids,1),0)=0 then
      if finish_name='Chrome' then
        insert into public.hardware_parts
          (sku_key,part_name,category,code,finish,size,qty_on_hand,reorder_level,landed_cost_aud,supplier)
        values
          (canonical_sku,'Trick Throw-Off','Throw-Offs',canonical_code,finish_name,finish_name,0,4,0,'Trick Drums');
      end if;
    else
      keeper := ids[1];

      update public.hardware_parts hp
      set qty_on_hand = totals.qty,
          reorder_level = greatest(coalesce(hp.reorder_level,0),totals.reorder_level),
          landed_cost_aud = case when coalesce(hp.landed_cost_aud,0)>0 then hp.landed_cost_aud else totals.cost end,
          sku_key = canonical_sku,
          part_name = 'Trick Throw-Off',
          category = 'Throw-Offs',
          code = canonical_code,
          finish = finish_name,
          size = finish_name,
          supplier = 'Trick Drums'
      from (
        select sum(coalesce(qty_on_hand,0)) qty,
               max(coalesce(reorder_level,0)) reorder_level,
               max(coalesce(landed_cost_aud,0)) cost
        from public.hardware_parts
        where id=any(ids)
      ) totals
      where hp.id=keeper;

      if coalesce(array_length(ids,1),0)>1 and to_regclass('public.hardware_allocations') is not null then
        for alloc in
          select * from public.hardware_allocations
          where hardware_part_id=any(ids[2:array_length(ids,1)])
        loop
          select id into existing_id
          from public.hardware_allocations
          where drum_id=alloc.drum_id
            and hardware_part_id=keeper
            and status=alloc.status
          limit 1;

          if existing_id is not null then
            update public.hardware_allocations
            set quantity=quantity+alloc.quantity
            where id=existing_id;
            delete from public.hardware_allocations where id=alloc.id;
          else
            update public.hardware_allocations
            set hardware_part_id=keeper
            where id=alloc.id;
          end if;
          existing_id := null;
        end loop;
      end if;

      if coalesce(array_length(ids,1),0)>1 then
        delete from public.hardware_parts
        where id=any(ids[2:array_length(ids,1)]);
      end if;
    end if;
  end loop;
end $$;

-- Remove an unused zero-stock Gold record so the everyday inventory remains simple.
delete from public.hardware_parts hp
where hp.sku_key='THROW-TRICK-GOLD'
  and coalesce(hp.qty_on_hand,0)=0
  and not exists (
    select 1 from public.hardware_allocations a
    where a.hardware_part_id=hp.id and a.status in ('Allocated','Consumed')
  );

-- Defensive uniqueness for the canonical internal keys.
delete from public.hardware_parts a
using public.hardware_parts b
where a.id>b.id
  and a.sku_key is not null
  and a.sku_key=b.sku_key;

create unique index if not exists hardware_parts_sku_key_unique
  on public.hardware_parts(sku_key)
  where sku_key is not null;

select 'v7.7.19 throw-off duplicates consolidated' as status;
