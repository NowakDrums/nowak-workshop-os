# Nowak Workshop OS v7.4.0

## Project / Kit Media

Each active kit or project now has its own media library, separate from the individual drum Job Cards.

Available actions:

- take a photo or video
- choose one or more files from the device
- view stored project media
- open the full-size file
- delete media
- add an optional caption or note

Categories:

- Project Progress
- Shells Together
- Finished Kit
- Final Photos
- Video
- General

Project media is stored against the project itself, so photos showing the full kit or multiple matching shells do not need to be attached to one individual drum.

Individual drum media remains unchanged.

## Storage

Project files use the existing public `drum-photos` storage bucket under:

`projects/<project-id>/<category>/...`

## Supabase migration required

Run this migration once:

`supabase/v7_4_0_project_media.sql`

It creates the additive `project_media` table and does not alter existing drum, project or photo records.

## Rollback

Use v7.3.3 to roll back the app. The additive `project_media` table can remain in Supabase without affecting the rollback version.
