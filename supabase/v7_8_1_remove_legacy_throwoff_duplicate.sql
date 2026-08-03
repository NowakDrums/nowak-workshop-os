-- Nowak Workshop OS v7.8.1
-- Permanently removes the obsolete "Throw Off + Butt Plate" duplicate.
-- It represents the same physical Chrome Trick throw-off stock and must not be
-- added to the retained quantity or inventory value. Safe to run more than once.

update public.hardware_parts
set category='Throw-Offs'
where lower(regexp_replace(coalesce(category,''), '[^a-z]', '', 'g')) in ('throwoff','throwoffs');

do $$
declare
  keeper_id uuid;
  legacy record;
  alloc record;
  existing_id uuid;
begin
  select id into keeper_id
  from public.hardware_parts
  where lower(regexp_replace(coalesce(part_name,''), '[^a-z0-9]', '', 'g'))='trickthrowoff'
    and lower(regexp_replace(coalesce(finish,''), '[^a-z]', '', 'g')) not in ('gold','brass','blacknickel')
  order by qty_on_hand desc nulls last, created_at nulls last
  limit 1;

  if keeper_id is not null then
    for legacy in
      select * from public.hardware_parts
      where id<>keeper_id
        and lower(regexp_replace(coalesce(part_name,''), '[^a-z0-9]', '', 'g'))
            in ('throwoffbuttplate','throwoffandbuttplate')
    loop
      if to_regclass('public.hardware_allocations') is not null then
        for alloc in select * from public.hardware_allocations where hardware_part_id=legacy.id
        loop
          select id into existing_id
          from public.hardware_allocations
          where drum_id=alloc.drum_id
            and hardware_part_id=keeper_id
            and status=alloc.status
          limit 1;

          if existing_id is not null then
            update public.hardware_allocations
            set quantity=coalesce(quantity,0)+coalesce(alloc.quantity,0)
            where id=existing_id;
            delete from public.hardware_allocations where id=alloc.id;
          else
            update public.hardware_allocations set hardware_part_id=keeper_id where id=alloc.id;
          end if;
          existing_id := null;
        end loop;
      end if;

      if to_regclass('public.purchase_order_items') is not null then
        update public.purchase_order_items set hardware_part_id=keeper_id where hardware_part_id=legacy.id;
      end if;

      delete from public.hardware_parts where id=legacy.id;
    end loop;
  end if;
end $$;

select 'v7.8.1 legacy throw-off duplicate removed' as status;
