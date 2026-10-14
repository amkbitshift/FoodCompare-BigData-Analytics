
import csv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "output"

REPORT_FILE = OUTPUT_DIR / "data_quality_summary.txt"
CSV_FILE = OUTPUT_DIR / "data_quality_summary.csv"

datasets = [
    {
        "Dataset": "Swiggy",
        "Rows": 139321,
        "Columns": 10,
        "Status": "Normalized",
        "Findings": (
            "27 missing cuisines; 14,436 missing rating counts; "
            "1,752 missing offer names; 2 missing areas. "
            "NEW and rating-count labels handled in analysis-ready file."
        ),
        "Action": "Created swiggy_analysis_ready.csv",
    },
    {
        "Dataset": "Zomato",
        "Rows": 101530,
        "Columns": 26,
        "Status": "Initial validation passed",
        "Findings": (
            "No blank fields detected. Ratings and binary flags "
            "passed checks. Log_Price uses ln(Prices + 1). "
            "Price_per_Vote formula matches inspected records."
        ),
        "Action": "Retained zomato_cleaned.csv",
    },
    {
        "Dataset": "Grubhub",
        "Rows": 8088,
        "Columns": 27,
        "Status": "Initial numeric validation passed",
        "Findings": (
            "231 missing is_gh values and 22 missing restaurant_tags. "
            "Checked numeric fields were within expected ranges."
        ),
        "Action": "Retained grubhub_cleaned.csv",
    },
    {
        "Dataset": "Restaurants",
        "Rows": 63469,
        "Columns": 11,
        "Status": "Coordinates corrected",
        "Findings": (
            "28,167 missing scores and ratings; 10,617 missing price "
            "ranges; 453 missing addresses; 516 missing ZIP codes. "
            "40 invalid zero-coordinate pairs marked missing."
        ),
        "Action": "Created restaurants_analysis_ready.csv",
    },
    {
        "Dataset": "Restaurant menus",
        "Rows": 5082180,
        "Columns": 5,
        "Status": "Prices prepared",
        "Findings": (
            "1,439,670 missing descriptions; 3 negative prices "
            "marked missing; 174,251 zero-priced items retained. "
            "No missing IDs, categories, item names, or prices "
            "were found in the cleaned source."
        ),
        "Action": "Created restaurant_menus_analysis_ready.csv",
    },
]

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Save a machine-readable CSV summary
with open(CSV_FILE, "w", encoding="utf-8-sig", newline="") as file:
    writer = csv.DictWriter(file, fieldnames=datasets[0].keys())
    writer.writeheader()
    writer.writerows(datasets)

# Save a readable text report
total_rows = sum(item["Rows"] for item in datasets)

with open(REPORT_FILE, "w", encoding="utf-8") as file:
    file.write("BIG DATA PROJECT - DATA QUALITY SUMMARY\n")
    file.write("=" * 55 + "\n\n")
    file.write(f"Datasets reviewed: {len(datasets)}\n")
    file.write(f"Total rows across datasets: {total_rows:,}\n\n")

    for item in datasets:
        file.write("-" * 55 + "\n")
        file.write(f"Dataset: {item['Dataset']}\n")
        file.write(f"Rows: {item['Rows']:,}\n")
        file.write(f"Columns: {item['Columns']}\n")
        file.write(f"Status: {item['Status']}\n")
        file.write(f"Findings: {item['Findings']}\n")
        file.write(f"Action: {item['Action']}\n\n")

    file.write("IMPORTANT LIMITATIONS\n")
    file.write(
        "The datasets may differ in geography, currency, collection "
        "date, and unit of observation. Direct platform comparisons "
        "require checking these differences and harmonizing comparable "
        "fields first. Initial validation does not prove that every "
        "record is accurate.\n"
    )

print("Data quality summary created.")
print(f"Datasets documented: {len(datasets)}")
print(f"Total rows: {total_rows:,}")
print(f"Text report: {REPORT_FILE}")
print(f"CSV report: {CSV_FILE}")
