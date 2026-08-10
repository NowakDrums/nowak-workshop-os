# Nowak Workshop OS v7.9.45

Inventory allocation navigation only.

- In Inventory → Stock Levels, an allocated quantity / “Reserved for … drum(s)” area is now clickable.
- If the hardware is reserved for one drum, its Job Card opens immediately.
- If it is reserved for multiple drums, a numbered chooser lets you select which Job Card to open.
- Inventory → Currently Reserved Hardware now shows clickable drum numbers as well.
- Allocation navigation also preserves linked drum IDs when duplicate catalogue display rows are collapsed.
- No inventory quantities, allocation rules, completion logic, hardware release logic, purchase orders or Supabase schema/RLS are changed.
