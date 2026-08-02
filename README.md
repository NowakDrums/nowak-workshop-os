# Nowak Workshop OS v7.8.0

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


## v7.8.0 throw-off catalogue repair

- Normalises all throw-off category spellings to `Throw-Offs`.
- Merges duplicate throw-off stock rows by finish while preserving quantities, costs, reorder levels and allocations.
- Keeps separate legitimate finish variants such as Chrome and Gold.
- The app also canonicalises category names when loading inventory, so the Stock and Audit pages cannot split `Throw Off` and `Throw-Offs`.

Run `supabase/v7_7_19_throw_off_duplicate_repair.sql` after deployment.


## v7.8.0 database update
Before using the new landed-cost receiving calculator, run `supabase/v7_8_0_landed_cost_receiving.sql` in the Supabase SQL Editor. The migration only adds purchase-order costing fields and does not remove existing data.
