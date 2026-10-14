
import csv
import math
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
FILE = BASE_DIR / "output" / "zomato_cleaned.csv"

CHECKS = {
    "Dining_Rating": (0, 5),
    "Delivery_Rating": (0, 5),
    "Prices": (0, None),
    "Average_Rating": (0, 5),
    "Price_per_Vote": (0, None),
    "Log_Price": (None, None),
}

stats = {
    column: {
        "valid": 0,
        "invalid": 0,
        "missing": 0,
        "minimum": None,
        "maximum": None,
    }
    for column in CHECKS
}

mismatches = {
    "Log_Price_vs_Price": 0,
    "Average_Rating_out_of_range": 0,
    "Invalid_binary_flags": 0,
}

examples = []
rows = 0

def number(value):
    try:
        result = float(value)
        if math.isfinite(result):
            return result
    except (TypeError, ValueError):
        pass
    return None

with open(FILE, "r", encoding="utf-8-sig", newline="") as file:
    reader = csv.DictReader(file)

    for row in reader:
        rows += 1
        parsed = {}

        for column, (low, high) in CHECKS.items():
            value = number(row.get(column))

            if value is None:
                stats[column]["missing"] += 1
                parsed[column] = None
                continue

            if (low is not None and value < low) or (
                high is not None and value > high
            ):
                stats[column]["invalid"] += 1
            else:
                stats[column]["valid"] += 1

            current_min = stats[column]["minimum"]
            current_max = stats[column]["maximum"]

            stats[column]["minimum"] = (
                value if current_min is None else min(current_min, value)
            )
            stats[column]["maximum"] = (
                value if current_max is None else max(current_max, value)
            )
            parsed[column] = value

        price = parsed["Prices"]
        log_price = parsed["Log_Price"]

        if price is not None and price > 0 and log_price is not None:
            if abs(math.log(price) - log_price) > 0.0001:
                mismatches["Log_Price_vs_Price"] += 1
                if len(examples) < 5:
                    examples.append(
                        (row.get("Prices"), row.get("Log_Price"))
                    )

        rating = parsed["Average_Rating"]
        if rating is not None and not 0 <= rating <= 5:
            mismatches["Average_Rating_out_of_range"] += 1

        for flag in ("Is_Bestseller", "Is_Highly_Rated", "Is_Expensive"):
            if row.get(flag) not in ("0", "1"):
                mismatches["Invalid_binary_flags"] += 1

print("ZOMATO NUMERIC VALIDATION")
print("=" * 55)
print(f"Rows checked: {rows:,}")

for column, result in stats.items():
    print(f"\n{column}")
    print(f"  Missing / non-numeric: {result['missing']:,}")
    print(f"  Outside allowed range: {result['invalid']:,}")
    print(f"  Minimum: {result['minimum']}")
    print(f"  Maximum: {result['maximum']}")

print("\nConsistency checks:")
for name, count in mismatches.items():
    print(f"  {name}: {count:,}")

print("Log-price mismatch examples:", examples)
print("\nValidation only; no files were modified.")
