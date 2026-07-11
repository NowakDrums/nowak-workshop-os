# Nowak Workshop OS v6.2.1

## Expanded Dashboard

The Dashboard now provides the current workshop snapshot:

- Active drums
- Custom orders
- Brady / CB drums
- Overdue jobs
- Potential retail
- Hardware stock value
- Estimated gross profit
- Stave drums in production
- Ply drums in production
- Completed drums in stock

The relevant cards are clickable and open Production, Orders, Inventory or Workshop Summary.

## Needs Attention

The old Priority Jobs section has been removed.

A drum only appears under Needs Attention when it has a clear issue:

- Overdue
- Due within seven days
- Outstanding final work
- Sold but awaiting shipment
- Missing customer name on a Nowak custom order
- Missing customer email on a Nowak custom order

This avoids duplicating Workshop Today and makes the Dashboard genuinely action-focused.

## Dashboard versus Workshop Summary

- Dashboard: current operational snapshot
- Workshop Summary: performance over time

No Supabase migration is required.
