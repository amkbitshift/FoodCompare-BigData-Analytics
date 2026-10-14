
import csv
from pathlib import Path
from collections import Counter

PROJECT_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = PROJECT_DIR / "datasets" / "swiggy_file.csv"

expected_columns = 10
row_widths = Counter()
examples = {}
total_rows = 0

with open(
    DATA_FILE,
    "r",
    encoding="utf-8-sig",
    newline="",
    errors="replace"
) as f:
    reader = csv.reader(f)

    header = next(reader, None)

    print("HEADER:")
    print(header)
    print(f"Expected columns: {len(header or [])}")

    for line_number, row in enumerate(reader, start=2):
        total_rows += 1
        width = len(row)
        row_widths[width] += 1

        if width != expected_columns and width not in examples:
            examples[width] = (line_number, row)

        if total_rows >= 100000:
            break

print(f"\nRows inspected: {total_rows:,}")
print("\nNumber of fields per record:")
for width, count in sorted(row_widths.items()):
    print(f"{width} fields: {count:,} records")

print("\nExamples of unexpected record widths:")
if not examples:
    print("No unexpected widths found in the inspected rows.")
else:
    for width, (line_number, row) in examples.items():
        print(f"\nRecord near line {line_number}: {width} fields")
        print(repr(row))
