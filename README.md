# Nowak Workshop OS v6.2.4

## Completed drum count

The Dashboard now counts every drum that is marked Completed and has not been sold or shipped.

The card is labelled `Completed drums`, rather than excluding completed custom orders.

## Assembly and lifecycle status

Unchecking `Assembled` now correctly removes the Completed lifecycle status, unless the drum has already been marked Sold or Shipped.

The drum returns to its actual production workflow and again shows assembly as outstanding.

## Interface cleanup

The internal `Stored lifecycle` line has been removed from drum cards. This was a database status indicator and was not useful workshop information.

The Cure Queue card has been removed from the Dashboard because curing tasks already appear in Workshop Today.

The Dashboard retains:

- Photo / Marketing Queue
- Suggested Work Batches
- Needs Attention

No Supabase migration is required.
