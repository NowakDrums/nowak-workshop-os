# Nowak Workshop OS v7.3.1

## Kit / project prefill

When a kit or project is selected in Add Drum, the app now looks at the existing active drums in that kit and copies available:

- customer name
- customer phone
- customer email
- shipping address
- due date
- ownership
- timber/material
- finish

The copied information remains editable for the new drum.

Project-level customer and due-date information are used where available. Archived drums are not used as the source for prefilled details.

## Kits / Projects page

- Kit and project cards now appear at the top.
- The Link Existing Drums section appears below them.
- Archived drums are excluded from project cards.
- Archived drums are excluded from the list of drums available to link.

## Workshop Today

Archived drums are now excluded from:

- Today's Plan, including stale scheduled items
- Tomorrow's Plan
- Outstanding Final Work
- suggested workshop batches

The underlying old plan entry is retained for history, but it is not shown as current workshop work.

## Supabase

No migration is required.

## Rollback

Use v7.3.0 to roll back.
