from pathlib import Path
src = Path(__file__).parents[1].joinpath('src/App.jsx').read_text()
assert 'const supplierOrderGroups=' in src
assert '?["Gold","Black Nickel"]' in src
assert 'finishFamily(part)==="Brass"?"SE06":"SE04"' in src
assert 'THROW-TRICK-BR"||/brass/.test(finish)' in src
assert '"Brass / Gold"' not in src
print('v7.9.8 inventory cleanup tests passed')
