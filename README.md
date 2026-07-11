# Nowak Workshop OS v6.0.9

## Job Card save fix

The Job Card was writing changes to Supabase but was not updating the app's active drum list and open Job Card state at the same time. This could make saved changes appear to disappear when the card was closed and reopened.

Save and Save & Close now use the shared drum update process so they:

- save the database record,
- update the Production list immediately,
- update the currently open Job Card,
- retain the saved values when reopened,
- show a visible success or failure message.

Save & Close only closes after a confirmed successful save.

No Supabase migration is required.
