# Nowak Workshop OS v7.1.0

## Flexible scheduling

The old `Plan Tomorrow` button has been replaced with a simple `Schedule Work` dropdown.

Options:

- Today
- Tomorrow
- Choose date

This is available for:

- individual drums in Production
- individual drums in Workshop Today
- suggested work batches
- complete kits and projects

## Scheduled indicators

Drum cards now show every active scheduled date, for example:

`Scheduled: Today, Tomorrow · Spray polyurethane coat 2`

Dates already scheduled are disabled in the dropdown, preventing duplicate tasks for the same drum, date and production stage.

Choosing a custom date opens a small date picker. Past dates cannot be selected.

Today's Plan updates immediately when Today is selected.

## Supabase

No migration is required. This uses the existing `work_plan_items` table.

## Rollback

The unchanged v7.0.2 ZIP remains the rollback version.
