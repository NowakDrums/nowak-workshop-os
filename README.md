# Nowak Workshop OS v7.4.1

## Project / Kit Media blank-page fix

Clicking **Add Media** opened a blank page because the media-picker icon was referenced but not imported into the application.

The icon import has been corrected. The Project / Kit Media upload window now opens normally.

All v7.4.0 project-media features remain unchanged.

## Supabase

No new migration is required.

The v7.4.0 migration is still required if it has not already been run:

`supabase/v7_4_0_project_media.sql`

## Rollback

Use v7.4.0 to roll back.
