# Nowak Workshop OS v7.9.47

CB / Brady automatic price repair only.

- Existing CB/Brady drums with a zero price now auto-fill from the current Brady pricing rules when the Job Card is opened.
- If a CB price was automatically calculated, changing a recognised finish/build configuration keeps that automatic price in sync.
- Manual non-zero CB price overrides are preserved.
- Switching an existing drum to Brady/CB ownership also fills a missing price when a valid pricing rule is available.
- Job Card Save now stores the CB amount in `wholesale_price` as well as `custom_price`/`total_price`.
- Existing Brady pricing values are unchanged.
- No Supabase SQL/schema/RLS, inventory, purchase-order, allocation or production-workflow changes.

Note: Brady snare pricing still requires Satin or High Gloss because those prices differ. A snare left as To Be Decided cannot determine which wholesale price applies.
