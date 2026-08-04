from math import isclose


def new_order_quantity(required, available, active_shortage, already_on_order):
    gross_need = max(active_shortage, max(0, required - available))
    return max(0, gross_need - already_on_order)

# Existing PO covers 20; new kit adds a further need of 24.
assert new_order_quantity(required=44, available=0, active_shortage=44, already_on_order=20) == 24
# Do not duplicate stock already ordered.
assert new_order_quantity(required=20, available=0, active_shortage=20, already_on_order=20) == 0
# Partially received PO: 20 ordered, 8 received, 12 still on order.
assert new_order_quantity(required=20, available=0, active_shortage=20, already_on_order=12) == 8

# Combined freight allocation by item value across two POs.
values = [100.0, 300.0]
shared = 80.0
allocated = [shared * value / sum(values) for value in values]
assert isclose(sum(allocated), shared)
assert allocated == [20.0, 60.0]

# Same hardware on both POs must be added once as a combined receipt.
old_qty, old_cost = 5, 10.0
shipment_quantities = [2, 3]
shipment_landed_values = [24.0, 39.0]
new_qty = sum(shipment_quantities)
combined_qty = old_qty + new_qty
weighted = ((old_qty * old_cost) + sum(shipment_landed_values)) / combined_qty
assert combined_qty == 10
assert isclose(weighted, 11.3)
print('v7.9.7 purchasing tests passed')
