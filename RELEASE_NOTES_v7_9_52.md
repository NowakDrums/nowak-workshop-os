# Nowak Workshop OS v7.9.52

## Fix: completed drums in Workshop Today

This update fixes an issue where drums already marked **Complete** could still appear under **Workshop Today**.

### New behaviour
A drum is excluded from Workshop Today when either:
- its lifecycle status is `Completed`, or
- its production status is `Manufacturing Complete`.

Completed drums also no longer remain visible through the **Outstanding Final Work** panel. Any final practical work should be finished before marking the drum Complete.

### Unchanged
Production history, drum records, sales status, hardware allocation, inventory and Supabase data are not changed by this patch. No SQL is required.
