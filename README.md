# Nowak Workshop OS v5.4.8

Unified drum lifecycle status fix.

## Why this was needed
The original `sales_status` field was also being used for Stock, Custom and Brady classifications. That allowed Job Card saves and old status values to conflict with Complete, Sold and Shipped.

## New lifecycle field
A dedicated `lifecycle_status` field now controls:

- Completed
- Sold
- Shipped

The existing `sales_status` field remains for compatibility with the older application and order classification.

## Behaviour
- Complete writes `lifecycle_status = Completed`
- Sold writes `lifecycle_status = Sold`
- Shipped writes `lifecycle_status = Shipped`
- Production tabs filter from lifecycle status only
- Status buttons only change screens after Supabase confirms the update
- The app updates the card immediately after a successful save
- Job Card saves preserve the current lifecycle status

## Existing records
The migration backfills existing records:
- legacy Sold/Shipped → Shipped
- Sold → Sold
- Shipped → Shipped
- Manufacturing Complete → Completed

This should move Production #144 into Shipped after the migration, because its previous combined Sold/Shipped status represents a fully shipped drum.

## Supabase
Run `supabase/v5_4_8_lifecycle_status.sql` once before deploying v5.4.8.
