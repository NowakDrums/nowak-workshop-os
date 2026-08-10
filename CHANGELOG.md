# Nowak Workshop OS — v7.9.40

## Completion and hardware allocation repair

This release fixes the completed-drum workflow without changing production recipes, purchasing, media, costing, or supplier mappings.

- **Undo Complete:** a persisted `NULL` lifecycle is now treated as the authoritative "back in production" state. The Job Card no longer falls back to a stale Completed value on the next save.
- **Returned hardware on stock drums:** deselecting fitted hardware returns the quantity to On Hand and immediately marks the allocation Released. Stock builds no longer retain hardware reservations.
- **Custom orders:** returned hardware may remain Allocated/reserved to the custom drum, or can be released when requested.
- **Database verification:** hardware stock and allocation updates now request the updated rows back from Supabase. If an RLS policy blocks the update, the app reports it instead of appearing to save successfully.
- **Supabase repair included:** `SUPABASE_v7_9_40_REPAIR.sql` explicitly restores UPDATE permission/policies for `drums` and `hardware_allocations` for the app's anon/authenticated roles.

### Install
1. Replace `src/App.jsx` with the patched file.
2. Replace `CHANGELOG.md`.
3. In Supabase, open **SQL Editor**, paste the full contents of `SUPABASE_v7_9_40_REPAIR.sql`, and click **Run** once.
