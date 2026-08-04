from pathlib import Path
app=Path(__file__).parents[1]/'src'/'App.jsx'
s=app.read_text()
assert 'v7.9.11 — one-off Rech supplier override and reliable repair scheduling.' in s
assert 'const saved=await onSchedule?.(date);' in s
assert '.upsert(row,{onConflict:"repair_id,planned_date"})' in s
assert '.maybeSingle();' in s
assert '<th>Finish supplier</th>' in s
assert 'value={row.preferredSupplier||"Lea Hung"}' in s
assert '<option>Rech</option>' in s
assert 'supplierPlanKey(req.code,override)' in s
assert 'preferredSupplier:requirementUsesFinishSupplier(req)?override:null' in s
assert 'Create / Update Rech Draft' in s
assert 'saveSupplierPurchaseOrder("Rech","Draft")' in s
assert 'const categories=["Lugs","Air Vents","Tension Rods","Hoops","Floor Tom Hardware","Bass Drum Hardware","Snare Wires","Hardware"]' in s
print('v7.9.11 targeted checks passed')
