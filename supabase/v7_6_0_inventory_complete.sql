-- Nowak Workshop OS v7.6.0
-- Complete, repeat-safe snare hardware inventory migration.
-- This migration repairs duplicate hardware codes before applying uniqueness,
-- so it can be run after the earlier v7.5.9 migration failed on AIR01.

create extension if not exists pgcrypto;

create table if not exists public.hardware_parts (
  id uuid primary key default gen_random_uuid(),
  part_name text not null,
  category text,
  code text,
  finish text,
  size text,
  qty_on_hand numeric not null default 0,
  reorder_level numeric not null default 0,
  landed_cost_aud numeric not null default 0,
  supplier text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.hardware_parts
  add column if not exists supplier text,
  add column if not exists notes text,
  add column if not exists qty_on_hand numeric not null default 0,
  add column if not exists reorder_level numeric not null default 0,
  add column if not exists landed_cost_aud numeric not null default 0,
  add column if not exists created_at timestamptz not null default now();

-- Standardise codes so whitespace/case variants cannot create hidden duplicates.
update public.hardware_parts
set code = nullif(upper(trim(code)), '')
where code is distinct from nullif(upper(trim(code)), '');

-- Merge any duplicate part-code records before creating the unique index.
-- Stock quantities are combined. If allocations already exist, they are safely
-- moved to the retained part and duplicate active allocations are combined.
do $$
declare
  group_row record;
  duplicate_id uuid;
  keeper_id uuid;
  duplicate_qty numeric;
  allocation_row record;
begin
  for group_row in
    select code, array_agg(id order by created_at nulls last, id) as ids
    from public.hardware_parts
    where code is not null
    group by code
    having count(*) > 1
  loop
    keeper_id := group_row.ids[1];

    foreach duplicate_id in array group_row.ids[2:array_length(group_row.ids, 1)]
    loop
      select coalesce(qty_on_hand, 0)
      into duplicate_qty
      from public.hardware_parts
      where id = duplicate_id;

      update public.hardware_parts
      set qty_on_hand = coalesce(qty_on_hand, 0) + coalesce(duplicate_qty, 0)
      where id = keeper_id;

      if to_regclass('public.hardware_allocations') is not null then
        for allocation_row in execute format(
          'select id, drum_id, quantity, status from public.hardware_allocations where hardware_part_id = %L::uuid',
          duplicate_id
        )
        loop
          if allocation_row.status = 'Allocated' and exists (
            select 1
            from public.hardware_allocations
            where drum_id = allocation_row.drum_id
              and hardware_part_id = keeper_id
              and status = 'Allocated'
          ) then
            update public.hardware_allocations
            set quantity = quantity + allocation_row.quantity
            where drum_id = allocation_row.drum_id
              and hardware_part_id = keeper_id
              and status = 'Allocated';

            delete from public.hardware_allocations
            where id = allocation_row.id;
          else
            update public.hardware_allocations
            set hardware_part_id = keeper_id
            where id = allocation_row.id;
          end if;
        end loop;
      end if;

      delete from public.hardware_parts where id = duplicate_id;
    end loop;
  end loop;
end $$;

-- PostgreSQL unique indexes allow multiple NULL values, so blank codes were
-- converted to NULL above and no partial-index conflict handling is required.
drop index if exists public.hardware_parts_code_unique;
create unique index hardware_parts_code_unique on public.hardware_parts(code);

create table if not exists public.hardware_allocations (
  id uuid primary key default gen_random_uuid(),
  drum_id uuid not null references public.drums(id) on delete cascade,
  hardware_part_id uuid not null references public.hardware_parts(id) on delete cascade,
  quantity numeric not null check (quantity > 0),
  status text not null default 'Allocated' check (status in ('Allocated','Consumed','Released')),
  created_at timestamptz not null default now(),
  consumed_at timestamptz,
  released_at timestamptz
);

create index if not exists hardware_allocations_drum_idx on public.hardware_allocations(drum_id);
create index if not exists hardware_allocations_part_idx on public.hardware_allocations(hardware_part_id);
create unique index if not exists hardware_allocations_active_unique
  on public.hardware_allocations(drum_id, hardware_part_id)
  where status = 'Allocated';

alter table public.hardware_allocations enable row level security;
drop policy if exists "Allow all hardware allocations" on public.hardware_allocations;
create policy "Allow all hardware allocations"
  on public.hardware_allocations
  for all
  using (true)
  with check (true);

grant all on public.hardware_parts to anon, authenticated;
grant all on public.hardware_allocations to anon, authenticated;

insert into public.hardware_parts
  (part_name, category, code, finish, size, qty_on_hand, reorder_level, landed_cost_aud, supplier)
values
  ('38mm Lug','Lugs','LUG-38','Chrome','38mm',0,20,0,'Lea Hung'),
  ('70mm Lug','Lugs','LUG-70','Chrome','70mm',0,20,0,'Lea Hung'),
  ('88mm Lug','Lugs','LUG-88','Chrome','88mm',0,20,0,'Lea Hung'),
  ('114mm Lug','Lugs','LUG-114','Chrome','114mm',0,20,0,'Rech'),
  ('45mm Tension Rod','Tension Rods','TROD-45','Chrome','45mm',0,40,0,'Lea Hung'),
  ('10 inch 6-lug Batter Hoop 2.3mm','Hoops','HOOP-10-6-BAT','Chrome','10 x 6 lug · HA01',0,4,0,'Lea Hung'),
  ('10 inch 6-lug Snare-Side Hoop 2.3mm','Hoops','HOOP-10-6-SNR','Chrome','10 x 6 lug · HA01-S',0,4,0,'Lea Hung'),
  ('12 inch 8-lug Batter Hoop 2.3mm','Hoops','HOOP-12-8-BAT','Chrome','12 x 8 lug · HA01',0,4,0,'Lea Hung'),
  ('12 inch 8-lug Snare-Side Hoop 2.3mm','Hoops','HOOP-12-8-SNR','Chrome','12 x 8 lug · HA01-S',0,4,0,'Lea Hung'),
  ('13 inch 8-lug Batter Hoop 2.3mm','Hoops','HOOP-13-8-BAT','Chrome','13 x 8 lug · HA01',0,4,0,'Lea Hung'),
  ('13 inch 8-lug Snare-Side Hoop 2.3mm','Hoops','HOOP-13-8-SNR','Chrome','13 x 8 lug · HA01-S',0,4,0,'Lea Hung'),
  ('14 inch 10-lug Batter Hoop 2.3mm','Hoops','HOOP-14-10-BAT','Chrome','14 x 10 lug · HA01',0,4,0,'Lea Hung'),
  ('14 inch 10-lug Snare-Side Hoop 2.3mm','Hoops','HOOP-14-10-SNR','Chrome','14 x 10 lug · HA01-S',0,4,0,'Lea Hung'),
  ('10 inch Remo Batter Head','Drum Heads','HEAD-10-BAT','','10 inch batter',0,4,0,'Mega Music'),
  ('10 inch Remo Snare-Side Head','Drum Heads','HEAD-10-SNR','','10 inch snare side',0,4,0,'Mega Music'),
  ('12 inch Remo Batter Head','Drum Heads','HEAD-12-BAT','','12 inch batter',0,4,0,'Mega Music'),
  ('12 inch Remo Snare-Side Head','Drum Heads','HEAD-12-SNR','','12 inch snare side',0,4,0,'Mega Music'),
  ('13 inch Remo Batter Head','Drum Heads','HEAD-13-BAT','','13 inch batter',0,4,0,'Mega Music'),
  ('13 inch Remo Snare-Side Head','Drum Heads','HEAD-13-SNR','','13 inch snare side',0,4,0,'Mega Music'),
  ('14 inch Remo Batter Head','Drum Heads','HEAD-14-BAT','','14 inch batter',0,4,0,'Mega Music'),
  ('14 inch Remo Snare-Side Head','Drum Heads','HEAD-14-SNR','','14 inch snare side',0,4,0,'Mega Music'),
  ('10 inch Snare Wires','Snare Wires','WIRE-10','','10 inch',0,4,0,'Lea Hung'),
  ('12 inch Snare Wires','Snare Wires','WIRE-12','','12 inch',0,4,0,'Lea Hung'),
  ('13 inch Snare Wires','Snare Wires','WIRE-13','','13 inch',0,4,0,'Lea Hung'),
  ('14 inch Snare Wires','Snare Wires','WIRE-14','','14 inch',0,4,0,'Lea Hung'),
  ('Trick Throw-Off','Throw-Offs','THROW-TRICK','','Snare throw-off',0,4,0,'Trick Drums'),
  ('20mm Air Vent','Air Vents','VENT-20','Chrome','20mm · Ply shells',0,6,0,'Lea Hung'),
  ('30mm Air Vent','Air Vents','VENT-30','Chrome','30mm · Stave shells',0,6,0,'Lea Hung')
on conflict (code) do update set
  part_name = excluded.part_name,
  category = excluded.category,
  finish = excluded.finish,
  size = excluded.size,
  supplier = excluded.supplier;
