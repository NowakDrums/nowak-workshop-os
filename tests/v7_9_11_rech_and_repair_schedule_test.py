from pathlib import Path

app = Path(__file__).parents[1] / 'src' / 'App.jsx'
text = app.read_text()
required = [
    'v7.9.11 — one-off Rech supplier override and reliable repair scheduling.',
    '<th>Finish supplier</th>',
    '<option>Lea Hung</option><option>Rech</option>',
    'Create / Update Rech Draft',
    'onConflict:"repair_id,planned_date"',
    'const saved=await onSchedule?.(date);',
]
missing = [item for item in required if item not in text]
assert not missing, f'Missing expected v7.9.11 markers: {missing}'
print('v7.9.11 static checks passed')
