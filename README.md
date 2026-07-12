# Nowak Workshop OS v6.5.1

## Scheduled-work highlighting

Drums added to Tomorrow's Plan are now clearly identified throughout the app:

- green outline around the drum card
- `Scheduled tomorrow` label
- the planned task is displayed
- the Plan Tomorrow button changes to `Scheduled Tomorrow` and is disabled to avoid duplicates

This applies in Production and Workshop Today.

## Brady / CB shell-only workflow

Brady / CB drums now use a shell-only manufacturing workflow by default.

- `Assembled` is no longer required for a Brady drum to reach manufacturing completion.
- Existing sold or shipped drums are excluded from Workshop Today batches.
- Brady drums that have already been marked Sold will no longer appear as needing assembly.

No Supabase migration is required.

## Rollback

The unchanged v6.5.0 ZIP remains the rollback version.
