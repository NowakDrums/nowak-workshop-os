-- Nowak Workshop OS v2.1 hardware inventory and order planning update
create table if not exists public.hardware_purchases (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  supplier text, currency text default 'USD', exchange_rate numeric default 1.55,
  shipping_foreign numeric default 0, tax_foreign numeric default 0, notes text
);
create table if not exists public.hardware_purchase_lines (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  purchase_id uuid references public.hardware_purchases(id) on delete cascade,
  hardware_part_id uuid references public.hardware_parts(id) on delete set null,
  part_name text, category text, finish text, size text, qty integer default 0,
  unit_price_foreign numeric default 0, allocated_shipping_tax_aud numeric default 0,
  landed_cost_aud numeric default 0
);
create table if not exists public.drum_hardware_allocations (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  drum_id uuid references public.drums(id) on delete cascade,
  hardware_part_id uuid references public.hardware_parts(id) on delete cascade,
  qty_required integer default 0, qty_applied integer default 0, applied_at timestamptz, notes text
);
alter table public.hardware_parts add column if not exists supplier text;
alter table public.hardware_parts add column if not exists supplier_currency text default 'USD';
alter table public.hardware_parts add column if not exists supplier_unit_price numeric default 0;
alter table public.hardware_parts add column if not exists reorder_qty integer default 0;
alter table public.hardware_parts add column if not exists frequently_required boolean default true;
alter table public.drums add column if not exists hardware_applied_at timestamptz;
alter table public.drums add column if not exists stage_history jsonb default '[]'::jsonb;
select 'v2.1 migration complete' as status;
