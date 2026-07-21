# Nowak Workshop OS v7.4.2

## Upload and save to iPhone

Photo and video upload buttons now use one combined action:

`Upload & Save to iPhone`

When supported by the device:

1. Tap the button once.
2. The iPhone share sheet opens with the selected original photo or video.
3. Choose `Save Image` or `Save Video`.
4. Workshop OS then uploads the same media to the relevant drum, Launch Pack or project.

If the share sheet is closed or cancelled, the app upload still continues.

This flow is available for:

- drum milestone photos
- Launch Pack photos and videos
- Project / Kit Media

## Important iPhone limitation

Safari still requires the user to choose `Save Image` or `Save Video` in the Apple share sheet. A web app cannot silently write into the Photos library.

On devices that do not support sharing files, the button simply uploads the media to Workshop OS.

## Supabase

No new migration is required.

The v7.4.0 project-media migration is still required if it has not already been run:

`supabase/v7_4_0_project_media.sql`

## Rollback

Use v7.4.1 to roll back.
