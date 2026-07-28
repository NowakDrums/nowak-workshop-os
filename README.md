# Nowak Workshop OS v7.6.5

## v7.6.2
- Reissued the complete snare hardware inventory update with a repaired, repeat-safe Supabase migration.
- The migration automatically finds and merges duplicate hardware codes such as `AIR01` before creating the unique index.
- Existing duplicate stock quantities are combined rather than discarded.
- The migration can be run after the failed v7.5.9 attempt and is safe to run again.
- Includes the full v7.5.9 inventory, stocktake, allocation, shortage-warning and build-capacity features.
- Supabase migration required: `supabase/v7_6_0_inventory_complete.sql`.
- Do not run the older v7.5.9 migration again.



## v7.5.9
- Added a snare-only hardware inventory and stocktake module.
- Added job-level hardware allocation for custom orders.
- Allocated hardware is excluded from available stock but remains on hand until assembly.
- Completing the Assembled stage automatically consumes allocated hardware.
- Added immediate shortage warnings and a What Can We Build capacity dashboard by snare diameter, depth and construction.
- Added 10-inch snare hardware support (6 lugs and 12 tension rods).
- Seeded lug lengths, 45mm tension rods, 2.3mm hoops, Remo heads, snare wires, Trick throw-offs and 20/30mm vents with the requested suppliers.
- Removed screws, washers and claws from this first inventory BOM.
- Supabase migration required: `supabase/v7_5_9_inventory_allocation.sql`.

## v7.5.8
- Combined snare pricing and costing templates into one clearer section.
- Standardised Nowak High Gloss surcharge to $100 for both stave and ply snares.
- Improved Tom and Kit Pricing contrast and labels.
- Retained other costing templates in a collapsible section.
- No Supabase migration required.


Changes:
- Pending drums can be created without using a production number.
- Tom, floor-tom and bass-drum workflows no longer require snare beds.
- Existing non-snare drums immediately use the corrected workflow; old checked snare-bed notes are ignored.
- Ply bearing-edge allowance corrected to 15 minutes.
- Agreed size multipliers applied to workflow estimates, from 10-inch tom 1.25x to 24-inch bass drum 4.0x.
- Costing page includes Stave and Ply stage-by-stage time allowances, retail pricing and Brady kit pricing.
- Nowak serial numbers generate a QR code that can be saved or printed later.
- QR codes open a basic public drum record with specifications and existing production/completion media.
- Brady drums do not receive Nowak QR codes.

No Supabase migration is required for this release. Existing drum and photo records are used.


## v7.5.7
- Added 4 1/2-inch and 7 1/2-inch drum depths.
- Existing iPhone library uploads no longer trigger the save-to-phone share sheet.
- In-app camera photos retain the Save to iPhone option.
- Simplified stored media cards and corrected Nowak/Brady shell labels.
- Added production value generated to Workshop Summary and CSV export.


## v7.6.2
- Restored Inventory with Stock, Drum Hardware and Build Capacity tabs.
- Marking a snare Assembled automatically deducts its standard hardware.
- Job Cards now include Adjust Hardware Used so fitted parts can be selected or deselected and stock is reconciled.
- No additional Supabase migration is required after v7.6.0 has been run.


## v7.6.2 inventory visibility repair
Run `supabase/v7_6_2_inventory_stock_visibility.sql` after deployment. It restores the hardware parts RLS policy and safely reseeds the standard stock catalogue.


## v7.6.3 inventory catalogue cleanup
- Stocktake now has Save Stocktake buttons and saves all entered shelf counts together.
- Hardware catalogue naming and order cleaned up.
- Agile Tube Lugs use ATL01 while an internal SKU key keeps each lug length separate.
- Hoops, heads, wires and air vents are displayed and sorted consistently.
- Existing stock quantities and drum allocations are preserved and duplicate catalogue rows are merged by internal SKU.


## v7.6.4 migration repair

- Replaces the failed catalogue UPSERT with an idempotent update/insert process.
- Safe to run after a partially failed v7.6.3 migration.
- Preserves stock quantities and existing hardware allocations.


## v7.6.5 inventory ordering and Trick finishes

- Adds separate Chrome and Gold Trick throw-off stock lines.
- Standard snare BOM uses the Chrome Trick throw-off by default.
- Inventory order is now Lugs, Air Vents, Tension Rods, Hoops, Snare Wires, Throw-Offs, Drum Heads.
- Drum heads (skins) are kept at the bottom of the stock page.
- Existing Trick stock is retained as Chrome during migration.
