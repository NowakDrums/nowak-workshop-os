-- Nowak Workshop OS v7.6.6
-- Restores editable estimated unit costs for inventory planning.
-- Existing non-zero prices are preserved. These are starting estimates in AUD and should be replaced with invoice landed costs.

update public.hardware_parts hp
set landed_cost_aud = prices.estimated_cost
from (values
  ('TL01-127', 7.50::numeric),
  ('LUG-114', 8.50::numeric),
  ('LUG-88', 6.50::numeric),
  ('LUG-70', 6.00::numeric),
  ('LUG-38', 5.50::numeric),
  ('TLB01S-51', 6.50::numeric),
  ('TL01S-40', 5.50::numeric),
  ('TROD-45', 0.85::numeric),
  ('HOOP-10-6-BAT', 15.00::numeric),
  ('HOOP-10-6-SNR', 18.00::numeric),
  ('HOOP-12-8-BAT', 17.00::numeric),
  ('HOOP-12-8-SNR', 20.00::numeric),
  ('HOOP-13-8-BAT', 18.00::numeric),
  ('HOOP-13-8-SNR', 21.00::numeric),
  ('HOOP-14-10-BAT', 20.00::numeric),
  ('HOOP-14-10-SNR', 23.00::numeric),
  ('HEAD-10-BAT', 28.00::numeric),
  ('HEAD-10-SNR', 28.00::numeric),
  ('HEAD-12-BAT', 30.00::numeric),
  ('HEAD-12-SNR', 30.00::numeric),
  ('HEAD-13-BAT', 32.00::numeric),
  ('HEAD-13-SNR', 32.00::numeric),
  ('HEAD-14-BAT', 34.00::numeric),
  ('HEAD-14-SNR', 34.00::numeric),
  ('WIRE-10', 12.00::numeric),
  ('WIRE-12', 13.00::numeric),
  ('WIRE-13', 14.00::numeric),
  ('WIRE-14', 15.00::numeric),
  ('THROW-TRICK-CHROME', 135.00::numeric),
  ('THROW-TRICK-GOLD', 155.00::numeric),
  ('VENT-20', 4.00::numeric),
  ('VENT-30', 5.00::numeric)
) as prices(sku_key, estimated_cost)
where hp.sku_key = prices.sku_key
  and coalesce(hp.landed_cost_aud,0) <= 0;

alter table public.hardware_parts enable row level security;
drop policy if exists "Allow all hardware parts" on public.hardware_parts;
create policy "Allow all hardware parts"
  on public.hardware_parts for all using (true) with check (true);
grant all on public.hardware_parts to anon, authenticated;
