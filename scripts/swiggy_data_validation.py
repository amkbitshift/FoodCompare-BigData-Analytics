
import csv
from pathlib import Path
from collections import Counter

PROJECT_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = PROJECT_DIR / "datasets" / "swiggy_file.csv"

total_rows = 0
empty_names = 0
coupon_like_names = 0
examples = []
name_counts = Counter()

coupon_keywords = [
    "USE ", "OFF", "ABOVE", "FLAT", "DEAL",
    "COUPON", "CODE REQUIRED"
]

with open(
    DATA_FILE,
    "r",
    encoding="utf-8-sig",
    newline="",
    errors="replace"
) as f:
    reader = csv.DictReader(f)

    for row in reader:
        total_rows += 1

        name = (row.get("Restaurant Name") or "").strip()
        name_counts[name] += 1

        if not name:
            empty_names += 1

        if any(word in name.upper() for word in coupon_keywords):
            coupon_like_names += 1

            if len(examples) < 10:
                examples.append({
                    "name": name,
                    "cuisine": row.get("Cuisine"),
                    "area": row.get("Area"),
                    "location": row.get("Location"),
                })

print(f"Total rows: {total_rows:,}")
print(f"Distinct restaurant-name values: {len(name_counts):,}")
print(f"Empty restaurant names: {empty_names:,}")
print(f"Coupon-like names: {coupon_like_names:,}")

print("\nMost frequent names:")
for name, count in name_counts.most_common(10):
    print(f"{count:,} | {name!r}")

print("\nExamples of coupon-like names:")
for example in examples:
    print(example)
