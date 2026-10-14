import sys
import csv

sys.stdout.reconfigure(encoding='utf-8')

def test_counts(filename, name_col, cuisine_col, item_col=''):
    counts = {'biryani': 0, 'pizza': 0, 'burgers': 0, 'indian': 0, 'chinese': 0, 'desserts': 0, 'beverages': 0}
    with open(filename, 'r', encoding='utf-8-sig', errors='ignore') as f:
        reader = csv.DictReader(f)
        for i, r in enumerate(reader):
            t = f"{r.get(name_col, '')} {r.get(cuisine_col, '')} {r.get(item_col, '')}".lower()
            if 'biryani' in t: counts['biryani'] += 1
            if 'pizza' in t: counts['pizza'] += 1
            if 'burger' in t: counts['burgers'] += 1
            if any(k in t for k in ['indian', 'dosa', 'thali', 'paneer', 'roti', 'dal', 'curry', 'biryani']): counts['indian'] += 1
            if any(k in t for k in ['chinese', 'noodle', 'manchurian', 'rice', 'schezwan', 'asian', 'thai', 'momos']): counts['chinese'] += 1
            if any(k in t for k in ['dessert', 'cake', 'waffle', 'ice cream', 'sweet', 'halwa', 'pastry', 'bakery', 'chocolate']): counts['desserts'] += 1
            if any(k in t for k in ['beverage', 'juice', 'shake', 'smoothie', 'tea', 'coffee', 'chai', 'soda', 'drink', 'lassi']): counts['beverages'] += 1
            if i > 5000: break
    print(filename)
    for k, v in counts.items():
        print(f"  {k}: {v}")

test_counts('output/swiggy_analysis_ready.csv', 'Restaurant Name', 'Cuisine')
test_counts('output/zomato_cleaned.csv', 'Restaurant_Name', 'Cuisine', 'Item_Name')
test_counts('output/grubhub_cleaned.csv', 'loc_name', 'cuisines')
test_counts('datasets/Foodpanda Analysis Dataset.csv', 'restaurant_name', 'category', 'dish_name')
