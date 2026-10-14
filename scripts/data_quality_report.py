
import csv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "output"

FILES = [
    "swiggy_cleaned.csv",
    "zomato_cleaned.csv",
    "grubhub_cleaned.csv",
    "restaurants_cleaned.csv",
    "restaurant_menus_cleaned.csv",
]

def inspect_csv(filename):
    path = OUTPUT_DIR / filename

    print("\n" + "=" * 70)
    print(f"DATASET: {filename}")
    print("=" * 70)

    if not path.exists():
        print("File not found. Skipping.")
        return

    with open(path, "r", encoding="utf-8-sig", newline="") as file:
        reader = csv.reader(file)
        headers = next(reader, None)

        if not headers:
            print("Empty file or missing header.")
            return

        missing = {header: 0 for header in headers}
        sample_values = {header: [] for header in headers}
        row_count = 0
        blank_rows = 0

        for row in reader:
            row_count += 1

            if not any(value.strip() for value in row):
                blank_rows += 1
                continue

            # Handle rows with unexpected field counts
            if len(row) < len(headers):
                row += [""] * (len(headers) - len(row))

            for index, header in enumerate(headers):
                value = row[index].strip() if index < len(row) else ""

                if not value:
                    missing[header] += 1

                if value and len(sample_values[header]) < 3:
                    sample_values[header].append(value[:100])

    print(f"Rows: {row_count:,}")
    print(f"Columns: {len(headers)}")
    print(f"Completely blank rows: {blank_rows:,}")

    print("\nMissing / blank values by column:")
    for header in headers:
        print(f"  {header}: {missing[header]:,}")

    print("\nSample values:")
    for header in headers:
        print(f"  {header}: {sample_values[header]}")

if __name__ == "__main__":
    for filename in FILES:
        inspect_csv(filename)

    print("\n\nData quality inspection completed.")
    print("No dataset files were modified.")
