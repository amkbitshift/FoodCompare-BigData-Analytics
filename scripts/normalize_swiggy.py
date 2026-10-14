
import csv
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
INPUT_FILE = BASE_DIR / "output" / "swiggy_cleaned.csv"
OUTPUT_FILE = BASE_DIR / "output" / "swiggy_analysis_ready.csv"

def parse_rating(value):
    value = (value or "").strip()

    if value in ("", "--", "NEW"):
        return ""

    try:
        number = float(value)
        if 0 <= number <= 5:
            return number
    except ValueError:
        pass

    return ""

def parse_rating_count(value):
    value = (value or "").strip()

    if not value or value == "Too Few Ratings":
        return "", ""

    # Exact count, for example "3 ratings"
    exact = re.fullmatch(r"(\d[\d,]*)\s+ratings?", value, re.I)
    if exact:
        return int(exact.group(1).replace(",", "")), "exact"

    # Lower bound, for example "20+ ratings" or "1K+ ratings"
    lower = re.fullmatch(
        r"([\d,.]+)\s*([KkMm]?)\+\s*ratings?",
        value,
        re.I
    )
    if lower:
        number = float(lower.group(1).replace(",", ""))
        suffix = lower.group(2).upper()

        multiplier = {"": 1, "K": 1000, "M": 1000000}[suffix]
        return int(number * multiplier), "lower_bound"

    return "", "unparsed"

with open(INPUT_FILE, "r", encoding="utf-8-sig", newline="") as source:
    reader = csv.DictReader(source)
    original_headers = reader.fieldnames

    new_headers = original_headers + [
        "Rating_Numeric",
        "Rating_Is_New",
        "Rating_Count_Minimum",
        "Rating_Count_Type",
        "Rating_Count_Unavailable",
    ]

    with open(
        OUTPUT_FILE, "w", encoding="utf-8-sig", newline=""
    ) as destination:
        writer = csv.DictWriter(destination, fieldnames=new_headers)
        writer.writeheader()

        total = 0

        for row in reader:
            rating = (row.get("Rating") or "").strip()
            count_text = (row.get("Number of Ratings") or "").strip()

            numeric_rating = parse_rating(rating)
            count_minimum, count_type = parse_rating_count(count_text)

            row["Rating_Numeric"] = numeric_rating
            row["Rating_Is_New"] = 1 if rating.upper() == "NEW" else 0
            row["Rating_Count_Minimum"] = count_minimum
            row["Rating_Count_Type"] = count_type
            row["Rating_Count_Unavailable"] = (
                1 if count_type == "" and count_minimum == "" else 0
            )

            writer.writerow(row)
            total += 1

print("Swiggy normalization completed.")
print(f"Rows processed: {total:,}")
print(f"Output: {OUTPUT_FILE}")
print("Original cleaned dataset was not modified.")
