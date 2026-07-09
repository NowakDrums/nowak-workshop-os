# Nowak Workshop OS Web App v2.0.4

Minor veneer calculator workflow fix:
- Veneer thickness fields now update the cut lengths live while typing on the Job Card
- Values still save back to Supabase when you leave the field
- Keeps the v2.0.3 outside-mould logic:
  - Layer 1 is the largest outer layer
  - Layer 1 remains fixed for the selected mould
  - Outer-layer thickness changes affect the inner layers only

No Supabase migration needed.
