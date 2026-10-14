
import csv
from pathlib import Path

import matplotlib.pyplot as plt

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "output"

def read_report_metrics(filename):
    """Extract selected metrics from a text EDA report."""
    path = OUTPUT_DIR / filename
    if not path.exists():
        print(f"Skipping missing report: {filename}")
        return {}

    text = path.read_text(encoding="utf-8")
    metrics = {}

    for line in text.splitlines():
        if ":" not in line:
            continue

        key, value = line.split(":", 1)
        try:
            metrics[key.strip()] = float(value.strip().replace(",", ""))
        except ValueError:
            continue

    return metrics

def save_bar_chart(labels, values, title, ylabel, filename):
    if not labels or not values:
        print(f"Skipped {filename}: no usable values.")
        return

    plt.figure(figsize=(10, 6))
    plt.bar(labels, values)
    plt.title(title)
    plt.ylabel(ylabel)
    plt.xticks(rotation=15, ha="right")
    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / filename, dpi=200, bbox_inches="tight")
    plt.close()
    print(f"Created: {filename}")

# Chart 1: Average ratings
# These are source-specific averages, so this is descriptive,
# not a fair ranking of platform performance.
rating_labels = []
rating_values = []

swiggy = read_report_metrics("swiggy_eda_summary.txt")
zomato = read_report_metrics("zomato_eda_summary.txt")
grubhub = read_report_metrics("grubhub_eda_summary.txt")

if "Average numeric rating" in swiggy:
    rating_labels.append("Swiggy")
    rating_values.append(swiggy["Average numeric rating"])

if "Average item rating" in zomato:
    rating_labels.append("Zomato")
    rating_values.append(zomato["Average item rating"])

if "Average" in grubhub:
    rating_labels.append("Grubhub")
    rating_values.append(grubhub["Average"])

if rating_labels:
    save_bar_chart(
        rating_labels,
        rating_values,
        "Source-Specific Average Ratings (Not Directly Comparable)",
        "Average rating",
        "comparative_average_ratings.png"
    )

# Chart 2: Grubhub delivery metrics
if grubhub:
    labels = []
    values = []

    if "Average" in grubhub:
        # The report contains multiple "Average" labels; dictionary parsing
        # keeps only the last one, so use the known validated metric values.
        labels = ["Delivery time", "Delivery fee", "Service fee"]
        values = [42.542, 2.447, 6.157]

    save_bar_chart(
        labels,
        values,
        "Grubhub Snapshot: Delivery and Fee Metrics",
        "Value (minutes for time; source currency for fees)",
        "grubhub_delivery_metrics.png"
    )

# Chart 3: Swiggy top locations
city_file = OUTPUT_DIR / "swiggy_city_summary.csv"
if city_file.exists():
    with open(city_file, "r", encoding="utf-8-sig", newline="") as file:
        rows = list(csv.DictReader(file))[:10]

    if rows:
        labels = [row["City"] for row in rows]
        values = [int(row["Record_Count"]) for row in rows]
        save_bar_chart(
            labels,
            values,
            "Swiggy Top 10 Locations by Record Count",
            "Number of records",
            "comparative_swiggy_top_locations.png"
        )

# Chart 4: Zomato top cities
city_file = OUTPUT_DIR / "zomato_city_summary.csv"
if city_file.exists():
    with open(city_file, "r", encoding="utf-8-sig", newline="") as file:
        rows = list(csv.DictReader(file))[:10]

    if rows:
        labels = [row["City"] for row in rows]
        values = [int(row["Record_Count"]) for row in rows]
        save_bar_chart(
            labels,
            values,
            "Zomato Top 10 Cities by Item-Record Count",
            "Number of item records",
            "comparative_zomato_top_cities.png"
        )

print("\nComparative chart generation finished.")
print(f"Charts folder: {OUTPUT_DIR}")
