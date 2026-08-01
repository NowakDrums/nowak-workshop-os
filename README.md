# Nowak Workshop OS v7.7.12

This is a complete replacement for the unsuccessful v7.7.10 update and includes all v7.7.9 tom, floor-tom, bass-drum and purchase-order functionality.

## Hardware finishes

New and edited drums now offer:

- Chrome
- Brass
- Black Nickel
- Mixed / Custom

The Reorder Planner also offers Chrome, Brass and Black Nickel.

## Snare wires

All standard snare builds use **Brass** snare wires by default, regardless of the general hardware finish. Individual hardware can still be changed through Adjust Hardware Used. The display wording is Brass, not Brass Plated.

## Supabase

Run once:

`supabase/v7_7_12_hardware_finishes_repair.sql`

Do not run the unsuccessful v7.7.10 migration first.


## v7.7.12 repair
This release replaces the failed v7.7.11 SQL. Run only `supabase/v7_7_12_hardware_finishes_repair.sql`. It safely adds the missing `sku_key` column before installing Brass snare-wire defaults and Black Nickel variants.
