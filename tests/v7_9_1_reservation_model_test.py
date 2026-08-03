# Regression checks for the inventory reservation model.
def inventory(on_hand, allocated):
    return {"on_hand": on_hand, "allocated": allocated, "available": on_hand - allocated}

assert inventory(10, 4) == {"on_hand": 10, "allocated": 4, "available": 6}
assert inventory(0, 10) == {"on_hand": 0, "allocated": 10, "available": -10}
assert inventory(5, 8)["available"] == -3
print("v7.9.1 reservation model tests passed")
