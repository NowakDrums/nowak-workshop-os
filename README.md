# Nowak Workshop OS v3.1

Workflow Engine release.

The manufacturing checklist now automatically controls:
- Production status
- Next step
- Percentage complete
- Estimated labour completed
- Estimated labour remaining
- Completion date for each checklist item

Time Log now separates:
- Estimated hours to the current stage
- Estimated remaining hours
- Actual logged hours
- Variance between actual and estimated

Ply workflows automatically omit the Machined step.

Important:
Run `supabase/v3_1_migration.sql` once before deployment. It safely adds the
`stage_history` field only if it does not already exist.
