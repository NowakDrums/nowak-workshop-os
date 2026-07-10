# Nowak Workshop OS v5.3.1

Focused milestone-photo workflow fix.

## Restored workflow button
- Job Cards again show `Progress to Next Stage`.
- Clicking it completes the correct next checklist item.
- Production status, Next Step, dates and labour estimates update automatically.
- If that stage has a photo milestone, the photo prompt opens immediately.

## Stock / Custom selection
- Nowak Job Cards now include:
  - Stock drum
  - Custom order
- Stock drums receive photo upload and prepopulated social messages.
- Custom orders receive the same, plus the prepopulated customer email when an email address is saved.
- Brady drums retain the completed-shell photo prompt.

## Save Changes
- Save Changes saves normal Job Card fields.
- It is no longer necessary to press Save Changes to progress a manufacturing stage.

No new Supabase migration is required because the v5.3 photo-storage setup has already been run.
