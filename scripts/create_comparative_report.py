
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "output"

REPORT_FILE = OUTPUT_DIR / "comparative_eda_report.txt"

REPORTS = [
    ("Swiggy", "swiggy_eda_summary.txt"),
    ("Zomato", "zomato_eda_summary.txt"),
    ("Grubhub", "grubhub_eda_summary.txt"),
    ("Restaurants dataset", "restaurants_eda_summary.txt"),
    ("Restaurant menus dataset", "restaurant_menus_eda_summary.txt"),
]

with open(REPORT_FILE, "w", encoding="utf-8") as report:
    report.write("COMPARATIVE BIG DATA ANALYTICS\n")
    report.write("Online Food Delivery Platforms and Restaurant Data\n")
    report.write("=" * 65 + "\n\n")

    report.write("1. PROJECT OBJECTIVE\n")
    report.write(
        "This project explores restaurant and online food-delivery data using "
        "data cleaning, quality checks, exploratory analysis, and summary reports. "
        "The goal is to identify patterns in ratings, prices, delivery estimates, "
        "restaurant categories, cuisines, and menu records.\n\n"
    )

    report.write("2. DATASET-SPECIFIC EDA REPORTS\n")
    for name, filename in REPORTS:
        report.write("\n" + "-" * 65 + "\n")
        report.write(f"{name}\n")
        report.write("-" * 65 + "\n")

        path = OUTPUT_DIR / filename
        if path.exists():
            report.write(path.read_text(encoding="utf-8"))
            report.write("\n")
        else:
            report.write(f"Report not found: {filename}\n")

    report.write("\n3. CROSS-DATASET LIMITATIONS\n")
    report.write(
        "- The datasets represent different geographies, collection periods, "
        "currencies, and units of observation.\n"
        "- Restaurant records, menu-item records, and platform listings are "
        "not interchangeable.\n"
        "- Ratings may be defined differently across sources.\n"
        "- Price fields may represent an individual item, a meal for two, or "
        "another source-specific convention.\n"
        "- Delivery estimates and fees are historical snapshot values and "
        "should not be presented as current live information.\n"
        "- Therefore, raw averages should not be used to rank platforms "
        "without harmonizing definitions and units first.\n\n"
    )

    report.write("4. FUTURE ANALYSIS\n")
    report.write(
        "- Build charts for ratings, prices, cuisines, and locations.\n"
        "- Standardize currency, time period, and metric definitions where possible.\n"
        "- Compare platforms only on fields that are genuinely comparable.\n"
        "- Document missing values, outliers, and assumptions.\n"
        "- Use Spark for distributed processing where appropriate and "
        "Python streaming for large CSV outputs when the Windows environment "
        "does not support Spark file writing.\n"
    )

print("Comparative EDA report created successfully.")
print(f"Report: {REPORT_FILE}")
