
import csv
from collections import Counter
from pathlib import Path

import matplotlib.pyplot as plt

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "output"

INPUT_FILE = OUTPUT_DIR / "swiggy_analysis_ready.csv"
CITY_FILE = OUTPUT_DIR / "swiggy_city_summary.csv"
CUISINE_FILE = OUTPUT_DIR / "swiggy_cuisine_summary.csv"

def read_top_items(file_path, limit=10):
    items = []
    with open(file_path, "r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                items.append((row[reader.fieldnames[0]], int(row["Record_Count"])))
            except (ValueError, TypeError, KeyError):
                continue
    return items[:limit]

def save_bar_chart(labels, values, title, xlabel, ylabel, filename):
    if not labels:
        print(f"Skipped {filename}: no data available.")
        return

    plt.figure(figsize=(12, 7))
    plt.barh(labels[::-1], values[::-1])
    plt.title(title)
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / filename, dpi=200, bbox_inches="tight")
    plt.close()
    print(f"Created: {filename}")

# 1. Top cities by record count
cities = read_top_items(CITY_FILE)
save_bar_chart(
    [item[0] for item in cities],
    [item[1] for item in cities],
    "Top 10 Swiggy Locations by Record Count",
    "Number of Records",
    "Location",
    "swiggy_top_cities.png"
)

# 2. Top cuisines by record count
cuisines = read_top_items(CUISINE_FILE)
save_bar_chart(
    [item[0] for item in cuisines],
    [item[1] for item in cuisines],
    "Top 10 Swiggy Cuisines by Record Count",
    "Number of Cuisine Tags",
    "Cuisine",
    "swiggy_top_cuisines.png"
)

# 3. Rating distribution
ratings = []
price_values = []

with open(INPUT_FILE, "r", encoding="utf-8-sig", newline="") as file:
    reader = csv.DictReader(file)
    for row in reader:
        rating_text = (row.get("Rating_Numeric") or "").strip()
        if rating_text:
            try:
                rating = float(rating_text)
                if 0 <= rating <= 5:
                    ratings.append(rating)
            except ValueError:
                pass

        price_text = (row.get("Average Price") or "").strip()
        if price_text:
            import re
            match = re.search(r"[\d,]+(?:\.\d+)?", price_text)
            if match:
                try:
                    price = float(match.group().replace(",", ""))
                    if price >= 0:
                        price_values.append(price)
                except ValueError:
                    pass

if ratings:
    plt.figure(figsize=(10, 6))
    plt.hist(ratings, bins=15, edgecolor="black")
    plt.title("Distribution of Numeric Swiggy Ratings")
    plt.xlabel("Rating")
    plt.ylabel("Number of Records")
    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / "swiggy_rating_distribution.png", dpi=200)
    plt.close()
    print("Created: swiggy_rating_distribution.png")

if price_values:
    # Limit the chart to the 99th percentile so extreme prices
    # do not make the main distribution difficult to read.
    price_values.sort()
    cutoff_index = int(0.99 * (len(price_values) - 1))
    cutoff = price_values[cutoff_index]
    displayed_prices = [price for price in price_values if price <= cutoff]

    plt.figure(figsize=(10, 6))
    plt.hist(displayed_prices, bins=30, edgecolor="black")
    plt.title("Distribution of Swiggy Listed Price for Two (Up to 99th Percentile)")
    plt.xlabel("Listed Price for Two (source currency, assumed INR)")
    plt.ylabel("Number of Records")
    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / "swiggy_price_distribution.png", dpi=200)
    plt.close()
    print("Created: swiggy_price_distribution.png")

print("\nSwiggy visualization step completed.")
print(f"Charts are saved in: {OUTPUT_DIR}")
