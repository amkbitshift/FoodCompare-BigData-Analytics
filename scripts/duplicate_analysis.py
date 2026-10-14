
from pathlib import Path
from pyspark.sql import SparkSession, functions as F

PROJECT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_DIR / "datasets"
OUTPUT_DIR = PROJECT_DIR / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

FILES = {
    "swiggy_file.csv": "Restaurant Name",
    "enhanced_zomato_dataset_clean.csv": "Restaurant_Name",
    "grubhub.csv": "loc_name",
}

spark = (
    SparkSession.builder
    .appName("FoodDeliveryDuplicateAnalysis")
    .master("local[*]")
    .getOrCreate()
)
spark.sparkContext.setLogLevel("ERROR")

try:
    for filename, name_column in FILES.items():
        path = DATA_DIR / filename

        print("\n" + "=" * 60)
        print(f"FILE: {filename}")

        if not path.exists():
            print("File not found.")
            continue

        df = (
            spark.read
            .option("header", True)
            .option("inferSchema", True)
            .csv(str(path))
        )

        original_count = df.count()
        unique_rows = df.dropDuplicates()
        unique_count = unique_rows.count()

        print(f"Original rows: {original_count:,}")
        print(f"Rows after exact deduplication: {unique_count:,}")
        print(f"Exact duplicate rows: {original_count - unique_count:,}")

        if name_column in df.columns:
            print(f"\nMost frequent values in {name_column}:")

            (
                df.groupBy(name_column)
                .count()
                .orderBy(F.desc("count"))
                .show(10, truncate=40)
            )

            print("\nExample rows for frequent names:")

            frequent_names = (
                df.groupBy(name_column)
                .count()
                .filter(F.col(name_column).isNotNull())
                .orderBy(F.desc("count"))
                .limit(3)
                .select(name_column)
            )

            (
                df.join(frequent_names, on=name_column, how="inner")
                .select(*df.columns[:min(6, len(df.columns))])
                .show(10, truncate=35)
            )

finally:
    spark.stop()
