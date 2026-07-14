# Nowak Workshop OS v7.0.2

## Zero-price saving fix

A saved price of `$0` was being treated as an empty value when the Job Card reopened, causing the previous retail price to appear again.

The Job Card now distinguishes between:

- an intentionally entered `$0`
- a genuinely missing price

Brady / CB shell prices can now be saved as zero and remain zero after closing and reopening the Job Card.

## Planned work now progresses production

In Today's Plan, ticking a drum task complete now:

1. advances the actual drum Job Card workflow by one stage
2. updates the drum's next step
3. marks the planned task complete

For example, completing a planned **Poly coat 2** task moves the drum to **Poly coat 3**.

If the drum's current workflow stage no longer matches the planned item, the app shows a confirmation before progressing it.

Unticking a completed plan item only returns the plan item to Planned; it does not reverse the drum workflow.

## Supabase

No migration is required.

## Rollback

The unchanged v7.0.1 ZIP remains the rollback version.
