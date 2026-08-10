# Nowak Workshop OS v7.9.43

Focused Undo Complete repair only.

- Undo Complete now runs directly from the button.
- Undo Complete clears the lifecycle Complete state and returns the drum to In Production.
- Assembly history is preserved; Assembled no longer recreates lifecycle Complete.
- Normal Job Card Save no longer derives Complete from the Assembled checklist item.
- Existing v7.9.41 hardware release behaviour is unchanged.
- No Supabase SQL, schema, RLS, inventory, purchase-order or hardware-rule changes.
