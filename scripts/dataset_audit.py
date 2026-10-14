
import csv
from pathlib import Path
from pyspark.sql import SparkSession, functions as F

# Project folders
PROJECT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_DIR / "datasets"
OUTPUT_DIR = PROJECT_DIR / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

# Start Spark
spark = (
    SparkSession.builder
    .appName("FoodDeliveryDatasetAudit")
    .master("local[*]")
    .getOrCreate()
)

spark.sparkContext.setLogLevel("ERROR")

results = []

try:
    csv_files = sorted(DATA_DIR.glob("*.csv"))

    if not csv_files:
        print(f"No CSV files found in: {DATA_DIR}")
    else:
        for file in csv_files:
            print(f"\nInspecting: {file.name}")

            try:
                df = (
                    spark.read
                    .option("header", True)
                    .option("inferSchema", True)
                    .option("mode", "PERMISSIVE")
                    .csv(str(file))
                )

                row_count = df.count()
                column_count = len(df.columns)

                # Count missing cells
                missing = df.agg(*[
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
                ]).first()

                missing_count = sum(
                    int(value or 0) for value in missing
                )

                print(f"Rows: {row_count:,}")
                print(f"Columns: {column_count}")
                print("Column names:")
                print(df.columns)
                print(f"Missing cells: {missing_count:,}")

                df.printSchema()

                results.append({
                    "file_name": file.name,
                    "rows": row_count,
                    "columns": column_count,
                    "missing_cells": missing_count,
                    "status": "success"
                })

            except Exception as exc:
                print(f"Could not inspect {file.name}: {exc}")

                results.append({
                    "file_name": file.name,
                    "rows": None,
                    "columns": None,
                    "missing_cells": None,
                    "status": "error"
                })

    # Save the report using Python, not Spark's CSV writer
    if results:
        report_path = OUTPUT_DIR / "dataset_audit_summary.csv"

        with open(
            report_path,
            "w",
            newline="",
            encoding="utf-8"
        ) as f:
            writer = csv.DictWriter(
                f,
                fieldnames=[
                    "file_name",
                    "rows",
                    "columns",
                    "missing_cells",
                    "status"
                ]
            )
            writer.writeheader()
            writer.writerows(results)

        print(f"\nAudit report saved to: {report_path}")

finally:
    spark.stop()
