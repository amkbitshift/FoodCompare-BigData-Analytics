
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "output"
REPORTS_DIR = BASE_DIR / "reports"

REPORTS_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_FILE = REPORTS_DIR / "final_findings.txt"

source_reports = [
    ("Swiggy", "swiggy_eda_summary.txt"),
    ("Zomato", "zomato_eda_summary.txt"),
    ("Grubhub", "grubhub_eda_summary.txt"),
    ("Restaurants", "restaurants_eda_summary.txt"),
    ("Restaurant Menus", "restaurant_menus_eda_summary.txt"),
]

findings = [
    (
        "Swiggy",
        "139,321 records were analyzed. There were 105,864 records with "
        "numeric ratings, with an average numeric rating of approximately "
        "4.04/5. The average extracted listed price for two was approximately "
        "270.34 in the source's assumed INR convention."
    ),
    (
        "Zomato",
        "101,530 item records were analyzed. The average item rating was "
        "approximately 3.89/5, and the average listed item price was "
        "approximately 243.69 in the source price units."
    ),
    (
        "Grubhub",
        "8,088 restaurant records were analyzed. The average review rating "
        "was approximately 3.40/5, average estimated delivery time was "
        "42.54 minutes, average delivery fee was 2.45, and average service "
        "fee was 6.16 in the source fee units."
    ),
    (
        "Restaurant listings",
        "The analysis-ready restaurant listing dataset contains 63,469 "
        "records. Its summary report describes score, review-count, category, "
        "address, and coordinate coverage."
    ),
    (
        "Restaurant menus",
        "5,082,180 menu records and 63,309 distinct restaurant IDs were "
        "analyzed. There were 4,907,926 positive parsed prices, 174,251 "
        "zero prices, and 3 unparsed prices."
    ),
]

with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
    file.write("FINAL FINDINGS\n")
    file.write("Comparative Big Data Analytics of Online Food Delivery Platforms\n")
    file.write("=" * 72 + "\n\n")

    file.write("1. KEY DATASET FINDINGS\n\n")
    for title, finding in findings:
        file.write(f"{title}\n")
        file.write(f"{finding}\n\n")

    file.write("2. SOURCE EDA REPORTS\n\n")
    for title, filename in source_reports:
        path = OUTPUT_DIR / filename
        file.write(f"{title}: {filename}\n")
        if path.exists():
            file.write(path.read_text(encoding="utf-8"))
        else:
            file.write("EDA report not found; rerun its analysis script.\n")
        file.write("\n" + "-" * 72 + "\n\n")

    file.write("3. INTERPRETATION AND LIMITATIONS\n\n")
    file.write(
        "These findings are descriptive statistics from separate datasets. "
        "They do not establish that one delivery platform is better than "
        "another. The sources differ in geography, collection period, "
        "observation unit, rating definitions, and price conventions. "
        "Currency and distance units should be verified before comparisons. "
        "The datasets are snapshots, so delivery estimates and fees should "
        "not be treated as current values.\n\n"
    )

    file.write("4. CONCLUSION\n\n")
    file.write(
        "The project demonstrates a workflow for auditing, cleaning, "
        "validating, and exploring large heterogeneous datasets. It combines "
        "distributed processing where appropriate with streaming approaches "
        "for large CSV files. The analysis produces descriptive insights "
        "while documenting data quality issues and comparison limitations. "
        "A fair platform comparison requires harmonized definitions, units, "
        "currency, and geographical coverage.\n"
    )

print("Final findings report created.")
print(f"File: {OUTPUT_FILE}")
