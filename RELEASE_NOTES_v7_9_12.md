# Nowak Workshop OS v7.9.12

- Repair scheduling no longer depends on a Supabase ON CONFLICT unique constraint. The app now checks for an existing repair/date row and updates or inserts directly.
- Added a prominent **Finish supplier for this order** selector above the Reorder Planner table. Lea Hung remains the default; selecting Rech applies the one-off override to the current target-kit rows.
- The individual Finish supplier column remains available for mixed supplier plans.
