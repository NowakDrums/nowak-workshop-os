# Nowak Workshop OS v6.6.0

## Drum Archive

A new final lifecycle state is available for drums whose entire job is finished.

Use **Close & Archive** when:
- Brady / CB has collected the shell
- a local customer has collected the drum
- a shipped customer has received the drum
- no further production, payment, shipping or follow-up is required

The app asks for the final outcome and records the archive date.

Archived drums are removed from:
- Dashboard operational counts
- Workshop Today
- Production
- Customers & Orders
- Needs Attention
- daily planning
- marketing and shipping queues

They remain searchable in the dedicated **Drum Archive** by production number, CB number, customer, timber, size or serial number.

Archived drums can be restored to their previous status if they were closed accidentally.

No Supabase migration is required. Archive details are stored safely in the existing drum record.

## Rollback

The unchanged v6.5.1 ZIP remains the rollback version.
