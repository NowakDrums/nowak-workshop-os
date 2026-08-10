# Nowak Workshop OS v7.9.44

Focused Undo Complete restoration.

- Restores the exact return-to-production routine used in v7.9.8, which previously worked in the live app.
- Clicking Undo Complete:
  - asks for confirmation;
  - clears lifecycle Complete/Sold/Shipped;
  - returns the drum to its calculated production stage;
  - clears completion date;
  - removes late completion/marketing/shipping checklist states;
  - removes a linked sale record if one exists;
  - reloads live data and refreshes the open Job Card.
- The working v7.9.41 stock-hardware release behaviour is unchanged.
- No Supabase SQL, schema, RLS, inventory recipe, purchase-order, costing or media changes.
