
import csv
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = PROJECT_DIR / "datasets" / "swiggy_file.csv"

with open(
    DATA_FILE,
    "r",
    encoding="utf-8-sig",
    newline="",
    errors="replace"
) as f:
    reader = csv.DictReader(f)

    print("First 10 records:")
    for i, row in enumerate(reader):
        print(
            f"{i + 1}. Restaurant: {row.get('Restaurant Name')!r} | "
            f"Cuisine: {row.get('Cuisine')!r} | "
            f"Area: {row.get('Area')!r} | "
            f"Location: {row.get('Location')!r}"
        )

        if i == 9:
            break
