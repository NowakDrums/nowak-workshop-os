# Nowak Workshop OS v6.4.0

## Repairs & Modifications

A new dedicated section tracks customer repair and modification jobs separately from new drum production.

### Workflow
- Received
- In Progress
- Ready for Collection
- Collected & Paid

### Automatic numbering
Repair jobs receive their own sequence:
- R-001
- R-002
- R-003

### Standard services
- Cut bearing edges — $100
- Cut snare beds — $50
- Bearing edges and snare beds — $150
- Widen snare bed — $50
- Cut down shell — $100
- Miscellaneous repair — custom price

### Job information
- Customer name
- Phone
- Email
- Drum brand
- Drum description
- Agreed work
- Notes
- Agreed price
- Date received
- Optional due date
- Before, progress and completed photos

### Dashboard
- Active repair jobs
- Repairs ready for collection
- Repair income from jobs marked Collected & Paid

## Supabase migration required

Run `supabase/v6_4_0_repairs.sql` once in the Supabase SQL Editor before using the Repairs & Modifications section.
