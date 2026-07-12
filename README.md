# Nowak Workshop OS v6.7.0

## Workshop Tasks

Workshop Today now includes a lightweight section for non-drum work such as:

- cleaning dust extractors
- emptying bins
- machine maintenance
- sharpening tools
- ordering supplies
- customer emails
- general workshop cleanup
- miscellaneous one-off jobs

### Task options

Each task has:

- task name
- optional notes
- estimated time
- due date
- one-off, weekly or monthly recurrence

### Daily use

- Tasks due today appear in Workshop Today.
- Overdue tasks remain visible until completed or moved.
- Complete a recurring task and it automatically schedules its next occurrence.
- Move an unfinished task to tomorrow.
- Edit or delete tasks at any time.
- Upcoming tasks can be expanded without cluttering the main page.
- Workshop task time is kept separate from drum production time.

## Supabase migration required

Run `supabase/v6_7_0_workshop_tasks.sql` once in the Supabase SQL Editor.

## Rollback

The unchanged v6.6.0 ZIP remains the rollback version. The new workshop task table can remain in Supabase without affecting v6.6.0.
