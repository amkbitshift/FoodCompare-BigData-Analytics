
import csv
from collections import Counter
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "output"

INPUT_FILE = OUTPUT_DIR / "grubhub_cleaned.csv"
REPORT_FILE = OUTPUT_DIR / "grubhub_eda_summary.txt"
CATEGORY_FILE = OUTPUT_DIR / "grubhub_category_summary.csv"

def parse_number(value):
    if value is None:
        return None

    value = value.strip()
    if not value:
        return None

    value = value.replace("$", "").replace(",", "")
    value = value.replace("minutes", "").replace("min", "").strip()

    try:
        return float(value)
    except ValueError:
        return None

numeric_fields = {
    "review_rating": "Restaurant review rating",
    "review_count": "Review count",
    "delivery_fee": "Delivery fee",
    "service_fee": "Service fee",
    "delivery_time": "Estimated delivery time",
    "distance": "Restaurant distance"
}

stats = {
    field: {"count": 0, "sum": 0.0, "min": None, "max": None}
    for field in numeric_fields
}

total_rows = 0
missing_by_field = Counter()
category_counts = Counter()
flag_counts = Counter()

with open(INPUT_FILE, "r", encoding="utf-8-sig", newline="") as file:
    reader = csv.DictReader(file)

    for row in reader:
        total_rows += 1

        for field in numeric_fields:
            value = parse_number(row.get(field))

            if value is None:
                missing_by_field[field] += 1
                continue

            # Basic validation to avoid impossible ratings.
            if field == "review_rating" and not 0 <= value <= 5:
                missing_by_field[field] += 1
                continue

            stat = stats[field]
            stat["count"] += 1
            stat["sum"] += value
            stat["min"] = value if stat["min"] is None else min(stat["min"], value)
            stat["max"] = value if stat["max"] is None else max(stat["max"], value)

        category = (row.get("restaurant_tags") or "").strip()
        if category:
            category_counts[category] += 1

        flag = (row.get("is_gh") or "").strip()
        if flag:
            flag_counts[flag] += 1
        else:
            flag_counts["Missing"] += 1

with open(REPORT_FILE, "w", encoding="utf-8") as file:
    file.write("GRUBHUB EXPLORATORY DATA ANALYSIS\n")
    file.write("=" * 45 + "\n\n")
    file.write(f"Total restaurant records: {total_rows:,}\n\n")

    for field, label in numeric_fields.items():
        stat = stats[field]
        file.write(f"{label} ({field})\n")
        file.write(f"  Valid records: {stat['count']:,}\n")

        if stat["count"]:
            average = stat["sum"] / stat["count"]
            file.write(f"  Average: {average:.3f}\n")
            file.write(f"  Minimum: {stat['min']}\n")
            file.write(f"  Maximum: {stat['max']}\n")
        else:
            file.write("  No valid numeric values found.\n")

        file.write(f"  Missing or invalid: {missing_by_field[field]:,}\n\n")

    file.write("TOP 10 RESTAURANT TAG GROUPS\n")
    for category, count in category_counts.most_common(10):
        file.write(f"{category}: {count:,}\n")

    file.write("\nIS GRUBHUB FLAG COUNTS\n")
    for flag, count in flag_counts.most_common():
        file.write(f"{flag}: {count:,}\n")

    file.write(
        "\nNote: Fees and delivery times describe this dataset's snapshot. "
        "They may not represent current prices or delivery estimates.\n"
    )

with open(CATEGORY_FILE, "w", encoding="utf-8-sig", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["Restaurant_Tags", "Record_Count"])
    writer.writerows(category_counts.most_common())

print("Grubhub EDA completed successfully.")
print(f"Total restaurant records: {total_rows:,}")

for field, label in numeric_fields.items():
    stat = stats[field]
    if stat["count"]:
        print(
            f"{label}: average={stat['sum'] / stat['count']:.3f}, "
            f"valid records={stat['count']:,}"
        )

print(f"Report: {REPORT_FILE}")
print(f"Category summary: {CATEGORY_FILE}")
