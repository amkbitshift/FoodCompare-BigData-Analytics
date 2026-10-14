
import csv
import re
from collections import Counter
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "output"

INPUT_FILE = OUTPUT_DIR / "swiggy_analysis_ready.csv"
REPORT_FILE = OUTPUT_DIR / "swiggy_eda_summary.txt"
CITY_FILE = OUTPUT_DIR / "swiggy_city_summary.csv"
CUISINE_FILE = OUTPUT_DIR / "swiggy_cuisine_summary.csv"

total_rows = 0
rated_count = 0
rating_sum = 0.0
rating_min = None
rating_max = None

price_count = 0
price_sum = 0.0
price_min = None
price_max = None

vegetarian_count = 0
non_vegetarian_count = 0

city_counts = Counter()
cuisine_counts = Counter()
offer_counts = Counter()

def extract_price(value):
    """Extract the numeric price from values such as '₹250 for two'."""
    if not value:
        return None

    match = re.search(r"[\d,]+(?:\.\d+)?", value)
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

        # Ratings
        rating_text = (row.get("Rating_Numeric") or "").strip()

        if rating_text:
            try:
                rating = float(rating_text)
                if 0 <= rating <= 5:
                    rated_count += 1
                    rating_sum += rating
                    rating_min = rating if rating_min is None else min(rating_min, rating)
                    rating_max = rating if rating_max is None else max(rating_max, rating)
            except ValueError:
                pass

        # Average price for two
        price = extract_price(row.get("Average Price", ""))

        if price is not None and price >= 0:
            price_count += 1
            price_sum += price
            price_min = price if price_min is None else min(price_min, price)
            price_max = price if price_max is None else max(price_max, price)

        # City and cuisine counts
        city = (row.get("Location") or "").strip()
        if city:
            city_counts[city] += 1

        cuisine_text = (row.get("Cuisine") or "").strip()
        if cuisine_text:
            for cuisine in cuisine_text.split(","):
                cuisine = cuisine.strip()
                if cuisine:
                    cuisine_counts[cuisine] += 1

        # Vegetarian status
        veg = (row.get("Pure Veg") or "").strip().lower()
        if veg == "yes":
            vegetarian_count += 1
        elif veg == "no":
            non_vegetarian_count += 1

        # Offer availability
        offer_name = (row.get("Offer Name") or "").strip()
        if offer_name:
            offer_counts["Has offer name"] += 1
        else:
            offer_counts["No offer name"] += 1

average_rating = rating_sum / rated_count if rated_count else None
average_price = price_sum / price_count if price_count else None

# Write readable summary
with open(REPORT_FILE, "w", encoding="utf-8") as file:
    file.write("SWIGGY EXPLORATORY DATA ANALYSIS\n")
    file.write("=" * 45 + "\n\n")
    file.write(f"Total restaurant/menu records: {total_rows:,}\n")
    file.write(f"Records with numeric ratings: {rated_count:,}\n")
    file.write(f"Average numeric rating: {average_rating}\n")
    file.write(f"Minimum numeric rating: {rating_min}\n")
    file.write(f"Maximum numeric rating: {rating_max}\n\n")
    file.write(f"Records with extractable prices: {price_count:,}\n")
    file.write(f"Average listed price for two: {average_price}\n")
    file.write(f"Minimum listed price for two: {price_min}\n")
    file.write(f"Maximum listed price for two: {price_max}\n\n")
    file.write(f"Vegetarian records: {vegetarian_count:,}\n")
    file.write(f"Non-vegetarian records: {non_vegetarian_count:,}\n\n")

    file.write("TOP 10 CITIES BY RECORD COUNT\n")
    for city, count in city_counts.most_common(10):
        file.write(f"{city}: {count:,}\n")

    file.write("\nTOP 10 CUISINES BY RECORD COUNT\n")
    for cuisine, count in cuisine_counts.most_common(10):
        file.write(f"{cuisine}: {count:,}\n")

    file.write("\nOFFER NAME COUNTS\n")
    for label, count in offer_counts.items():
        file.write(f"{label}: {count:,}\n")

# Write city summary CSV
with open(CITY_FILE, "w", encoding="utf-8-sig", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["City", "Record_Count"])
    writer.writerows(city_counts.most_common())

# Write cuisine summary CSV
with open(CUISINE_FILE, "w", encoding="utf-8-sig", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["Cuisine", "Record_Count"])
    writer.writerows(cuisine_counts.most_common())

print("Swiggy EDA completed successfully.")
print(f"Total records: {total_rows:,}")
print(f"Records with numeric ratings: {rated_count:,}")
print(f"Average rating: {average_rating}")
print(f"Records with extractable prices: {price_count:,}")
print(f"Average listed price for two: {average_price}")
print(f"Report: {REPORT_FILE}")
print(f"City summary: {CITY_FILE}")
print(f"Cuisine summary: {CUISINE_FILE}")
