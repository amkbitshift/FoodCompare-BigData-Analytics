
import csv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
INPUT_FILE = BASE_DIR / "output" / "restaurant_menus_cleaned.csv"
OUTPUT_FILE = BASE_DIR / "output" / "restaurant_menus_analysis_ready.csv"

rows = 0
corrected_prices = 0
zero_prices = 0

with open(INPUT_FILE, "r", encoding="utf-8-sig", newline="") as source:
    reader = csv.DictReader(source)
    headers = reader.fieldnames

    with open(
        OUTPUT_FILE, "w", encoding="utf-8-sig", newline=""
    ) as destination:
        writer = csv.DictWriter(destination, fieldnames=headers)
        writer.writeheader()

        for row in reader:
            rows += 1

            raw_price = (row.get("price") or "").strip()
            price_text = raw_price.upper().replace("USD", "").strip()

            try:
                price = float(price_text)
            except ValueError:
                price = None

            if price is not None and price < 0:
                row["price"] = ""
                corrected_prices += 1
            elif price == 0:
                zero_prices += 1

            writer.writerow(row)

print("Menu analysis-ready preparation completed.")
print(f"Rows processed: {rows:,}")
print(f"Negative prices marked missing: {corrected_prices:,}")
print(f"Zero-priced items retained: {zero_prices:,}")
print(f"Output: {OUTPUT_FILE}")
print("Original cleaned dataset was not modified.")
