# Nowak Workshop OS v6.5.0

## Daily Workshop Planning

This version adds a simple, optional planning layer without changing the existing production workflow.

### Plan work
- Add an individual drum to tomorrow's plan from Production or Workshop Today.
- Add an entire suggested batch to tomorrow.
- Add a complete kit/project to tomorrow.
- Duplicate tasks are ignored automatically.

### Workshop Today
The page now begins with:
- Today's Plan
- Tomorrow's Plan
- estimated task count and total time
- grouped tasks by batch or project

### Manage the plan
- Mark a planned item done
- Open the associated drum
- Remove an item
- Move all unfinished work from today to tomorrow

Marking a planning item done does not automatically change the drum's manufacturing checklist. This keeps the plan as a flexible guide and prevents accidental production updates.

## Supabase migration required

Run `supabase/v6_5_0_work_planning.sql` once in the Supabase SQL Editor.

## Rollback

The unchanged v6.4.0 ZIP remains the rollback version. Its existing repair migration and data remain compatible.
