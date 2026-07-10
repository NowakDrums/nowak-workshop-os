-- Nowak Workshop OS v5.2.1
-- Adds the final Nowak drum serial number field.

alter table public.drums
  add column if not exists nowak_serial text;

select 'v5.2.1 migration complete' as status;
