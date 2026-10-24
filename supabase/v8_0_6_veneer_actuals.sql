-- Workshop OS v8.0.6
-- Stores actual veneer workshop results for each ply drum.
-- Safe to run more than once.

alter table if exists public.drums
  add column if not exists veneer_actuals jsonb not null default '{"layers":[]}'::jsonb;
