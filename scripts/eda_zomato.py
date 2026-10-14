
import csv
from collections import Counter
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "output"

INPUT_FILE = OUTPUT_DIR / "zomato_cleaned.csv"
REPORT_FILE = OUTPUT_DIR / "zomato_eda_summary.txt"
CITY_FILE = OUTPUT_DIR / "zomato_city_summary.csv"
CUISINE_FILE = OUTPUT_DIR / "zomato_cuisine_summary.csv"

total_rows = 0
rating_sum = 0.0
rating_count = 0
rating_min = None
rating_max = None

price_sum = 0.0
price_count = 0
price_min = None
price_max = None

city_counts = Counter()
cuisine_counts = Counter()
bestseller_counts = Counter()
restaurant_ratings = Counter()

def number(value):
    if value is None or not value.strip():
        return None
    try:
        return float(value.strip())
    except ValueError:
        return None

with open(INPUT_FILE, "r", encoding="utf-8-sig", newline="") as file:
    reader = csv.DictReader(file)

    for row in reader:
        total_rows += 1

        # Use Average_Rating, which is the item-level rating field.
        rating = number(row.get("Average_Rating"))
        if rating is not None and 0 <= rating <= 5:
            rating_count += 1
            rating_sum += rating
            rating_min = rating if rating_min is None else min(rating_min, rating)
            rating_max = rating if rating_max is None else max(rating_max, rating)

        # Prices is the listed item price, not the price for two.
        price = number(row.get("Prices"))
        if price is not None and price >= 0:
            price_count += 1
            price_sum += price
            price_min = price if price_min is None else min(price_min, price)
            price_max = price if price_max is None else max(price_max, price)

        city = (row.get("City") or "").strip()
        if city:
            city_counts[city] += 1

        cuisine = (row.get("Cuisine") or "").strip()
        if cuisine:
            for item in cuisine.split(","):
                item = item.strip()
                if item:
                    cuisine_counts[item] += 1

        bestseller = (row.get("Is_Bestseller") or "").strip()
        if bestseller:
            bestseller_counts[bestseller] += 1

        restaurant = (row.get("Restaurant_Name") or "").strip()
        restaurant_rating = number(row.get("Avg_Rating_Restaurant"))
        if restaurant and restaurant_rating is not None:
            restaurant_ratings[restaurant] = restaurant_rating

average_rating = rating_sum / rating_count if rating_count else None
average_price = price_sum / price_count if price_count else None

with open(REPORT_FILE, "w", encoding="utf-8") as file:
    file.write("ZOMATO EXPLORATORY DATA ANALYSIS\n")
    file.write("=" * 45 + "\n\n")
    file.write(f"Total item records: {total_rows:,}\n")
    file.write(f"Records with numeric item ratings: {rating_count:,}\n")
    file.write(f"Average item rating: {average_rating}\n")
    file.write(f"Minimum item rating: {rating_min}\n")
    file.write(f"Maximum item rating: {rating_max}\n\n")

    file.write(f"Records with valid non-negative prices: {price_count:,}\n")
    file.write(f"Average listed item price: {average_price}\n")
    file.write(f"Minimum listed item price: {price_min}\n")
    file.write(f"Maximum listed item price: {price_max}\n\n")

    file.write("TOP 10 CITIES BY ITEM-RECORD COUNT\n")
    for city, count in city_counts.most_common(10):
        file.write(f"{city}: {count:,}\n")

    file.write("\nTOP 10 CUISINES BY TAG COUNT\n")
    for cuisine, count in cuisine_counts.most_common(10):
        file.write(f"{cuisine}: {count:,}\n")

    file.write("\nBESTSELLER FLAG COUNTS\n")
    for flag, count in bestseller_counts.most_common():
        file.write(f"{flag}: {count:,}\n")

    file.write("\nNOTE: Counts are item records or cuisine tags, not unique restaurants.\n")
    file.write("Price and rating fields reflect this dataset's definitions and coverage.\n")

with open(CITY_FILE, "w", encoding="utf-8-sig", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["City", "Record_Count"])
    writer.writerows(city_counts.most_common())

with open(CUISINE_FILE, "w", encoding="utf-8-sig", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["Cuisine", "Cuisine_Tag_Count"])
    writer.writerows(cuisine_counts.most_common())

print("Zomato EDA completed successfully.")
print(f"Total item records: {total_rows:,}")
print(f"Records with numeric ratings: {rating_count:,}")
print(f"Average item rating: {average_rating}")
print(f"Records with valid prices: {price_count:,}")
print(f"Average item price: {average_price}")
print(f"Report: {REPORT_FILE}")
print(f"City summary: {CITY_FILE}")
print(f"Cuisine summary: {CUISINE_FILE}")
