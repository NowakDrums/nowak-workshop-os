# Nowak Workshop OS v5.3.3

Fixes and improvements:

- Fixed Progress buttons on Dashboard Priority Jobs, Workshop Today and Production.
- Progress buttons now show Progressing... while saving and display database errors clearly.
- Added Add Photo buttons directly to production/workshop cards.
- Added Take or Upload a Photo at Any Stage inside every Job Card.
- Reworked photo upload storage:
  - unique filenames
  - robust error handling
  - exact upload/database errors shown
  - no dependency on insert-return permissions
- Upload button now shows Uploading... and confirms successful storage.
- Existing v5.3 Supabase photo setup is still used; no new migration is required.
