
import csv
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_DIR / "datasets"
OUTPUT_DIR = PROJECT_DIR / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

report_path = OUTPUT_DIR / "dataset_overview.txt"

with open(report_path, "w", encoding="utf-8") as report:
    csv_files = sorted(DATA_DIR.glob("*.csv"))

    if not csv_files:
        report.write(f"No CSV files found in {DATA_DIR}\n")

    for file in csv_files:
        report.write("\n" + "=" * 80 + "\n")
        report.write(f"FILE: {file.name}\n")
        report.write("=" * 80 + "\n")

        try:
            with open(
                file, "r", encoding="utf-8-sig",
                newline="", errors="replace"
            ) as f:
                reader = csv.reader(f)

                header = next(reader, None)
                report.write(f"\nCOLUMNS ({len(header or [])}):\n")
                report.write(", ".join(header or []) + "\n")

                report.write("\nFIRST 3 DATA ROWS:\n")
                for i, row in enumerate(reader):
                    report.write(repr(row) + "\n")
                    if i == 2:
                        break

            report.write("\nStatus: sample read completed\n")

        except Exception as exc:
            report.write(f"\nCould not read sample: {exc}\n")

print(f"Dataset overview saved to: {report_path}")
