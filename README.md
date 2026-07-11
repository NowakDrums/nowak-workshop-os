# Nowak Workshop OS v6.0.1

Checklist saving and workflow separation fix.

## Fixed
- Save Changes now verifies the updated drum row from Supabase.
- Save & Close only closes after Supabase confirms the save.
- Checkbox changes show Saving checklist, Checklist saved, or Saved — moved to Shipped.
- Reopening the Job Card shows the stored checkbox values.

## Workflow separation
Production ends at Assembled and controls production percentage and estimated workshop time.

Fulfilment contains:
- Photos taken
- Packed
- Shipped

Optional Marketing contains:
- Website listing
- Facebook / Instagram
- YouTube demo

Fulfilment and marketing no longer add production hours.

Completed, Sold and Shipped drums show 0.00 production hours remaining.

No new Supabase migration is required after v6.0.0.
