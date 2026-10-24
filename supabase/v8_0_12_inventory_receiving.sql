-- Workshop OS v8.0.12
-- Adds supplier-specific hardware pricing and separate consignment/handling costs.
-- Safe to run more than once.

alter table if exists public.hardware_parts
  add column if not exists supplier_prices jsonb not null default '{}'::jsonb;

alter table if exists public.supplier_orders
  add column if not exists consignment_cost numeric not null default 0;
