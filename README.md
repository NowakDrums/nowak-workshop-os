# Nowak Workshop OS v7.3.0

## Historical Drum Import

A new Historical Import page contains the 97 completed drums found in `Serial Number Record.xlsx`.

Before importing, the app cross-references every spreadsheet row against all current and archived drum records using:

- production number
- Nowak serial number

Records are classified as:

- Ready
- Already imported
- Conflict
- Source conflict

Only Ready records are imported. Existing records are never overwritten.

## Imported Job Cards

Every imported drum is created as a complete archived Nowak Job Card. Imported records:

- appear in Drum Register and Archive
- remain fully editable
- support stored photos and videos
- allow customer phone, email and address to be added later
- allow prices to be added later
- preserve every original spreadsheet field in Job Card notes
- remain excluded from active production and Workshop Today

## Source data mapping

Imported where identifiable:

- production number
- Nowak serial number
- completion date
- timber/material description
- size
- customer name
- finish
- stave or ply construction

The source workbook does not contain a price column. Prices are imported as $0 rather than guessed.

The spreadsheet contains a duplicate production number 43. The Historical Import page identifies this as a source conflict and does not import either conflicting row automatically.

## Supabase

No new migration is required. This uses the existing drums table.

The earlier v7.0.0 customer-phone migration is still required if it has not already been run.

## Rollback

Use v7.2.0 to roll back.
