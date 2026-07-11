# Nowak Workshop OS v6.0.5

## Editable timber type

The Job Card now includes a Timber type dropdown under Build Details.

- Uses the same timber list as Add Drum
- Preserves an existing timber value even if it is not in the standard list
- Saves with Save or Save & Close
- Updates the Stave/Ply calculator display after saving

## Complete, Sold and Shipped

These actions no longer close the Job Card or navigate to another Production tab.

They now:

1. save and verify the lifecycle status in Supabase,
2. keep the Job Card open,
3. update the highlighted lifecycle button,
4. show a confirmation message.

Only Close or Save & Close closes the Job Card.

## Supabase

No migration is required.
