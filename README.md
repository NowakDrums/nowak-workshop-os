# Nowak Workshop OS v7.7.7

## Editable Purchase Orders

Saved purchase orders can now be edited before completion. You can change quantities, remove lines, add another Lea Hung inventory item and update notes. The formatted email and PDF use the revised saved quantities.

## Accurate Shipment Receiving

Receive Shipment opens a line-by-line receiving screen showing ordered, previously received, outstanding and received-now quantities. Only quantities actually received are added to stock.

Partial shipments remain Partially Received and can be reopened later. You may close an order with remaining quantities cancelled when the supplier is out of stock. Receiving history is retained.

Optional receiving details include delivery date, supplier invoice, tracking number, freight type, actual freight cost and notes.

## Supabase migration

Run `supabase/v7_7_7_purchase_order_editing_and_receiving.sql` once.

## Rollback

Use v7.7.6. The additive database columns may remain safely.
