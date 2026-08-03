-- Nowak Workshop OS v7.6.5
-- Adds separate Chrome and Gold Trick throw-offs.
-- Safe to run after v7.6.4. Existing Trick quantity is retained as Chrome.

create extension if not exists pgcrypto;

alter table public.hardware_parts
  add column if not exists sku_key text;

-- Temporarily remove the SKU index while legacy Trick rows are normalised and merged.
drop index if exists public.hardware_parts_sku_key_unique;

-- Convert the existing generic Trick item to the Chrome item.
update public.hardware_parts
set sku_key = 'THROW-TRICK-CHROME',
    part_name = 'Trick Throw-Off',
    category = 'Throw-Offs',
    code = 'THROW-TRICK',
    finish = 'Chrome',
    size = 'Chrome',
    supplier = 'Trick Drums'
where category = 'Throw-Offs'
  and (
    sku_key in ('THROW-TRICK','THROW-TRICK-CHROME')
    or code = 'THROW-TRICK'
    or lower(coalesce(part_name,'')) like '%trick%'
  )
  and lower(coalesce(finish,'chrome')) <> 'gold';

-- Merge any duplicate Chrome rows while preserving quantities and allocations.
do $$
declare
  ids uuid[];
  keeper uuid;
begin
  select array_agg(id order by created_at nulls last, id)
  into ids
  from public.hardware_parts
  where sku_key = 'THROW-TRICK-CHROME';

  if coalesce(array_length(ids,1),0) > 1 then
    keeper := ids[1];

    update public.hardware_parts hp
    set qty_on_hand = x.qty,
        reorder_level = greatest(coalesce(hp.reorder_level,0),x.reorder_level),
        landed_cost_aud = case when coalesce(hp.landed_cost_aud,0)>0 then hp.landed_cost_aud else x.cost end
    from (
      select sum(coalesce(qty_on_hand,0)) qty,
             max(coalesce(reorder_level,0)) reorder_level,
             max(coalesce(landed_cost_aud,0)) cost
      from public.hardware_parts
      where id = any(ids)
    ) x
    where hp.id = keeper;

    if to_regclass('public.hardware_allocations') is not null then
      update public.hardware_allocations
      set hardware_part_id = keeper
      where hardware_part_id = any(ids[2:array_length(ids,1)]);
    end if;

    delete from public.hardware_parts
    where id = any(ids[2:array_length(ids,1)]);
  end if;
end $$;

-- Add Chrome if no previous Trick row existed.
insert into public.hardware_parts
  (sku_key,part_name,category,code,finish,size,qty_on_hand,reorder_level,landed_cost_aud,supplier)
select
  'THROW-TRICK-CHROME','Trick Throw-Off','Throw-Offs','THROW-TRICK','Chrome','Chrome',0,4,0,'Trick Drums'
where not exists (
  select 1 from public.hardware_parts where sku_key='THROW-TRICK-CHROME'
);

-- Add Gold as a separate stocktake item.
insert into public.hardware_parts
  (sku_key,part_name,category,code,finish,size,qty_on_hand,reorder_level,landed_cost_aud,supplier)
select
  'THROW-TRICK-GOLD','Trick Throw-Off','Throw-Offs','THROW-TRICK-G','Gold','Gold',0,2,0,'Trick Drums'
where not exists (
  select 1 from public.hardware_parts where sku_key='THROW-TRICK-GOLD'
);

-- Standardise both display rows.
update public.hardware_parts
set part_name='Trick Throw-Off', category='Throw-Offs', code='THROW-TRICK',
    finish='Chrome', size='Chrome', supplier='Trick Drums'
where sku_key='THROW-TRICK-CHROME';

update public.hardware_parts
set part_name='Trick Throw-Off', category='Throw-Offs', code='THROW-TRICK-G',
    finish='Gold', size='Gold', supplier='Trick Drums'
where sku_key='THROW-TRICK-GOLD';

-- Ensure the internal SKU keys are unique without relying on ON CONFLICT.
create unique index if not exists hardware_parts_sku_key_unique
  on public.hardware_parts(sku_key)
  where sku_key is not null;

alter table public.hardware_parts enable row level security;
drop policy if exists "Allow all hardware parts" on public.hardware_parts;
create policy "Allow all hardware parts"
  on public.hardware_parts for all using (true) with check (true);
grant all on public.hardware_parts to anon, authenticated;
