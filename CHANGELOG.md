## v7.9.30
- Complete status is now independent from final hardware work. Marking a drum Complete no longer auto-completes Prepare hardware / heads or Assembled, does not deduct hardware, and does not count those stages in estimated completed time.
- If a drum is marked Complete before assembly, Final assembly required is shown as outstanding work.
- Adjust Hardware Used now records only parts physically fitted to the drum. Deselecting a previously fitted part returns it to on-hand stock while keeping it allocated to the drum for later fitting.
- Hardware fitted / used controls are available for any drum with a standard hardware recipe, not only snares.

# Nowak Workshop OS Changelog

## v7.9.25
- Chrome purchase orders now display the bass lug gasket colour as Chrome rather than Black.
- Brass bass drum claw code corrected from `BC-010CR-BR` to `BC-010-BR`.
- Brass bass drum spur code corrected from `BDS008CR-BR` to `BDS008-BR`.
- No supplier, quantity, inventory, allocation or other purchase-order mappings were changed.

## v7.9.24
- Purchase-order colour now displays `Black Nickel` when the selected drum hardware finish is Black Nickel.
- No supplier names, codes, sizes, quantities, mappings, inventory logic or Rech/Lea Hung formatting were changed.

## v7.9.23
- Recovery release restoring the complete v7.9.21 hardware and purchase-order mapping logic.
- Removes all v7.9.22 finish-remapping changes for both Lea Hung and Rech.
- Lea Hung and Rech order output returns to the last stable v7.9.21 behaviour.

## v7.9.20
- Rech Black Nickel ball-lug orders are split and labelled as Tom or Bass automatically.
- Removed the placeholder “Specify Tom or Bass”.
- Floor tom recipes now use finish-specific floor-leg sets and TM001 mounts so Black Nickel and Brass stock can be allocated correctly.
- Rech orders include the floor-tom leg set but continue to omit Lea Hung-only TM001 mounts.

## v7.9.21
- Corrected the Lea Hung Floor Tom Leg Set catalogue code to `FL05-120540`.
- Lea Hung purchase orders now show the size as `3 piece set`.
- Rech orders continue to show the supplier-neutral description `Floor Tom Legs — 3 pack` with no Lea Hung code.

## v7.9.26
- Added a printable A4 landscape inventory stocktake with a blank physical-count column.
- Added Print / Save PDF controls to current purchase-order previews before a draft is saved.
- Existing saved and draft purchase orders remain printable from the purchase-order window.
- No inventory, supplier, pricing, quantity or purchase-order mapping logic was changed.
## v7.9.27
- Added **Print Kit Breakdown** to the Reorder Planner.
- The printout lists the hardware required for each drum in the kit, including per-drum quantity and line total.
- Added a combined totals section for lugs, hoops, tension rods, air vents, floor-tom hardware, bass-drum hardware, heads, snare wires and throw-offs.
- Retains the v7.9.26 printable stocktake and purchase-order features.
- No inventory, supplier, purchase-order, pricing or allocation calculations were changed.

## v7.9.28
- Added 14-inch as a selectable Tom diameter in the Reorder Planner.
- A 14-inch Tom uses 8 lugs per hoop, 16 ball lugs and 16 tension rods in total.
- A 14-inch Tom does not add floor-tom legs or the three floor-tom mounts.
- The existing 14-inch Floor Tom option remains unchanged.
- No supplier, purchase-order, pricing, stock or allocation mappings were changed.


## v7.9.29
- Moved the printable kit hardware breakdown from Target Drum Stock into the selected supplier purchase-order section.
- The report now recalculates and labels hardware using the selected supplier's rules.
- Rech reports separate Tom and Bass single-point ball lugs and exclude separate lug gaskets and Lea Hung-only TM001 mounts.
- Lea Hung reports retain separate bass-lug gaskets and floor-tom TM001 mounts.
- Combined totals at the bottom are supplier-specific.
- All snare drums now require one 30mm air vent, including ply snares.
- Every tom, floor tom and bass drum continues to require one air vent; every floor tom requires one three-piece leg set and three mounts under Lea Hung rules.
