-- Nowak Workshop OS v7.8.7
-- Consolidate duplicate Agile Tube Lug – Ball Chrome Plated catalogue rows.
-- Keeps the row with the greatest physical stock, then the newest row.
-- Existing quantities are not added together because duplicate rows represent the same physical stock.

do $$
declare
  keeper uuid;
  duplicate_row record;
  allocation_row record;
begin
  select id into keeper
  from public.hardware_parts
  where upper(coalesce(code,''))='ATL01-01'
    and lower(coalesce(finish,'')) like '%chrome%'
  order by coalesce(qty_on_hand,0) desc, created_at desc nulls last, id
  limit 1;

  if keeper is null then return; end if;

  for duplicate_row in
    select * from public.hardware_parts
    where upper(coalesce(code,''))='ATL01-01'
      and lower(coalesce(finish,'')) like '%chrome%'
      and id<>keeper
  loop
    if to_regclass('public.hardware_allocations') is not null then
      for allocation_row in select * from public.hardware_allocations where hardware_part_id=duplicate_row.id
      loop
        if exists (
          select 1 from public.hardware_allocations
          where drum_id=allocation_row.drum_id
            and hardware_part_id=keeper
            and status=allocation_row.status
        ) then
          update public.hardware_allocations
          set quantity=quantity+allocation_row.quantity
          where drum_id=allocation_row.drum_id
            and hardware_part_id=keeper
            and status=allocation_row.status;
          delete from public.hardware_allocations where id=allocation_row.id;
        else
          update public.hardware_allocations set hardware_part_id=keeper where id=allocation_row.id;
        end if;
      end loop;
    end if;

    if to_regclass('public.purchase_order_items') is not null then
      update public.purchase_order_items set hardware_part_id=keeper where hardware_part_id=duplicate_row.id;
    end if;

    delete from public.hardware_parts where id=duplicate_row.id;
  end loop;

  update public.hardware_parts
  set part_name='Agile Tube Lug – Ball', code='ATL01-01', finish='Chrome Plated', size='Ball lug'
  where id=keeper;
end $$;
