
import csv
import math
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
FILE = BASE_DIR / "output" / "restaurant_menus_cleaned.csv"

rows = 0
missing_ids = 0
missing_categories = 0
missing_names = 0
missing_descriptions = 0
missing_prices = 0
invalid_prices = 0
negative_prices = 0
zero_prices = 0
price_min = None
price_max = None
invalid_price_examples = []
sample_ids = set()

with open(FILE, "r", encoding="utf-8-sig", newline="") as file:
    reader = csv.DictReader(file)

    for row in reader:
        rows += 1

        restaurant_id = (row.get("restaurant_id") or "").strip()
        category = (row.get("category") or "").strip()
        name = (row.get("name") or "").strip()
        description = (row.get("description") or "").strip()
        raw_price = (row.get("price") or "").strip()

        if not restaurant_id:
            missing_ids += 1
        else:
            sample_ids.add(restaurant_id)

        if not category:
            missing_categories += 1

        if not name:
            missing_names += 1

        if not description:
            missing_descriptions += 1

        # Prices contain values such as "15.99 USD"
        price_text = raw_price.upper().replace("USD", "").strip()

        try:
            price = float(price_text)
            if not math.isfinite(price):
                raise ValueError
        except ValueError:
            invalid_prices += 1
            if len(invalid_price_examples) < 10:
                invalid_price_examples.append(raw_price)
            continue

        if price < 0:
            negative_prices += 1

        if price == 0:
            zero_prices += 1

        price_min = price if price_min is None else min(price_min, price)
        price_max = price if price_max is None else max(price_max, price)

        if not raw_price:
            missing_prices += 1

print("RESTAURANT MENUS VALIDATION")
print("=" * 55)
print(f"Rows checked: {rows:,}")
print(f"Distinct restaurant IDs encountered: {len(sample_ids):,}")
print(f"Missing restaurant IDs: {missing_ids:,}")
print(f"Missing categories: {missing_categories:,}")
print(f"Missing item names: {missing_names:,}")
print(f"Missing descriptions: {missing_descriptions:,}")
print(f"Missing prices: {missing_prices:,}")
print(f"Invalid numeric prices: {invalid_prices:,}")
print(f"Negative prices: {negative_prices:,}")
print(f"Zero prices: {zero_prices:,}")
print(f"Minimum price: {price_min}")
print(f"Maximum price: {price_max}")
print("Invalid price examples:", invalid_price_examples)
print("\nValidation completed. No files were modified.")
