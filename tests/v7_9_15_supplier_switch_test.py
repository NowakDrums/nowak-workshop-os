from pathlib import Path
src=Path(__file__).parents[1].joinpath('src/App.jsx').read_text()
assert 'const onOrder=Number(onOrderByCode[parsed.code]||0);' in src
assert 'onOrderByCode[onOrderKey]' not in src
assert 'const isDomesticPurchaseSupplier=supplier=>/^(rech|mega music)$/i' in src
assert 'Can you please provide a quote including shipping?' in src
assert 'v7.9.15' in src
print('v7.9.15 supplier switch checks passed')
