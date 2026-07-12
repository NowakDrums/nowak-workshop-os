# Nowak Workshop OS v6.9.1

## Comms & Marketing fix

v6.9.0 contained a runtime naming error in the new Content Queue. The app built successfully, but opening Comms & Marketing caused the page to render blank.

v6.9.1 fixes:

- the incorrect Launch Pack stage reference used by the Content Queue
- stray undefined planning props inside the Milestone Generator

The Content Queue now loads normally.

## Supabase

No new migration is required beyond the v6.9.0 migration:

`supabase/v6_9_0_marketing_queue.sql`

## Rollback

The unchanged v6.8.1 ZIP remains the last stable rollback before the marketing queue feature.
