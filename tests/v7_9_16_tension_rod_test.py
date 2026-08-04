from pathlib import Path
src=Path(__file__).parents[1].joinpath("src/App.jsx").read_text()
assert 'function tensionRodRequirement(length,qty,finish)' in src
assert 'tensionRodRequirement(45,rodCount,finish)' in src
assert 'tensionRodRequirement(45,12,finish)' in src
assert 'tensionRodRequirement(45,16,finish)' in src
assert 'const clawCount=["22","24"].includes(diameter)?10:8;' in src
assert 'tensionRodRequirement(110,bassRodCount,finish)' in src
assert 'finishLabel==="Chrome" ? "Stainless Steel" : finishLabel' in src
assert 'qty:bassRodCount' in src
assert 'v7.9.16' in src
print("v7.9.16 tension rod checks passed")
