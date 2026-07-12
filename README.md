# Nowak Workshop OS v6.8.0

## Future Projects

A new lightweight Future Projects section allows ideas to be documented without adding them to Workshop Today or making them feel urgent.

Each future project includes:

- Project title
- Stage
- Preferred order
- Next action
- Notes

Stages include:

- Idea captured
- Researching
- External work commissioned
- Waiting on supplier
- Prototype ready
- Ready to schedule
- Active project
- Completed
- Parked

Preferred order includes:

- Next development project
- After current kits
- After stock is rebuilt
- Someday / no timeframe
- Parked

The Notes field is intentionally broad so it can hold mould dimensions, supplier information, quotes, materials, test ideas, design notes and anything else worth remembering.

Future Projects are deliberately kept separate from Workshop Today and active Kits / Projects.

## Supabase migration required

Run `supabase/v6_8_0_future_projects.sql` once in the Supabase SQL Editor.

## Rollback

The unchanged v6.7.1 ZIP remains the rollback version. The new table is additive and can remain in Supabase without affecting v6.7.1.
