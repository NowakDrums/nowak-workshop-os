from pathlib import Path

src = Path(__file__).parents[1] / "src" / "App.jsx"
text = src.read_text()

assert 'return "Spray Polyurethane"' in text
assert 'return (32+(4*drums))/60' in text
assert 'plannedGroupHours(group,groupItems)' in text
assert 'batchName.includes("polyurethane")' in text
assert 'High-gloss polyurethane spray session' in text
print("v7.9.17 spray batching checks passed")
