# Nowak Workshop OS v6.9.0

## Automatic social-media content queue

Comms & Marketing now opens with a simple Content Queue.

Every group of stored milestone photos or videos automatically appears as a marketing item. Existing media is also detected, so older Nowak content is available without re-uploading it.

### Included

- Nowak drums
- Unallocated / undetermined drums

### Excluded

- Brady / CB drums

Ownership is checked whenever the queue is displayed. If an unallocated drum is later assigned to Brady, its marketing content disappears from this queue.

### Queue statuses

- To Review
- Held for Final Post
- Completed
- Ignored

Each item shows:

- drum production number, timber, size and construction
- milestone
- photo and video count
- a short explanation
- Open Media
- Open Drum
- Hold for Final
- Complete
- Ignore
- Return to Review

Media links directly to the existing stored photos and videos. No duplicate files are created.

The existing Launch Pack Drafts and Milestone Generator remain available as secondary tabs.

## Supabase migration required

Run `supabase/v6_9_0_marketing_queue.sql` once in the Supabase SQL Editor.

## Rollback

The unchanged v6.8.1 ZIP remains the rollback version. The new table is additive and can remain in Supabase without affecting v6.8.1.
