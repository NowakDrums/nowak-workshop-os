# Nowak Workshop OS v6.3.0

## Shipment tracking

Clicking `Shipped` now opens a tracking-number prompt.

- Enter the courier tracking number before the drum is marked shipped.
- Cancelling the prompt leaves the drum unchanged.
- If no tracking number is available, the app asks for confirmation before continuing.
- The tracking number is stored safely in the drum notes without a database migration.
- Saved tracking numbers appear on drum cards and in Customers & Orders.

## Branding

The supplied Nowak Drum Company Australia logo has been cleaned, converted to a transparent gold web graphic and added to the application header.

No Supabase migration is required.
