# Nowak Workshop OS v7.9.52

Workshop Today completion filtering fix based on the full v7.9.51 project.

## What changed
- Drums with lifecycle status `Completed` are now excluded from all normal Workshop Today production batches.
- Drums whose production status is `Manufacturing Complete` are also excluded, covering older or partially migrated records.
- Completed drums are no longer shown in the `Outstanding Final Work` section. Final practical work must be resolved before the drum is marked Complete.
- Sold, Shipped and Archived filtering remains unchanged.
- No Supabase SQL or data migration is required.

---

# Nowak Workshop OS v7.9.51

Full deployment-stability build based on the current v7.9.50 application.

## What changed
- Keeps the exact v7.9.50 Workshop OS application logic and data behaviour.
- Restores the complete Vercel project structure rather than using a two-file patch.
- Pins React, Vite, Supabase, Lucide and QRCode package versions instead of using `latest`.
- Moves Vite and the React Vite plugin to devDependencies.
- Targets Node.js 20.x for the current deployment repair.
- Uses a deterministic Vercel npm install command with audit/funding checks disabled and legacy peer dependency resolution.
- Retains the existing Shopify/Xero server API groundwork already present in the full Workshop OS project.
- Does not change Supabase schema, RLS, drum data, inventory, production, pricing, purchase orders, media or hardware logic.

## Important
No Supabase SQL is required for this update.

This ZIP is a FULL PROJECT build. For GitHub, its contents should replace/update the project files rather than uploading only App.jsx.
