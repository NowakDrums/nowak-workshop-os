-- Nowak Workshop OS v1.5 database update
alter table public.drums add column if not exists drum_type text default 'Snare';
alter table public.drums add column if not exists stave_triton_setting text;
alter table public.drums add column if not exists stave_width text;
alter table public.drums add column if not exists construction_note text;

select column_name, data_type
from information_schema.columns
where table_schema = 'public'
and table_name = 'drums'
and column_name in ('drum_type','stave_triton_setting','stave_width','construction_note')
order by column_name;
