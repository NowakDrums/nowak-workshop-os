# Nowak Workshop OS v6.7.1

## Archive fix

Nowak drums that have been assembled were being returned to Completed if the Job Card saved after archiving. Brady / CB drums did not usually have Assembled checked, which is why they appeared to archive correctly.

v6.7.1 now preserves the Archived lifecycle for both Nowak and Brady / CB drums during all Job Card and checklist saves.

The Job Card also closes immediately after a successful archive action, preventing a later local save from overwriting the archive status.

## Archive moved into Production

The standalone Drum Archive navigation tab has been removed.

Production now has:

- All
- Pending
- Active
- Completed
- Sold
- Shipped
- Archived

Archived is positioned next to Shipped. Archived drums remain excluded from every other Production status and all operational areas.

## Supabase

No migration is required.

## Rollback

The unchanged v6.7.0 ZIP remains the rollback version.
