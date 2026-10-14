
from pathlib import Path
from pyspark.sql import SparkSession, functions as F

PROJECT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_DIR / "datasets"
OUTPUT_DIR = PROJECT_DIR / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

FILES = [
    "swiggy_file.csv",
    "enhanced_zomato_dataset_clean.csv",
    "grubhub.csv",
]

spark = (
    SparkSession.builder
    .appName("FoodDeliveryQualityCheck")
    .master("local[*]")
    .getOrCreate()
)
spark.sparkContext.setLogLevel("ERROR")

try:
    results = []

    for filename in FILES:
        path = DATA_DIR / filename

        print("\n" + "=" * 60)
        print(f"DATASET: {filename}")

        if not path.exists():
            print("FILE NOT FOUND - check the filename.")
            continue

        df = (
            spark.read
            .option("header", True)
            .option("inferSchema", True)
            .csv(str(path))
        )

        total_rows = df.count()
        duplicate_rows = total_rows - df.dropDuplicates().count()

        print(f"Total rows: {total_rows:,}")
        print(f"Exact duplicate rows: {duplicate_rows:,}")
        print(f"Total columns: {len(df.columns)}")

        missing_exprs = [
            F.sum(
                F.when(
                    F.col(f"`{c.replace('`', '``')}`").isNull()
                    | (
                        F.trim(
                            F.col(f"`{c.replace('`', '``')}`")
                            .cast("string")
                        ) == ""
                    ),
                    1
                ).otherwise(0)
            ).alias(f"m{i}")
            for i, c in enumerate(df.columns)
        ]

        missing_values = df.agg(*missing_exprs).first()
        missing_cells = sum(int(v or 0) for v in missing_values)

        print(f"Missing cells: {missing_cells:,}")
        print("\nColumn names:")
        print(df.columns)

        results.append({
            "file_name": filename,
            "total_rows": total_rows,
            "duplicate_rows": duplicate_rows,
            "columns": len(df.columns),
            "missing_cells": missing_cells
        })

    if results:
        import csv

        output_file = OUTPUT_DIR / "dataset_quality_summary.csv"

        with open(
            output_file, "w", newline="", encoding="utf-8"
        ) as f:
            writer = csv.DictWriter(f, fieldnames=results[0].keys())
            writer.writeheader()
            writer.writerows(results)

        print(f"\nQuality report saved to: {output_file}")

finally:
    spark.stop()
