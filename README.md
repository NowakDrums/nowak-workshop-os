# Nowak Workshop OS v7.7.3

## Fix

- Repairs the Reorder Planner blank-page issue caused by a missing Copy icon import.
- Retains the formatted Lea Hung supplier email and corrected supplier codes from v7.7.2.
- No new Supabase migration is required if v7.7.2 has already been run.

# Nowak Workshop OS v7.7.2

## Lea Hung supplier email improvements

- The order preview is now a clean grouped HTML table.
- Categories appear in this order: Lugs, Air Vents, Tension Rods, Hoops, Snare Wires.
- The email contains no total quantity, price or estimated value.
- `Copy Formatted Email` copies both HTML and plain-text versions. Open the email draft and paste into the message body for the best layout.
- `Open Email Draft` remains available as a plain-text fallback.
- Tension rods are listed as `Tension Rods (stainless steel)`, finish `Stainless Steel`, code `TR01`.
- Snare wire supplier codes are standardised to:
  - 14 inch: `SE04-1420CI`
  - 13 inch: `SE04-1320CI`
  - 12 inch: `SE04-1220CI`
  - 10 inch: `SE04-1020CI`
- Codes are pulled from the inventory catalogue, with supplier-safe fallbacks in the email generator.

## Installation

1. Deploy this ZIP to Vercel.
2. Run `supabase/v7_7_2_lea_hung_supplier_codes.sql` in Supabase SQL Editor.
3. Refresh Workshop OS.

The migration does not change quantities or hardware allocations.
