
import csv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
FILE = BASE_DIR / "output" / "restaurant_menus_cleaned.csv"

negative_count = 0
zero_count = 0
negative_examples = []

with open(FILE, "r", encoding="utf-8-sig", newline="") as file:
    reader = csv.DictReader(file)

    for row in reader:
        raw_price = (row.get("price") or "").strip()
        price_text = raw_price.upper().replace("USD", "").strip()

        try:
            price = float(price_text)
        except ValueError:
            continue

        if price < 0:
            negative_count += 1
            if len(negative_examples) < 20:
                negative_examples.append({
                    "restaurant_id": row["restaurant_id"],
                    "category": row["category"],
                    "name": row["name"],
                    "description": row["description"],
                    "price": raw_price,
                })

        elif price == 0:
            zero_count += 1

print("MENU PRICE INSPECTION")
print("-" * 55)
print(f"Negative-price rows: {negative_count:,}")
print(f"Zero-price rows: {zero_count:,}")

print("\nNegative-price records:")
for item in negative_examples:
    print(item)

print("\nInspection completed. No files were modified.")
