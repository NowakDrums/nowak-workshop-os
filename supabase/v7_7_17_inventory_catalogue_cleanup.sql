-- Nowak Workshop OS v7.7.17
-- Inventory catalogue cleanup. Safe to run after v7.7.12 and repeat-safe.

create extension if not exists pgcrypto;

alter table public.hardware_parts add column if not exists sku_key text;

-- Use one category spelling so Inventory Audit does not split the value.
update public.hardware_parts
set category = 'Throw-Offs'
where lower(regexp_replace(coalesce(category,''), '[^a-z]', '', 'g')) in ('throwoff','throwoffs');

-- Snare wires are either Brass or Stainless Steel, not Chrome.
update public.hardware_parts
set finish = 'Stainless Steel'
where lower(coalesce(category,'')) = 'snare wires'
  and lower(coalesce(finish,'')) in ('chrome','chrome plated');

-- Ensure the correct ATL01-01 ball-lug row exists.
insert into public.hardware_parts
  (sku_key, part_name, category, code, finish, size, supplier, qty_on_hand, reorder_level, landed_cost_aud)
select
  'BALL-LUG-CHROME','Agile Tube Lug – Ball','Lugs','ATL01-01','Chrome Plated','Ball lug','Lea Hung',0,24,0
where not exists (
  select 1 from public.hardware_parts
  where sku_key='BALL-LUG-CHROME' or upper(coalesce(code,''))='ATL01-01'
);

-- Normalise the correct row's identity.
update public.hardware_parts
set sku_key = coalesce(nullif(sku_key,''),'BALL-LUG-CHROME'),
    part_name = 'Agile Tube Lug – Ball',
    category = 'Lugs',
    code = 'ATL01-01',
    finish = case when lower(coalesce(finish,'')) like '%brass%' then 'Brass Plated' else 'Chrome Plated' end,
    size = 'Ball lug',
    supplier = 'Lea Hung'
where sku_key='BALL-LUG-CHROME'
   or upper(coalesce(code,''))='ATL01-01';

-- Merge the erroneous ATL01-00CR / BASS-BALL-LUG-CHROME record into ATL01-01.
do $$
declare
  correct_id uuid;
  wrong record;
  alloc record;
  existing_id uuid;
begin
  select id into correct_id
  from public.hardware_parts
  where sku_key='BALL-LUG-CHROME' or upper(coalesce(code,''))='ATL01-01'
  order by case when sku_key='BALL-LUG-CHROME' then 0 else 1 end, created_at nulls last
  limit 1;

  if correct_id is not null then
    for wrong in
      select * from public.hardware_parts
      where id<>correct_id
        and (sku_key='BASS-BALL-LUG-CHROME' or (upper(coalesce(code,''))='ATL01-00CR' and lower(coalesce(part_name,'')) not like '%gasket%'))
    loop
      update public.hardware_parts
      set qty_on_hand = coalesce(qty_on_hand,0) + coalesce(wrong.qty_on_hand,0),
          landed_cost_aud = case when coalesce(landed_cost_aud,0)=0 then coalesce(wrong.landed_cost_aud,0) else landed_cost_aud end,
          reorder_level = greatest(coalesce(reorder_level,0),coalesce(wrong.reorder_level,0))
      where id=correct_id;

      if to_regclass('public.hardware_allocations') is not null then
        for alloc in select * from public.hardware_allocations where hardware_part_id=wrong.id
        loop
          select id into existing_id
          from public.hardware_allocations
          where drum_id=alloc.drum_id and hardware_part_id=correct_id and status=alloc.status
          limit 1;

          if existing_id is not null then
            update public.hardware_allocations
            set quantity=quantity+alloc.quantity
            where id=existing_id;
            delete from public.hardware_allocations where id=alloc.id;
          else
            update public.hardware_allocations set hardware_part_id=correct_id where id=alloc.id;
          end if;
          existing_id := null;
        end loop;
      end if;

      delete from public.hardware_parts where id=wrong.id;
    end loop;
  end if;
end $$;

-- Correct the gasket description; it remains a separate stock item.
update public.hardware_parts
set part_name='Ball Lug Gasket', code='ATL01-01-GASKET', size='ATL01-01 gasket'
where sku_key='BASS-LUG-GASKET'
   or (lower(coalesce(part_name,'')) like '%gasket%' and upper(coalesce(code,''))='ATL01-00CR');

select 'v7.7.17 inventory catalogue cleanup installed' as status;
