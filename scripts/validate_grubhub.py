
import csv
import math
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
FILE = BASE_DIR / "output" / "grubhub_cleaned.csv"

CHECKS = {
    "searched_lat": (-90, 90),
    "searched_lng": (-180, 180),
    "latitude": (-90, 90),
    "longitude": (-180, 180),
    "distance": (0, None),
    "delivery_fee": (0, None),
    "delivery_time": (0, None),
    "service_fee": (0, None),
    "review_count": (0, None),
    "review_rating": (0, 5),
}

stats = {
    column: {
        "missing": 0,
        "invalid": 0,
        "valid": 0,
        "minimum": None,
        "maximum": None,
    }
    for column in CHECKS
}

rows = 0
examples = {column: [] for column in CHECKS}

with open(FILE, "r", encoding="utf-8-sig", newline="") as file:
    reader = csv.DictReader(file)

    for row in reader:
        rows += 1

        for column, (low, high) in CHECKS.items():
            raw = (row.get(column) or "").strip()

            try:
                value = float(raw)
                if not math.isfinite(value):
                    raise ValueError
            except ValueError:
                stats[column]["missing"] += 1
                if len(examples[column]) < 3:
                    examples[column].append(raw)
                continue

            if (low is not None and value < low) or (
                high is not None and value > high
            ):
                stats[column]["invalid"] += 1
                if len(examples[column]) < 3:
                    examples[column].append(raw)
                continue

            stats[column]["valid"] += 1

            current_min = stats[column]["minimum"]
            current_max = stats[column]["maximum"]

            stats[column]["minimum"] = (
                value if current_min is None else min(current_min, value)
            )
            stats[column]["maximum"] = (
                value if current_max is None else max(current_max, value)
            )

print("GRUBHUB NUMERIC VALIDATION")
print("=" * 55)
print(f"Rows checked: {rows:,}")

for column, result in stats.items():
    print(f"\n{column}")
    print(f"  Valid values: {result['valid']:,}")
    print(f"  Missing/non-numeric: {result['missing']:,}")
    print(f"  Outside expected range: {result['invalid']:,}")
    print(f"  Minimum: {result['minimum']}")
    print(f"  Maximum: {result['maximum']}")
    if examples[column]:
        print(f"  Examples to inspect: {examples[column]}")

print("\nValidation completed. No files were modified.")
