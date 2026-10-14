
import csv
import sqlite3
from pathlib import Path

# Project folders
BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_FILE = BASE_DIR / "datasets" / "restaurant-menus.csv"
OUTPUT_DIR = BASE_DIR / "output"
OUTPUT_FILE = OUTPUT_DIR / "restaurant_menus_cleaned.csv"
DATABASE_FILE = OUTPUT_DIR / "restaurant_menus_temp.sqlite"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

BATCH_SIZE = 5000

print("Restaurant menus cleaning started.")
print(f"Input: {DATASET_FILE}")

if not DATASET_FILE.exists():
    raise FileNotFoundError(f"Dataset not found: {DATASET_FILE}")

# Remove temporary database from an earlier run, if present
if DATABASE_FILE.exists():
    DATABASE_FILE.unlink()

connection = sqlite3.connect(DATABASE_FILE)
cursor = connection.cursor()

try:
    # Store complete rows as JSON-like tuples for exact deduplication.
    cursor.execute("""
        CREATE TABLE menu_rows (
            row_data TEXT PRIMARY KEY
        )
    """)

    insert_sql = "INSERT OR IGNORE INTO menu_rows (row_data) VALUES (?)"

    original_rows = 0
    unique_rows = 0
    batch = []

    print("Reading CSV, trimming spaces, and removing exact duplicates...")
    with open(
        DATASET_FILE,
        "r",
        newline="",
        encoding="utf-8-sig"
    ) as source:
        reader = csv.reader(source)
        headers = next(reader)

        for row in reader:
            original_rows += 1

            # Trim leading and trailing spaces from every field
            row = [value.strip() for value in row]

            # Encode the row unambiguously for SQLite's unique key
            row_key = repr(tuple(row))
            batch.append((row_key,))

            if len(batch) >= BATCH_SIZE:
                before = connection.total_changes
                cursor.executemany(insert_sql, batch)
                unique_rows += connection.total_changes - before
                connection.commit()
                batch.clear()

                if original_rows % 250000 == 0:
                    print(f"Processed {original_rows:,} rows...")

        if batch:
            before = connection.total_changes
            cursor.executemany(insert_sql, batch)
            unique_rows += connection.total_changes - before
            connection.commit()
            batch.clear()

    print(f"Original rows: {original_rows:,}")
    print(f"Unique rows after cleaning: {unique_rows:,}")
    print(f"Exact duplicates removed: {original_rows - unique_rows:,}")

    print("Exporting cleaned CSV...")

    # Write header, then convert each stored row back to CSV fields.
    with open(
        OUTPUT_FILE,
        "w",
        newline="",
        encoding="utf-8-sig"
    ) as destination:
        writer = csv.writer(destination)
        writer.writerow(headers)

        cursor.execute("SELECT row_data FROM menu_rows")
        exported = 0

        while True:
            records = cursor.fetchmany(BATCH_SIZE)
            if not records:
                break

            output_batch = [
                list(eval(record[0]))
                for record in records
            ]
            writer.writerows(output_batch)
            exported += len(output_batch)

            if exported % 250000 == 0:
                print(f"Exported {exported:,} rows...")

    print("\nCleaning completed successfully!")
    print(f"Cleaned file: {OUTPUT_FILE}")
    print("Original dataset was not modified.")

finally:
    connection.close()

    # Remove the temporary database after successful or failed processing.
    # If an error occurs, the next run rebuilds it from the original CSV.
    if DATABASE_FILE.exists():
        DATABASE_FILE.unlink()
