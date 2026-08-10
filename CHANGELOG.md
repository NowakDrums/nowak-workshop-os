# Nowak Workshop OS v7.9.37

- Fixes deselecting hardware from completed drums.
- Hardware checkboxes now save only explicitly selected parts.
- When all fitted hardware is deselected, the release-allocation prompt now appears even when the parts were Consumed before saving.
- Choosing to release returns those reservations to general available stock instead of leaving them attached to the completed drum.
- No other production, inventory, purchase-order, media, timing or social-post logic changed.

# Nowak Workshop OS v7.9.36

Small Production-page filter patch only.

- Added an Owner filter to Production: All, Nowak, Brady, Unallocated.
- The filter only changes which drum cards are displayed; it does not alter assignments or drum data.
- Owner filtering works alongside the existing Construction and Status filters.
- Archived drums also respect the selected Owner filter.
- No production workflow, completion, inventory, purchasing, media, marketing, timing or costing logic was changed.

## v7.9.38
- Fixed Undo Complete so the open Job Card resets from the freshly saved Production row instead of retaining stale Complete state.
- Fixed returned hardware so deselecting all fitted parts can genuinely release the remaining allocation after the quantities are returned to on-hand stock.
- Kept custom-order reservations optional: returned hardware can remain reserved or be fully released.
- No other workflow, inventory recipe, purchasing, media, timing or costing changes.
