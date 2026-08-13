# Nowak Workshop OS v7.9.48

Photo/media reliability patch only.

- Brady/CB shell photos now refresh into the Job Card media section immediately after a successful save.
- The same stored `drum_photos` record and `drum-photos` storage bucket are used for Brady and Nowak drums, linked by the drum database ID.
- After a successful photo upload the app shows a clear confirmation such as “Photo saved successfully to this Brady shell” and automatically closes the photo window.
- Photos shown under **Photos & Videos by Stage** now have a visible **Delete** button beside **Open**.
- Deleting removes both the storage object and its `drum_photos` database record, then refreshes the media view.
- Existing Launch Pack delete behaviour is unchanged.
- No pricing, inventory, hardware allocation, purchase-order, production completion or Supabase schema/RLS changes.
