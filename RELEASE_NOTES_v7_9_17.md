# Nowak Workshop OS v7.9.17

## Polyurethane spray-session batching

- Groups all scheduled high-gloss polyurethane coats into one `Spray Polyurethane` workshop session, even when drums are receiving different coat numbers.
- Keeps each drum’s actual coat number visible on its individual planner line.
- Calculates polyurethane and hardener from the total number of unfinished drums in the combined session.
- Calculates one batched workshop time rather than adding a separate setup/cleanup allowance for every drum.
- Uses the measured workshop relationship of approximately 40 minutes for two drums and 48 minutes for four drums.
- Completed spray tasks are excluded from the active mixture and time totals.

No Supabase migration is required.
