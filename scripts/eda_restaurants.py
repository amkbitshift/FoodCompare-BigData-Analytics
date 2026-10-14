
import csv
from collections import Counter
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "output"

INPUT_FILE = OUTPUT_DIR / "restaurants_analysis_ready.csv"
REPORT_FILE = OUTPUT_DIR / "restaurants_eda_summary.txt"
CATEGORY_FILE = OUTPUT_DIR / "restaurants_category_summary.csv"
LOCATION_FILE = OUTPUT_DIR / "restaurants_location_summary.csv"

numeric_fields = {
    "score": "Restaurant score",
    "ratings": "Review count",
    "position": "Restaurant position",
    "lat": "Latitude",
    "lng": "Longitude",
}

stats = {
    field: {"count": 0, "sum": 0.0, "min": None, "max": None}
    for field in numeric_fields
}

total_rows = 0
missing = Counter()
categories = Counter()
locations = Counter()
valid_coordinates = 0
invalid_coordinates = 0

def parse_number(value):
    if value is None or not value.strip():
        return None
    try:
        return float(value.strip().replace(",", ""))
    except ValueError:
        return None

with open(INPUT_FILE, "r", encoding="utf-8-sig", newline="") as file:
    reader = csv.DictReader(file)

    for row in reader:
        total_rows += 1

        for field in numeric_fields:
            value = parse_number(row.get(field))

            if value is None:
                missing[field] += 1
                continue

            stat = stats[field]
            stat["count"] += 1
            stat["sum"] += value
            stat["min"] = value if stat["min"] is None else min(stat["min"], value)
            stat["max"] = value if stat["max"] is None else max(stat["max"], value)

        lat = parse_number(row.get("lat"))
        lng = parse_number(row.get("lng"))

        if lat is not None and lng is not None and -90 <= lat <= 90 and -180 <= lng <= 180:
            valid_coordinates += 1
        else:
            invalid_coordinates += 1

        category = (row.get("category") or "").strip()
        if category:
            categories[category] += 1

        address = (row.get("full_address") or "").strip()
        if address:
            # Use the final address component as a rough location grouping.
            parts = [part.strip() for part in address.split(",") if part.strip()]
            location = parts[-1] if parts else ""
            if location:
                locations[location] += 1

with open(REPORT_FILE, "w", encoding="utf-8") as file:
    file.write("RESTAURANTS DATASET: EXPLORATORY DATA ANALYSIS\n")
    file.write("=" * 50 + "\n\n")
    file.write(f"Total restaurant records: {total_rows:,}\n")
    file.write(f"Records with coordinate pairs in valid geographic ranges: {valid_coordinates:,}\n")
    file.write(f"Records without valid coordinate pairs: {invalid_coordinates:,}\n\n")

    for field, label in numeric_fields.items():
        stat = stats[field]
        file.write(f"{label} ({field})\n")
        file.write(f"  Valid values: {stat['count']:,}\n")
        file.write(f"  Missing or invalid values: {missing[field]:,}\n")

        if stat["count"]:
            file.write(f"  Average: {stat['sum'] / stat['count']:.3f}\n")
            file.write(f"  Minimum: {stat['min']}\n")
            file.write(f"  Maximum: {stat['max']}\n")
        file.write("\n")

    file.write("TOP 10 RESTAURANT CATEGORIES\n")
    for category, count in categories.most_common(10):
        file.write(f"{category}: {count:,}\n")

    file.write("\nTOP 10 ADDRESS GROUPS\n")
    for location, count in locations.most_common(10):
        file.write(f"{location}: {count:,}\n")

    file.write(
        "\nNote: Address grouping uses the final comma-separated address component "
        "and may not represent a consistent city or region.\n"
    )

with open(CATEGORY_FILE, "w", encoding="utf-8-sig", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["Category", "Record_Count"])
    writer.writerows(categories.most_common())

with open(LOCATION_FILE, "w", encoding="utf-8-sig", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["Address_Group", "Record_Count"])
    writer.writerows(locations.most_common())

print("Restaurant dataset EDA completed successfully.")
print(f"Total records: {total_rows:,}")
print(f"Records with valid-range coordinates: {valid_coordinates:,}")
print(f"Records without valid coordinate pairs: {invalid_coordinates:,}")

for field, label in numeric_fields.items():
    stat = stats[field]
    if stat["count"]:
        print(
            f"{label}: average={stat['sum'] / stat['count']:.3f}, "
            f"valid values={stat['count']:,}, missing/invalid={missing[field]:,}"
        )

print(f"Report: {REPORT_FILE}")
print(f"Category summary: {CATEGORY_FILE}")
print(f"Location summary: {LOCATION_FILE}")
