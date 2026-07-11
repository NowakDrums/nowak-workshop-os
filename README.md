# Nowak Workshop OS v6.0.2

## Fixed

### Correct completed-build photo title
The completed shell/photo prompt now uses the drum ownership:

- Brady build: `Brady Shell Complete`
- Nowak custom: `Nowak Custom Drum Complete`
- Nowak stock: `Nowak Drum Complete`
- Unallocated: `Shell Complete`

Brady prompts are internal documentation only and no longer show social or customer-email content.

### Save & Close
The Save & Close handler is now correctly asynchronous. It waits for Supabase to confirm the save before closing the Job Card.

Buttons show `Saving...` and are disabled while the save is in progress, preventing duplicate clicks.

### Mobile footer
The oversized sticky footer has been replaced with a compact control bar:

- Save
- Save & Close
- Close

It remains accessible at the bottom without covering as much of the Job Card.

## Supabase
No new migration is required after v6.0.0.
