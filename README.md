# Nowak Workshop OS v5.4.7

Sold and Shipped routing fix.

## Mark Sold
- Saves the sale, shipping and payment details.
- Closes the Job Card.
- Opens Production automatically.
- Selects the Sold tab.
- The drum appears immediately in Sold.

## Mark Shipped
- Closes the Job Card.
- Opens Production automatically.
- Selects the Shipped tab.

## Stale Job Card protection
Before saving a Job Card, NBS now checks the current database sales status.
A stale open card can no longer change a Sold or Shipped drum back to Stock or Custom.

## Production visibility
Production filtering now works from the complete drum list.
Dashboard counts continue to use only unsold/unshipped operational drums.

No new Supabase migration is required after v5.4.6.
