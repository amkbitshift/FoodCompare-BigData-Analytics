
import csv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
FILE = BASE_DIR / "output" / "restaurants_cleaned.csv"

zero_lat = 0
zero_lng = 0
both_zero = 0
examples = []

with open(FILE, "r", encoding="utf-8-sig", newline="") as file:
    reader = csv.DictReader(file)

    for row in reader:
        lat = float(row["lat"])
        lng = float(row["lng"])

        if lat == 0:
            zero_lat += 1

        if lng == 0:
            zero_lng += 1

        if lat == 0 and lng == 0:
            both_zero += 1

        if (lat == 0 or lng == 0) and len(examples) < 10:
            examples.append({
                "id": row["id"],
                "name": row["name"],
                "address": row["full_address"],
                "lat": lat,
                "lng": lng,
            })

print("COORDINATE INSPECTION")
print("-" * 45)
print(f"Rows with latitude = 0: {zero_lat:,}")
print(f"Rows with longitude = 0: {zero_lng:,}")
print(f"Rows with both coordinates = 0: {both_zero:,}")
print("\nExample records:")
for item in examples:
    print(item)

print("\nInspection completed. No files were modified.")

