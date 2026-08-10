# Nowak Workshop OS v7.9.41

Small repair patch built from the safe v7.9.39 codebase. No Supabase migration is required.

## Fixed
- Undo Complete now persists correctly. A database `NULL` lifecycle status is treated as an intentional "In Production" state and is no longer replaced by a stale Completed value when the Job Card is later saved.
- Deselecting fitted hardware now returns the quantity to On Hand and removes the active allocation for stock drums.
- Custom orders may continue to keep returned hardware reserved for the customer, or release the reservation when all fitted hardware is removed.
- Stock drums with no fitted hardware cannot remain accidentally allocated after saving Adjust Hardware Used.

## Not changed
- No database schema, RLS, Supabase policies or migrations.
- No purchasing, costing, production recipes, media, marketing or supplier logic changes.
