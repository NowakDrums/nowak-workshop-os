-- Replace 142 with any production number you want to inspect.
select
  id,
  serial,
  timber,
  lifecycle_status,
  sales_status,
  production_status,
  next_step
from public.drums
where trim(leading '#' from serial::text) = '142';
