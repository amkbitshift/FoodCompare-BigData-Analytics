import csv
from pathlib import Path

from pyspark.sql import SparkSession, functions as F

# --------------------------------------------------
# 1. Project paths
# --------------------------------------------------

PROJECT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_DIR / "datasets"
OUTPUT_DIR = PROJECT_DIR / "output"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

INPUT_FILE = DATA_DIR / "swiggy_file.csv"
OUTPUT_FILE = OUTPUT_DIR / "swiggy_cleaned.csv"


# --------------------------------------------------
# 2. Start Spark
# --------------------------------------------------

spark = (
    SparkSession.builder
    .appName("CleanSwiggyDataset")
    .master("local[*]")
    .getOrCreate()
)

spark.sparkContext.setLogLevel("ERROR")

try:
    # --------------------------------------------------
    # 3. Read CSV correctly
    # --------------------------------------------------

    print("Reading Swiggy dataset...")

    df = (
        spark.read
        .option("header", True)
        .option("inferSchema", True)
        .option("multiLine", True)
        .option("quote", '"')
        .option("escape", '"')
        .option("encoding", "UTF-8")
        .csv(str(INPUT_FILE))
    )

    original_rows = df.count()

    print(f"Original rows: {original_rows:,}")
    print(f"Number of columns: {len(df.columns)}")

    # --------------------------------------------------
    # 4. Trim spaces in text columns
    # --------------------------------------------------

    print("Trimming surrounding spaces...")

    for column, data_type in df.dtypes:
        if data_type == "string":
            safe_column = F.col(
                f"`{column.replace('`', '``')}`"
            )
            df = df.withColumn(
                column,
                F.trim(safe_column)
            )

    # --------------------------------------------------
    # 5. Remove exact duplicate rows
    # --------------------------------------------------

    print("Removing exact duplicate rows...")

    cleaned = df.dropDuplicates()

    cleaned_rows = cleaned.count()
    removed_rows = original_rows - cleaned_rows

    print(f"Original rows: {original_rows:,}")
    print(f"Rows after deduplication: {cleaned_rows:,}")
    print(f"Exact duplicate rows removed: {removed_rows:,}")

    # --------------------------------------------------
    # 6. Save cleaned CSV using Python
    # --------------------------------------------------

    print("Saving cleaned dataset...")

    columns = cleaned.columns

    with open(
        OUTPUT_FILE,
        "w",
        newline="",
        encoding="utf-8-sig"
    ) as file:
        writer = csv.writer(file)
        writer.writerow(columns)

        for row in cleaned.toLocalIterator():
            writer.writerow(row)

    print("\nCleaning completed successfully!")
    print(f"Output file: {OUTPUT_FILE}")
    print("Original dataset was not modified.")

finally:
    spark.stop()