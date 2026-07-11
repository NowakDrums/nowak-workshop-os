# Nowak Workshop OS v6.0.0 — Stability Release

This release fixes the recurring issue where a drum could be marked Sold but remain in Completed.

## Root cause fixed

Earlier releases attempted to save the financial sales record before changing the drum lifecycle. If the `sales` table was missing one of the newer shipping/payment columns, the process stopped before the drum was marked Sold.

v6 changes the order:

1. The drum lifecycle is saved and verified first.
2. The drum immediately moves to the Sold tab.
3. The financial sales record is saved afterwards.
4. If the extended sales columns are unavailable, the app falls back to the older sales structure and preserves shipping/payment information in Notes.

A sales-table issue can no longer prevent the drum moving to Sold.

## Installation

1. Run:
   `supabase/v6_0_0_comprehensive_stability.sql`
2. Confirm:
   `v6.0.0 comprehensive stability setup complete`
3. Deploy this ZIP to Vercel.
4. Confirm the banner says:
   `v6.0.0 — reliable lifecycle and sale-record stability release.`
5. Hard refresh Safari with Command + Option + R.

## Testing Production #142

Open #142 and press Sold again. The drum should:
- close the Job Card,
- open Production,
- select Sold,
- display a Sold lifecycle badge.

The included diagnostic SQL can be used to inspect the stored database status:
`supabase/diagnose_production_142.sql`
