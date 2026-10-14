
import csv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
INPUT_FILE = BASE_DIR / "output" / "restaurants_cleaned.csv"
OUTPUT_FILE = BASE_DIR / "output" / "restaurants_analysis_ready.csv"

corrected = 0
total = 0

with open(INPUT_FILE, "r", encoding="utf-8-sig", newline="") as source:
    reader = csv.DictReader(source)
    headers = reader.fieldnames

    with open(
        OUTPUT_FILE, "w", encoding="utf-8-sig", newline=""
    ) as destination:
        writer = csv.DictWriter(destination, fieldnames=headers)
        writer.writeheader()

        for row in reader:
            total += 1

            try:
                lat = float(row["lat"].strip())
                lng = float(row["lng"].strip())
            except (ValueError, AttributeError):
                lat = None
                lng = None

            # Treat (0, 0) as invalid for this US restaurant dataset
            if lat == 0.0 and lng == 0.0:
                row["lat"] = ""
                row["lng"] = ""
                corrected += 1

            writer.writerow(row)

print("Coordinate correction completed.")
print(f"Rows processed: {total:,}")
print(f"Invalid coordinate pairs marked missing: {corrected:,}")
print(f"Output file: {OUTPUT_FILE}")
print("Original cleaned dataset was not modified.")
