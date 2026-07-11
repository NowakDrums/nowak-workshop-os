# Nowak Workshop OS v6.2.3

## Outstanding work fix

Assembly-related outstanding work now clears automatically when a drum is marked Assembled.

The following outstanding-work labels are treated as resolved by assembly:

- Hardware to be fitted
- Final assembly required
- Heads and tuning required

This works when:

- Assembled is checked in the Job Card
- The drum is progressed to Assembled from a production card
- Complete is selected

Existing completed drums with an older assembly-related Outstanding Work note are also displayed correctly without requiring a database migration.

Outstanding items that can still remain after assembly, such as Final inspection required or Customer collection pending, are not cleared automatically.

No Supabase migration is required.
