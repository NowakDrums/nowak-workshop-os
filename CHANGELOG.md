# v7.9.42

- Fixes Undo Complete by separating the Assembled production task from the explicit Complete lifecycle state.
- An Assembled checklist tick no longer automatically makes a drum Manufacturing Complete.
- Undo Complete can therefore return an assembled drum to In Production without the old assembly history forcing it back to Complete.
- Hardware release behaviour from v7.9.41 is unchanged.
- No Supabase migration or SQL change is required.
