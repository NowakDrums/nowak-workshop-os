-- Nowak Workshop OS v7.7.2
-- Correct Lea Hung supplier-facing codes and finishes used by generated order emails.
-- Internal SKU keys remain unchanged, so hardware allocation continues to work.

update public.hardware_parts
set code = 'TR01',
    part_name = 'Tension Rod (Stainless Steel)',
    finish = 'Stainless Steel'
where category = 'Tension Rods';

update public.hardware_parts
set code = case
  when coalesce(size,'') ~* '14' or coalesce(part_name,'') ~* '14' then 'SE04-1420CI'
  when coalesce(size,'') ~* '13' or coalesce(part_name,'') ~* '13' then 'SE04-1320CI'
  when coalesce(size,'') ~* '12' or coalesce(part_name,'') ~* '12' then 'SE04-1220CI'
  when coalesce(size,'') ~* '10' or coalesce(part_name,'') ~* '10' then 'SE04-1020CI'
  else code
end,
part_name = 'Snare Wire',
finish = case when coalesce(finish,'') = '' then 'Chrome Plated' else finish end
where category = 'Snare Wires';
