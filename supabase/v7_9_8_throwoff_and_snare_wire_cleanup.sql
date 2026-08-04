-- Nowak Workshop OS v7.9.8
-- Trick throw-offs are Chrome, Gold or Black Nickel only.
-- Brass snare wires use Lea Hung SE06 codes.

begin;

-- Remove the invalid Brass Plated Trick throw-off record created by earlier releases.
delete from hardware_parts
where lower(regexp_replace(coalesce(part_name,''), '[^a-z0-9]+', '', 'g')) = 'trickthrowoff'
  and (
    upper(coalesce(code,'')) = 'THROW-TRICK-BR'
    or lower(coalesce(finish,'')) in ('brass','brass plated')
  );

-- Standardise the valid Trick finish labels/codes where those rows exist.
update hardware_parts
set finish = 'Gold', code = 'THROW-TRICK-G'
where lower(regexp_replace(coalesce(part_name,''), '[^a-z0-9]+', '', 'g')) = 'trickthrowoff'
  and (lower(coalesce(finish,'')) = 'gold' or upper(coalesce(code,'')) in ('THROW-TRICK-G','THROW-TRICK-GOLD'));

update hardware_parts
set finish = 'Black Nickel', code = 'THROW-TRICK-BN'
where lower(regexp_replace(coalesce(part_name,''), '[^a-z0-9]+', '', 'g')) = 'trickthrowoff'
  and lower(coalesce(finish,'')) = 'black nickel';

-- Brass snare wire catalogue codes are SE06; stainless steel remains SE04.
update hardware_parts
set code = regexp_replace(coalesce(code,''), '^SE04-', 'SE06-', 'i')
where lower(coalesce(category,'')) in ('snare wires','snare wire')
  and lower(coalesce(finish,'')) like '%brass%'
  and coalesce(code,'') ~* '^SE04-';

commit;
