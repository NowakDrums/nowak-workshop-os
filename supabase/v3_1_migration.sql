-- Nowak Workshop OS v3.1 workflow history
alter table public.drums add column if not exists stage_history jsonb default '[]'::jsonb;
select 'v3.1 migration complete' as status;
