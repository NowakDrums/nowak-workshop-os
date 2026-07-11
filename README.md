# Nowak Workshop OS v6.2.5

## Completion status sync fix

Unchecking `Assembled` or any earlier manufacturing stage now immediately updates:

- the open Job Card
- Production cards
- the Completed group
- Dashboard completed-drum counts
- remaining production hours

Previously, the database checklist could save correctly while the app still displayed the old Completed lifecycle until a full refresh. The workflow save now uses the shared drum update function so every view receives the same saved record immediately.

No Supabase migration is required.
