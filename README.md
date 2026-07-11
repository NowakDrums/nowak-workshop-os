# Nowak Workshop OS v5.4.5

Separate completion, sale and shipping states.

## Job Card completion controls
- Complete
- Sold
- Shipped

## Production tabs
- Completed: manufacturing complete but not sold
- Sold: sold but not yet shipped
- Shipped: shipped drums

## Behaviour
- Marking Sold records or updates the sale price and moves the drum to Sold.
- Marking Shipped moves it to Shipped.
- Existing `Sold/Shipped` records are treated as Shipped for backwards compatibility.
- Saving a Job Card preserves its Sold or Shipped status.

No Supabase migration is required.
