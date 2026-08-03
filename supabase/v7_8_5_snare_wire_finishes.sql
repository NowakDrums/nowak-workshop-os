-- Nowak Workshop OS v7.8.5
-- Snare wires are available only in Stainless Steel and Brass.
-- Remove accidental Black Nickel snare-wire catalogue rows.

delete from public.hardware_parts
where category = 'Snare Wires'
  and (lower(coalesce(finish, '')) like '%black%nickel%'
       or lower(coalesce(part_name, '')) like '%black%nickel%');
