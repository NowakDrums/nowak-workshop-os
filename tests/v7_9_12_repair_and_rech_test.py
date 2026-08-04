from pathlib import Path
s=Path(__file__).resolve().parents[1].joinpath('src/App.jsx').read_text()
assert 'v7.9.12 — visible Rech order selection and repair scheduling without constraint errors.' in s
assert '.upsert(row,{onConflict:"repair_id,planned_date"})' not in s
assert '.eq("repair_id",repair.id)' in s
assert '.insert(row)' in s
assert 'Finish supplier for this order' in s
assert '<option value="Rech">Rech</option>' in s
assert 'preferredSupplier:e.target.value' in s
print('v7.9.12 checks passed')
