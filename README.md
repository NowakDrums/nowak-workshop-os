# Nowak Workshop OS v6.1.5

## Remaining production time

Lifecycle status no longer forces the remaining production estimate to zero.

A drum can sit in the Complete folder while the checklist still shows a final task such as assembly. The remaining estimate now follows the actual production checklist.

Example:
- Polishing complete
- Assembly not complete
- Estimated time remaining: 0.50 hr

## Time summary

Removed `Actual vs estimate` from the Job Card summary.

The summary now shows:
- Progress
- Estimated hours completed
- Estimated production hours remaining
- Actual hours logged

Actual hours remain 0.00 until workshop time is entered with `Add actual time`.

## Confirmed standard workshop time allocations

### Stave
- Cut and prepare timber: 1.50 hr
- Glue-up: 0.25 hr
- Machine shell: 1.00 hr
- Sand shell: 1.00 hr
- Bearing edges: 0.50 hr
- Snare beds: 0.50 hr
- Drill: 0.50 hr
- Inside oil/seal or preparation: 0.25 hr
- Spray work: 1.00 hr total across the applicable finish stages
- High-gloss polish: 1.00 hr
- Assembly: 0.50 hr

### Ply
- Cut veneer and glue pairs: 1.25 hr
- Shell lay-up: 0.50 hr
- Sand shell: 0.50 hr
- Bearing edges: 0.25 hr
- Snare beds: 0.25 hr
- Drill: 0.50 hr
- Inside oil/seal or preparation: 0.25 hr
- Spray work: 1.00 hr total across the applicable finish stages
- High-gloss polish: 1.00 hr
- Assembly: 0.50 hr

Natural and satin drums do not include polishing. Natural drums do not include a separate cure stage.

These are the standard snare-drum estimates. Larger toms, floor toms and bass drums may still need additional actual time recorded because their size-specific labour has not been given a fixed universal multiplier.

No Supabase migration is required.
