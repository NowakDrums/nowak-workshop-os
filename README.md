# Nowak Workshop OS v5.5.0 — Lifecycle Stability Release

This release fixes the Complete, Sold and Shipped workflow without changing the visual structure of the app.

## Main fix

The previous Shipped button was not connected to the App-level shipping function. It could display in the Job Card but could not reliably update the database.

v5.5.0 now uses one lifecycle engine for:

- Completed
- Sold
- Shipped

All three actions:
1. write the dedicated `lifecycle_status`,
2. confirm Supabase accepted the update,
3. update the app immediately,
4. close the Job Card,
5. open the correct Production tab.

## Production #144

The migration includes the confirmed correction:

- Lifecycle: Shipped
- Legacy sales status: Sold/Shipped
- Production status: Manufacturing Complete
- Next: Complete

After running the migration and deploying v5.5.0, #144 should appear in the Shipped tab.

## Installation

1. Run `supabase/v5_5_0_lifecycle_stability.sql`.
2. Confirm the result includes #144 with `lifecycle_status = Shipped`.
3. Deploy this ZIP to Vercel.
4. Confirm the banner says:
   `v5.5.0 — unified Complete, Sold and Shipped status engine.`
5. Hard refresh Safari with Command + Option + R.

No other workflow, Launch Pack, media or communication features were removed.
