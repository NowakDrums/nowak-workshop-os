# Nowak Workshop OS — v7.9.39

Small corrective patch built from v7.9.38.

## Fixed
- Undo Complete now verifies the saved database row is genuinely back in Production before reporting success.
- Reopened drums are explicitly prevented from falling back to legacy `Manufacturing Complete` state.
- Returned hardware allocations are released case-insensitively, so older `allocated` / mixed-case rows cannot remain attached to a drum.
- Hardware release is verified after saving before the app reports success.
- Removed the duplicate second hardware-release prompt that was using stale Job Card allocation state.
- Custom-order detection for reservation prompts now uses the saved sales status rather than a non-persisted `order_type` field.

No inventory recipes, purchase-order mappings, pricing, timing, media, social-post, or production-filter logic was changed.
