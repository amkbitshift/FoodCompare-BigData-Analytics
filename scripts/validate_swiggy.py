
import csv
from pathlib import Path
from collections import Counter

BASE_DIR = Path(__file__).resolve().parent.parent
FILE = BASE_DIR / "output" / "swiggy_cleaned.csv"

rating_values = Counter()
rating_count_values = Counter()
invalid_rating_examples = []
invalid_count_examples = []

rows = 0

with open(FILE, "r", encoding="utf-8-sig", newline="") as file:
    reader = csv.DictReader(file)

    for row in reader:
        rows += 1

        rating = (row.get("Rating") or "").strip()
        rating_values[rating] += 1

        if rating not in ("", "--"):
            try:
                value = float(rating)
                if not 0 <= value <= 5:
                    raise ValueError
            except ValueError:
                if len(invalid_rating_examples) < 10:
                    invalid_rating_examples.append(rating)

        count = (row.get("Number of Ratings") or "").strip()
        rating_count_values[count] += 1

        if count not in ("", "Too Few Ratings"):
            normalized = count.lower().replace("ratings", "").replace("rating", "").strip()

            try:
                value = int(normalized)
                if value < 0:
                    raise ValueError
            except ValueError:
                if len(invalid_count_examples) < 10:
                    invalid_count_examples.append(count)

print("SWIGGY NUMERIC VALIDATION")
print("-" * 45)
print(f"Rows checked: {rows:,}")

print("\nMost common rating values:")
for value, count in rating_values.most_common(10):
    print(f"  {value!r}: {count:,}")

print("\nMost common number-of-ratings values:")
for value, count in rating_count_values.most_common(10):
    print(f"  {value!r}: {count:,}")

print("\nInvalid rating examples:", invalid_rating_examples)
print("Invalid rating-count examples:", invalid_count_examples)
print("\nValidation completed. No files were modified.")
