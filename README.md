# Nowak Workshop OS v5.0

This release repairs the two reported problems:

## Save Changes
- Empty due dates are now saved as database NULL values.
- No-project selections are now saved as database NULL values instead of an invalid blank UUID.
- A successful save is verified by Supabase.
- Failed saves display the exact database error instead of only saying "Save failed".

## Kits / Projects
- Includes a comprehensive Supabase setup script.
- Ensures the projects table, project_id field and stage_history field exist.
- Adds the RLS policies needed by the current browser-based Workshop OS.
- Creating, linking, moving and unlinking drums now reports success or the exact failure.
- Existing individual drum cards can be selected in bulk and linked to a project.
- New drums can be assigned to an existing or newly created project.

## Installation
Run `supabase/v5_0_setup.sql` in Supabase SQL Editor, then upload the app to GitHub.
