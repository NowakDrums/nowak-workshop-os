# Nowak Workshop OS v7.3.2

## Drum Register search

Register search now normalises common drum-size formats.

These searches match the same drum:

- 14x4.5
- 14 x 4.5
- 14 x 4 1/2
- 14x4½

The same matching applies to other half-inch depths such as 5.5 / 5 1/2 and 6.5 / 6 1/2.

Search also covers production number, CB number, Nowak serial, timber, customer, contact details, build type, finish and status.

## Register ordering

The default order is now newest production number first.

Sort options:

- Newest
- Oldest
- CB number
- Nowak serial number

## Ownership and status visibility

- Brady / CB rows have a blue outline and subtle blue shading.
- In Production drums have an amber status badge.
- Completed, Sold and Shipped drums are grouped under Completed.
- Archived drums are subdued and have an Archived badge.

Filters:

- All
- In Production
- Completed
- Archived
- Nowak
- Brady / CB
- Unallocated

All drums remain in the permanent register from the moment they receive a production number.

## Supabase

No migration is required.

## Rollback

Use v7.3.1 to roll back.
