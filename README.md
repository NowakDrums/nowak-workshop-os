# Nowak Workshop OS v5.4.6

Sale and shipping details update.

## Mark Sold workflow
When a drum is marked Sold, NBS now asks for:

1. Drum selling price, excluding shipping
2. Shipping charged to the customer
3. Actual shipping cost to Nowak
4. Payment status

Suggested payment statuses:
- Paid in Full
- Deposit Paid
- Invoice Sent
- Awaiting Payment

## Calculations
NBS stores and calculates:

- Total revenue = selling price + shipping charged
- Shipping profit/loss = shipping charged - actual shipping cost
- Estimated profit = total revenue - estimated build cost - actual shipping cost

The drum Job Card is also updated with the sale price, shipping charged and total revenue.

## Supabase
Run `supabase/v5_4_6_sale_shipping.sql` once before deploying v5.4.6.

## Rollback
v5.4.5 remains compatible. The additional sales columns do not affect the older version.
