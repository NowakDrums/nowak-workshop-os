# Nowak Workshop OS v7.9.0

Controlled repair release consolidating hardware allocations, shortages, purchase-order calculations and two-decimal AUD currency formatting. Custom drum orders now reserve standard hardware automatically, including reservations that create a shortage.

# Nowak Workshop OS v7.8.2

## Direct Marketing Portal

After deployment, share this URL with the social-media person:

`https://nowak-workshop-os.vercel.app/marketing`

The portal shows completed Nowak drums with brief descriptions, completion photos/videos, and production/workshop media. It does not show the normal Workshop OS navigation.

No Supabase migration is required for this release.

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


## v7.7.17 inventory cleanup

Run `supabase/v7_7_17_inventory_catalogue_cleanup.sql` after deployment. This migration:

- combines `Throw Off` and `Throw-Offs` into one category;
- removes the incorrect `ATL01-00CR` bass-drum lug record and merges its stock/allocation history into `ATL01-01`;
- renames chrome snare wires to Stainless Steel;
- preserves existing quantities, costs and active allocations.


## v7.7.18 purchase-order draft workflow

- Keeps one editable Lea Hung draft and updates it instead of generating duplicate drafts.
- Drafts remain in Reorder Planner and only Sent, Partially Received, Received or Closed orders appear in Purchase Orders.
- The Add another inventory item selector now shows the hardware finish/colour.
- No Supabase migration is required.


## v7.8.2 throw-off catalogue repair

- Normalises all throw-off category spellings to `Throw-Offs`.
- Merges duplicate throw-off stock rows by finish while preserving quantities, costs, reorder levels and allocations.
- Keeps separate legitimate finish variants such as Chrome and Gold.
- The app also canonicalises category names when loading inventory, so the Stock and Audit pages cannot split `Throw Off` and `Throw-Offs`.

Run `supabase/v7_7_19_throw_off_duplicate_repair.sql` after deployment.


## v7.8.2 database update
Before using the new landed-cost receiving calculator, run `supabase/v7_8_1_landed_cost_receiving.sql` in the Supabase SQL Editor. The migration only adds purchase-order costing fields and does not remove existing data.

## v7.8.2 duplicate throw-off repair

The app now automatically hides the obsolete **Throw Off + Butt Plate** record whenever the retained Chrome **Trick Throw-Off** exists. The hidden legacy row is also excluded from stock totals and stock-value calculations.

For permanent database cleanup, run `supabase/v7_8_1_remove_legacy_throwoff_duplicate.sql` once in the Supabase SQL Editor.


## v7.8.2 stock screen update
- Removed the Inventory Audit / full stock-value detail screen.
- Added clear Adjust Stock Levels controls and direct plus/minus quantity adjustment.
- Hides zero-stock special finishes while keeping chrome/stainless items and brass snare wires visible.
- Special finish variants can be expanded beneath the matching chrome item.


## v7.8.5 stock display correction

- Snare wires are limited to Stainless Steel and Brass.
- Black Nickel snare-wire variants are removed.
- Colour-finish rows remain hidden in the normal Stock Levels view and appear only in Adjust Stock Levels mode.
- Run `supabase/v7_8_5_snare_wire_finishes.sql` once to remove any accidental Black Nickel snare-wire records already in Supabase.


## v7.8.6 remaining hardware finish variants

- Floor tom leg sets and tom mounts now offer Brass Plated and Black Nickel variants in Adjust Stock Levels.
- Bass drum claws and bass drum spurs now offer Brass Plated and Black Nickel variants in Adjust Stock Levels.
- Missing variants are created automatically when a non-zero quantity is entered and stock levels are saved.
- Run `supabase/v7_8_6_floor_tom_and_bass_hardware_finishes.sql` to pre-create these variants at zero stock.


## v7.8.7 Ball Lug and variant grouping cleanup

- Duplicate catalogue rows are collapsed in the app so the Agile Tube Lug – Ball appears once.
- Brass Plated and Black Nickel variants are grouped beneath the Chrome Plated parent only in Adjust Stock Levels mode.
- Variant matching now uses supplier code and size, making grouping consistent even when names differ slightly.
- Run `supabase/v7_8_7_ball_lug_variant_cleanup.sql` to permanently remove duplicate ATL01-01 Chrome Plated rows.


## v7.8.9
- Corrected the visible app version.
- Stock saving now reads live input values directly before comparing and saving.
- Added explicit saved-item counts in the success message.


## v7.8.13
- Stock adjustment now writes every visible quantity rather than relying on change detection.
- Saved quantities are read back from Supabase and verified before success is shown.
- New finish variants use robust IDs even when the base ID contains punctuation.
- The app reloads only after a verified save.


## v7.8.13
- Saving stock levels no longer reloads the app or sends the user to Dashboard.
- Newly created Brass and Black Nickel variants are reloaded immediately.
- Non-zero finish variants are visible in the normal Stock Levels view; zero-stock variants remain hidden.


## v7.8.13
- Stocktake quantity fields no longer re-render the entire Inventory page on every digit entered.
- Brass snare-wire quantities can be entered safely on mobile and desktop.
- Save Stock Levels continues reading the final values directly from the visible fields.
- No Supabase migration is required for this update.


## v7.8.13
- Normal Inventory view is read-only.
- Brass snare wires with stock now display in normal Inventory.
- Brass and other finish variants support editable minimum levels in Adjust Stock Levels mode.


## v7.8.14 inventory variant cleanup

- Zero-stock Brass Plated and Black Nickel hardware is hidden in normal Inventory.
- Brass snare wires remain visible even at zero stock.
- Special-finish hardware has no minimum-order level; snare wires remain the exception.
- Duplicate finish rows are collapsed in the app and a database cleanup migration is included.
- Adjustment mode shows one Chrome/Stainless parent with one Brass and one Black Nickel row only.

## v7.8.16 order, allocation and lifecycle repair
- A 10-inch snare now uses HA01-S for the snare-side hoop and the existing 10 x 6 HA01 tom/top hoop for the batter side.
- Allocated inventory is aggregated across duplicate catalogue identities so Allocated and Available totals remain visible even when an older duplicate row was used.
- Completed, Sold or Shipped drums can be moved back to Production from the Job Card. Completion, shipping and fulfilment steps are cleared while prior manufacturing history is retained.

## v7.8.16 order, allocation and lifecycle repair
- A 10-inch snare uses HA01-S for the snare-side hoop and the existing 10 x 6 HA01 tom/top hoop for the batter side.
- Allocated inventory is aggregated across duplicate catalogue identities so Allocated and Available totals stay visible.
- Completed, Sold or Shipped drums can be moved back to Production from the Job Card.


## v7.8.16
- Allocation records now load with their linked hardware details.
- Allocated quantities are displayed on each inventory line with the number of drums reserved.
- Added a Currently Reserved Hardware table listing part quantities and drum numbers.
- Allocation status matching is case-insensitive and survives hidden duplicate catalogue rows.


## v7.8.17 shortage highlighting and purchase-order carry-forward

- Inventory rows turn red when allocations exceed physical stock.
- The exact shortage quantity is shown on the stock line.
- Zero available stock reserved to a drum is highlighted separately.
- Current allocation shortages are automatically added to the Suggested Purchase Order, even when the target drum planner requires zero additional units.
- Negative availability is preserved in the purchase calculation so shortages are not lost by rounding to zero.
- An allocated item with exactly zero available stock is treated as an urgent replenishment line: it is red in Inventory and adds at least one replacement unit to the next suggested purchase order.
