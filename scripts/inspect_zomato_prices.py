
import csv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
FILE = BASE_DIR / "output" / "zomato_cleaned.csv"

checked = 0
zero_vote_rows = 0
positive_vote_rows = 0
zero_vote_price_mismatches = 0
positive_vote_mismatches = 0

with open(FILE, "r", encoding="utf-8-sig", newline="") as file:
    reader = csv.DictReader(file)

    for row in reader:
        price = float(row["Prices"])
        votes = int(float(row["Votes"]))
        price_per_vote = float(row["Price_per_Vote"])

        if votes == 0:
            zero_vote_rows += 1

            # Check whether the feature falls back to the full price
            if abs(price_per_vote - price) > 0.0001:
                zero_vote_price_mismatches += 1
        else:
            positive_vote_rows += 1

            # Candidate formula to test; not assumed to be correct
            expected = price / (votes + 1)
            if abs(price_per_vote - expected) > 0.0001:
                positive_vote_mismatches += 1

        if checked < 10:
            print({
                "item": row["Item_Name"],
                "price": price,
                "votes": votes,
                "price_per_vote": price_per_vote,
            })
            checked += 1

print("\nPRICE-PER-VOTE DIAGNOSTICS")
print(f"Rows with zero votes: {zero_vote_rows:,}")
print(f"Rows with positive votes: {positive_vote_rows:,}")
print(f"Zero-vote rows not equal to price: {zero_vote_price_mismatches:,}")
print(f"Positive-vote rows not matching price/(votes+1): {positive_vote_mismatches:,}")
print("\nDiagnostic only; no files were modified.")
