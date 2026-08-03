# Nowak Workshop OS v7.9.0

Controlled repair release.

## Repaired together
- Hardware allocations are grouped by catalogue code, finish and size, so older duplicate names no longer hide reserved quantities.
- Custom drum orders automatically reserve their standard hardware.
- Hardware can be reserved even when stock is insufficient; the resulting zero or negative availability is shown in red.
- Allocation quantities reduce Available stock and appear in Inventory and Drum Hardware.
- Active allocation shortages flow into the Suggested Purchase Order.
- An allocated item with zero available adds at least one replacement item to the order calculation.
- AUD values display dollars and cents throughout the app.

No Supabase schema migration is required for this release.
