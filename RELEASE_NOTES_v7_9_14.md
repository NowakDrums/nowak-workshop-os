# Nowak Workshop OS v7.9.14

- Removed supplier selectors from Target Drum Stock and individual drum rows.
- Added one Purchase order supplier selector directly inside the purchase-order panel.
- Lea Hung remains the default supplier.
- The entire current calculated order can be reassigned to Rech, Mega Music, Drum Factory Direct, or a newly added supplier.
- Changing the purchase-order supplier updates the heading, recipient email, preview, draft purchase order, copied order and email action without changing the calculated parts or quantities.
- Existing open purchase orders remain supplier-specific when determining quantities already on order.
- No Supabase migration is required.
