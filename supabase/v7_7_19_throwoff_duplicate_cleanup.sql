-- Nowak Workshop OS v7.7.19
-- Remove the obsolete duplicate "Throw Off + Butt Plate" stock line.
-- The legacy quantity is intentionally NOT added to Trick Throw-Off because it
-- represents the same physical hardware and was inflating inventory value.
-- Existing drum allocations are moved to the retained Trick Throw-Off row.

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
    and lower(coalesce(finish,'')) not like '%gold%'
  order by qty_on_hand desc nulls last, created_at nulls last
  limit 1;

  -- If a retained Trick row is absent, convert the first legacy row rather than deleting it.
  if keeper_id is null then
    select id into keeper_id
    from public.hardware_parts
    where lower(regexp_replace(coalesce(part_name,''), '[^a-z0-9]', '', 'g'))
          in ('throwoffbuttplate','throwoffandbuttplate')
    order by created_at nulls last
    limit 1;

    if keeper_id is not null then
      update public.hardware_parts
      set part_name='Trick Throw-Off', category='Throw-Offs', code='THROW-TRICK',
          finish=case when coalesce(finish,'')='' then 'Chrome' else finish end,
          size=case when coalesce(size,'')='' then 'Chrome' else size end,
          supplier=case when coalesce(supplier,'')='' then 'Trick Drums' else supplier end
      where id=keeper_id;
    end if;
  end if;

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
            set quantity=quantity+alloc.quantity
            where id=existing_id;
            delete from public.hardware_allocations where id=alloc.id;
          else
            update public.hardware_allocations
            set hardware_part_id=keeper_id
            where id=alloc.id;
          end if;
          existing_id := null;
        end loop;
      end if;

      delete from public.hardware_parts where id=legacy.id;
    end loop;
  end if;
end $$;

select 'v7.7.19 duplicate throw-off cleanup installed' as status;
