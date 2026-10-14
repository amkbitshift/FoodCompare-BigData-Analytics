
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "output"

expected_files = [
    "dataset_audit_summary.csv",
    "dataset_overview.txt",
    "data_quality_summary.txt",
    "data_quality_summary.csv",
    "swiggy_cleaned.csv",
    "swiggy_analysis_ready.csv",
    "swiggy_eda_summary.txt",
    "swiggy_city_summary.csv",
    "swiggy_cuisine_summary.csv",
    "zomato_cleaned.csv",
    "zomato_eda_summary.txt",
    "zomato_city_summary.csv",
    "zomato_cuisine_summary.csv",
    "grubhub_cleaned.csv",
    "grubhub_eda_summary.txt",
    "grubhub_category_summary.csv",
    "restaurants_cleaned.csv",
    "restaurants_analysis_ready.csv",
    "restaurants_eda_summary.txt",
    "restaurants_category_summary.csv",
    "restaurants_location_summary.csv",
    "restaurant_menus_cleaned.csv",
    "restaurant_menus_analysis_ready.csv",
    "restaurant_menus_eda_summary.txt",
    "restaurant_menus_category_summary.csv",
    "comparative_eda_report.txt",
    "comparative_average_ratings.png",
    "grubhub_delivery_metrics.png",
    "comparative_swiggy_top_locations.png",
    "comparative_zomato_top_cities.png",
]

print("=" * 60)
print("FOOD DELIVERY BIG DATA PROJECT - OUTPUT VERIFICATION")
print("=" * 60)

present = []
missing = []

for filename in expected_files:
    path = OUTPUT_DIR / filename

    if path.is_file() and path.stat().st_size > 0:
        size_mb = path.stat().st_size / (1024 * 1024)
        present.append(filename)
        print(f"[OK]      {filename} ({size_mb:.2f} MB)")
    else:
        missing.append(filename)
        print(f"[MISSING] {filename}")

print("\n" + "-" * 60)
print(f"Files found: {len(present)} / {len(expected_files)}")
print(f"Files missing or empty: {len(missing)}")

if missing:
    print("\nCreate or verify these files before submission:")
    for filename in missing:
        print(f"- {filename}")
else:
    print("\nAll expected files are present and non-empty.")

print("\nProject folder:")
print(BASE_DIR)
