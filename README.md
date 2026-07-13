# Nowak Workshop OS v7.0.0

## Drum Register

A new simple Drum Register includes every active, completed and archived drum.

Collapsed rows show:

- Production number
- CB number
- Material
- Size
- Nowak serial number
- Customer

The register can be filtered by All, Nowak, Brady / CB or Unallocated and sorted by Production number or CB number. Clicking a row expands it and provides an Open Job Card button.

## Number protection

The app now blocks:

- duplicate production numbers
- duplicate CB numbers
- a Brady drum using the same value for its production number and CB number

Checks run when creating a drum and when saving number changes in a Job Card.

## Customer phone

Customer phone is now available in:

- Add Drum
- Job Card
- Customers & Orders
- expanded Drum Register rows

## Stored photos and videos

Every Job Card now includes a visible Stored Build Photos & Videos gallery.

- Photos at Any Stage and milestone uploads appear here.
- Newly uploaded media refreshes the gallery automatically.
- Media remains stored in Supabase and can be opened or downloaded.
- Uploading to the app does not automatically copy the image into the phone's Photos app; use Download when a local copy is needed.

## Workshop tasks

One-off completed tasks now appear under an expandable Recently Completed Tasks section instead of simply disappearing.

## Workshop Today

Suggested batches now run from drums closest to completion down to early-stage work.

`Stave Blanks` is used for prepared stave blanks and is deliberately placed at the bottom.

## Supabase migration required

Run `supabase/v7_0_0_register_phone.sql` once.

This only adds the optional customer phone field. All other changes use existing data structures.

## Rollback

The unchanged v6.9.2 ZIP remains the rollback version.
