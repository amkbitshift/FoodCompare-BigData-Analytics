
import csv
import re
from collections import Counter
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "output"

INPUT_FILE = OUTPUT_DIR / "restaurant_menus_analysis_ready.csv"
REPORT_FILE = OUTPUT_DIR / "restaurant_menus_eda_summary.txt"
CATEGORY_FILE = OUTPUT_DIR / "restaurant_menus_category_summary.csv"

total_rows = 0
valid_prices = 0
zero_prices = 0
negative_prices = 0
unparsed_prices = 0

price_sum = 0.0
price_min = None
price_max = None

restaurant_ids = set()
category_counts = Counter()
missing_descriptions = 0
missing_names = 0

def parse_price(value):
    if not value:
        return None

    # Extract a numeric price from strings such as "15.99 USD".
    match = re.search(r"-?\d[\d,]*(?:\.\d+)?", value)
    if not match:
        return None

    try:
        return float(match.group().replace(",", ""))
    except ValueError:
        return None

with open(INPUT_FILE, "r", encoding="utf-8-sig", newline="") as file:
    reader = csv.DictReader(file)

    for row in reader:
        total_rows += 1

        restaurant_id = (row.get("restaurant_id") or "").strip()
        if restaurant_id:
            restaurant_ids.add(restaurant_id)

        category = (row.get("category") or "").strip()
        if category:
            category_counts[category] += 1

        if not (row.get("description") or "").strip():
            missing_descriptions += 1

        if not (row.get("name") or "").strip():
            missing_names += 1

        price_text = (row.get("price") or "").strip()
        price = parse_price(price_text)

        if price is None:
            unparsed_prices += 1
        elif price < 0:
            negative_prices += 1
        elif price == 0:
            zero_prices += 1
        else:
            valid_prices += 1
            price_sum += price
            price_min = price if price_min is None else min(price_min, price)
            price_max = price if price_max is None else max(price_max, price)

average_price = price_sum / valid_prices if valid_prices else None

with open(REPORT_FILE, "w", encoding="utf-8") as file:
    file.write("RESTAURANT MENU DATASET: EXPLORATORY DATA ANALYSIS\n")
    file.write("=" * 55 + "\n\n")

    file.write(f"Total menu records: {total_rows:,}\n")
    file.write(f"Distinct restaurant IDs: {len(restaurant_ids):,}\n")
    file.write(f"Records with missing item names: {missing_names:,}\n")
    file.write(f"Records with missing descriptions: {missing_descriptions:,}\n\n")

    file.write("PRICE ANALYSIS\n")
    file.write(f"Positive parsed prices: {valid_prices:,}\n")
    file.write(f"Zero prices: {zero_prices:,}\n")
    file.write(f"Negative prices: {negative_prices:,}\n")
    file.write(f"Unparsed prices: {unparsed_prices:,}\n")

    if valid_prices:
        file.write(f"Average positive listed price: {average_price:.3f}\n")
        file.write(f"Minimum positive listed price: {price_min:.3f}\n")
        file.write(f"Maximum positive listed price: {price_max:.3f}\n")

    file.write(
        "\nImportant: Price values may use different currencies or formats. "
        "Do not interpret their overall average as a fair cross-country comparison.\n"
    )
    file.write(
        "Zero-priced menu items are retained in the dataset and may represent "
        "free items, add-ons, or data-specific conventions.\n\n"
    )

    file.write("TOP 15 MENU CATEGORIES BY RECORD COUNT\n")
    for category, count in category_counts.most_common(15):
        file.write(f"{category}: {count:,}\n")

with open(CATEGORY_FILE, "w", encoding="utf-8-sig", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["Category", "Menu_Record_Count"])
    writer.writerows(category_counts.most_common())

print("Restaurant menu EDA completed successfully.")
print(f"Total menu records: {total_rows:,}")
print(f"Distinct restaurant IDs: {len(restaurant_ids):,}")
print(f"Positive prices: {valid_prices:,}")
print(f"Zero prices: {zero_prices:,}")
print(f"Negative prices: {negative_prices:,}")
print(f"Unparsed prices: {unparsed_prices:,}")
print(f"Average positive listed price: {average_price}")
print(f"Report: {REPORT_FILE}")
print(f"Category summary: {CATEGORY_FILE}")
