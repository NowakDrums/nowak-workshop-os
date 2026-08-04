from pathlib import Path
s=Path("src/App.jsx").read_text()
assert "v7.9.13 — scheduled repair dates and flexible purchase-order suppliers." in s
assert "Scheduled: Today" in s and "Scheduled: Tomorrow" in s
assert "+ Add New Supplier…" in s
assert "Drum Factory Direct" in s and "Mega Music" in s
assert "otherSupplierGroups.map" in s
assert 'override!=="Lea Hung"' in s
print("v7.9.13 checks passed")
