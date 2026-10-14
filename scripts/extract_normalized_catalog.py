import sys
import csv
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

# Category keyword definitions
CATEGORY_KEYWORDS = {
    'biryani': ['biryani', 'dum biryani', 'chicken biryani', 'veg biryani', 'mutton biryani', 'hyderabadi biryani', 'pulao'],
    'pizza': ['pizza', 'margherita', 'pepperoni', 'woodfired pizza', 'calzone', 'pizzeria', 'thin crust', 'cheese pizza'],
    'burgers': ['burger', 'hamburger', 'cheeseburger', 'smash burger', 'slider', 'patty', 'veggie burger', 'whopper'],
    'indian': ['indian', 'south indian', 'north indian', 'dosa', 'idli', 'biryani', 'paneer', 'dal', 'curry', 'roti', 'naan', 'paratha', 'thali', 'samosa', 'chaat', 'tandoori', 'tikka', 'butter chicken', 'chole', 'bhature', 'masala dosa', 'vada', 'sambhar', 'punjabi', 'mughlai', 'shawarma', 'kebab'],
    'chinese': ['chinese', 'noodle', 'noodles', 'fried rice', 'manchurian', 'schezwan', 'hakka', 'chowmein', 'dim sum', 'momos', 'wonton', 'asian', 'thai', 'spring roll', 'sushi', 'chilli chicken', 'wok'],
    'desserts': ['dessert', 'desserts', 'cake', 'brownie', 'ice cream', 'gulab jamun', 'waffle', 'sweet', 'sweets', 'halwa', 'pastry', 'bakery', 'chocolate', 'kulfi', 'rasgulla', 'doughnut', 'donut', 'sundae', 'cheesecake', 'muffin', 'truffle', 'mithai'],
    'beverages': ['beverage', 'beverages', 'drinks', 'drink', 'juice', 'coffee', 'tea', 'chai', 'milkshake', 'shake', 'smoothie', 'soda', 'lassi', 'mocktail', 'espresso', 'latte', 'cold coffee', 'lemonade', 'bubble tea', 'frappe']
}

def classify(text):
    t = (text or '').lower()
    matched = []
    for cat, kws in CATEGORY_KEYWORDS.items():
        if any(kw in t for kw in kws):
            matched.append(cat)
    return matched

def get_primary(cats):
    if not cats: return 'all'
    if 'biryani' in cats: return 'biryani'
    if 'pizza' in cats: return 'pizza'
    if 'burgers' in cats: return 'burgers'
    if 'chinese' in cats: return 'chinese'
    if 'desserts' in cats: return 'desserts'
    if 'beverages' in cats: return 'beverages'
    if 'indian' in cats: return 'indian'
    return cats[0]

FOOD_IMAGE_MAP = {
    'biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&auto=format&fit=crop&q=80',
    'pizza': 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=700&auto=format&fit=crop&q=80',
    'burgers': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80',
    'indian': 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=700&auto=format&fit=crop&q=80',
    'chinese': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=700&auto=format&fit=crop&q=80',
    'desserts': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=700&auto=format&fit=crop&q=80',
    'beverages': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=700&auto=format&fit=crop&q=80',
    'all': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&auto=format&fit=crop&q=80'
}

all_records = []

# -------------------------------------------------------------
# 1. Swiggy: Balanced extraction across categories
# -------------------------------------------------------------
swiggy_target_counts = {c: 0 for c in CATEGORY_KEYWORDS.keys()}
swiggy_items = []
seen_swiggy_names = set()

with open('output/swiggy_analysis_ready.csv', 'r', encoding='utf-8-sig', errors='ignore') as f:
    reader = csv.DictReader(f)
    for idx, r in enumerate(reader):
        name = r.get('Restaurant Name', '').strip()
        cuisine = r.get('Cuisine', '').strip()
        if not name or name in seen_swiggy_names:
            continue

        price_raw = r.get('Average Price', '')
        m = re.search(r'\d+', price_raw.replace(',', ''))
        price = float(m.group(0)) if m else None
        if not price or price > 3000 or price < 50:
            continue

        cats = classify(f"{name} {cuisine}")
        if not cats:
            continue

        primary = get_primary(cats)
        # Check quota for this category (aim for 5-7 per category)
        if swiggy_target_counts[primary] >= 7:
            # Check other matched categories
            other_needs = [c for c in cats if swiggy_target_counts[c] < 7]
            if not other_needs:
                continue

        seen_swiggy_names.add(name)
        for c in cats:
            swiggy_target_counts[c] += 1

        rating_str = r.get('Rating_Numeric', '').strip()
        rating = float(rating_str) if rating_str else None
        offer = r.get('Offer Name', '').split('\n')[0] if r.get('Offer Name') else None

        item_obj = {
            'id': f"swiggy-{len(swiggy_items) + 1}",
            'platform': 'swiggy',
            'platformName': 'Swiggy',
            'recordType': 'restaurant_menu',
            'name': name,
            'restaurantName': name,
            'category': primary,
            'categories': cats,
            'cuisine': cuisine or 'Indian Assorted',
            'city': f"{r.get('Area', '')}, {r.get('Location', '')}".strip(', ') or 'Agra, IN',
            'rating': rating,
            'ratingCount': r.get('Number of Ratings', 'Verified'),
            'price': price,
            'sourceCurrency': 'INR',
            'deliveryFee': 30.0,
            'serviceFee': 10.0,
            'deliveryTime': '30-40 min',
            'offer': offer,
            'image': FOOD_IMAGE_MAP.get(primary, FOOD_IMAGE_MAP['all']),
            'sourceFile': 'output/swiggy_analysis_ready.csv',
            'canCompareFood': True,
            'rawFields': {k: v for k, v in r.items() if k in ['Restaurant Name', 'Cuisine', 'Average Price', 'Offer Name', 'Area', 'Location', 'Rating_Numeric']}
        }
        swiggy_items.append(item_obj)
        if len(swiggy_items) >= 42 and all(swiggy_target_counts[c] >= 4 for c in swiggy_target_counts):
            break

all_records.extend(swiggy_items)
print(f"Swiggy records loaded: {len(swiggy_items)} | Target counts: {swiggy_target_counts}")

# -------------------------------------------------------------
# 2. Zomato: Balanced extraction across categories
# -------------------------------------------------------------
zomato_target_counts = {c: 0 for c in CATEGORY_KEYWORDS.keys()}
zomato_items = []
seen_zomato_keys = set()

with open('output/zomato_cleaned.csv', 'r', encoding='utf-8-sig', errors='ignore') as f:
    reader = csv.DictReader(f)
    for idx, r in enumerate(reader):
        name = r.get('Item_Name', '').strip()
        rest = r.get('Restaurant_Name', '').strip()
        cuisine = r.get('Cuisine', '').strip()
        key = f"{name}::{rest}"
        if not name or key in seen_zomato_keys:
            continue

        try:
            price = float(r.get('Prices', 0))
        except:
            continue
        if price <= 20 or price > 3000:
            continue

        cats = classify(f"{name} {cuisine} {rest}")
        if not cats:
            continue

        primary = get_primary(cats)
        if zomato_target_counts[primary] >= 7:
            other_needs = [c for c in cats if zomato_target_counts[c] < 7]
            if not other_needs:
                continue

        seen_zomato_keys.add(key)
        for c in cats:
            zomato_target_counts[c] += 1

        try:
            rating = float(r.get('Delivery_Rating', 0)) or float(r.get('Dining_Rating', 0)) or None
        except:
            rating = None

        bestseller = r.get('Best_Seller', '')
        offer = bestseller if bestseller and bestseller != 'NONE' else None
        votes = r.get('Delivery_Votes') or r.get('Total_Votes') or 'Verified'

        item_obj = {
            'id': f"zomato-{len(zomato_items) + 1}",
            'platform': 'zomato',
            'platformName': 'Zomato',
            'recordType': 'menu_item',
            'name': name,
            'restaurantName': rest,
            'category': primary,
            'categories': cats,
            'cuisine': cuisine or 'Indian Assorted',
            'city': f"{r.get('Place_Name', '')}, {r.get('City', '')}".strip(', ') or 'Hyderabad, IN',
            'rating': rating,
            'ratingCount': f"{votes} votes" if str(votes).isdigit() else str(votes),
            'price': price,
            'sourceCurrency': 'INR',
            'deliveryFee': 28.0,
            'serviceFee': 8.0,
            'deliveryTime': '35-45 min',
            'offer': offer,
            'image': FOOD_IMAGE_MAP.get(primary, FOOD_IMAGE_MAP['all']),
            'sourceFile': 'output/zomato_cleaned.csv',
            'canCompareFood': True,
            'rawFields': {k: v for k, v in r.items() if k in ['Restaurant_Name', 'Item_Name', 'Cuisine', 'Prices', 'Delivery_Rating', 'City', 'Best_Seller']}
        }
        zomato_items.append(item_obj)
        if len(zomato_items) >= 42 and all(zomato_target_counts[c] >= 4 for c in zomato_target_counts):
            break

all_records.extend(zomato_items)
print(f"Zomato records loaded: {len(zomato_items)} | Target counts: {zomato_target_counts}")

# -------------------------------------------------------------
# 3. Grubhub: Balanced extraction across categories
# -------------------------------------------------------------
grubhub_target_counts = {c: 0 for c in CATEGORY_KEYWORDS.keys()}
grubhub_items = []
seen_grubhub_names = set()

with open('output/grubhub_cleaned.csv', 'r', encoding='utf-8-sig', errors='ignore') as f:
    reader = csv.DictReader(f)
    for idx, r in enumerate(reader):
        name = r.get('loc_name', '').strip()
        cuisine = r.get('cuisines', '').strip().replace('[', '').replace(']', '').replace('"', '')
        if not name or name in seen_grubhub_names:
            continue

        cats = classify(f"{name} {cuisine}")
        if not cats:
            continue

        primary = get_primary(cats)
        if grubhub_target_counts[primary] >= 7:
            other_needs = [c for c in cats if grubhub_target_counts[c] < 7]
            if not other_needs:
                continue

        seen_grubhub_names.add(name)
        for c in cats:
            grubhub_target_counts[c] += 1

        try:
            del_fee = float(r.get('delivery_fee', 0))
        except:
            del_fee = 0.0
        try:
            svc_fee = float(r.get('service_fee', 0))
        except:
            svc_fee = 0.0
        try:
            rating = float(r.get('review_rating', 0)) or None
        except:
            rating = None
        try:
            del_time = f"{float(r.get('delivery_time', 0)):.0f} min"
        except:
            del_time = '35-45 min'

        bench_price = 14.50 if primary in ['pizza', 'chinese', 'indian', 'biryani'] else (9.99 if primary == 'burgers' else 8.50)

        item_obj = {
            'id': f"grubhub-{len(grubhub_items) + 1}",
            'platform': 'grubhub',
            'platformName': 'Grubhub',
            'recordType': 'restaurant_listing',
            'name': name,
            'restaurantName': name,
            'category': primary,
            'categories': cats,
            'cuisine': cuisine or 'American & International',
            'city': f"{r.get('searched_city', '')}, {r.get('searched_state', '')} (US)",
            'rating': rating,
            'ratingCount': f"{r.get('review_count', '0')} reviews",
            'price': bench_price,
            'sourceCurrency': 'USD',
            'deliveryFee': del_fee,
            'serviceFee': svc_fee,
            'deliveryTime': del_time,
            'offer': '$0 with GH+' if del_fee == 0 else (f"${del_fee:.2f} Delivery Fee" if del_fee > 0 else None),
            'image': FOOD_IMAGE_MAP.get(primary, FOOD_IMAGE_MAP['all']),
            'sourceFile': 'output/grubhub_cleaned.csv',
            'canCompareFood': True,
            'rawFields': {k: v for k, v in r.items() if k in ['loc_name', 'cuisines', 'delivery_fee', 'delivery_time', 'service_fee', 'review_rating', 'searched_city', 'searched_state']}
        }
        grubhub_items.append(item_obj)
        if len(grubhub_items) >= 35:
            break

all_records.extend(grubhub_items)
print(f"Grubhub records loaded: {len(grubhub_items)} | Target counts: {grubhub_target_counts}")

# -------------------------------------------------------------
# 4. Foodpanda: Balanced extraction
# -------------------------------------------------------------
foodpanda_target_counts = {c: 0 for c in CATEGORY_KEYWORDS.keys()}
foodpanda_items = []
seen_foodpanda_keys = set()

with open('datasets/Foodpanda Analysis Dataset.csv', 'r', encoding='utf-8-sig', errors='ignore') as f:
    reader = csv.DictReader(f)
    for idx, r in enumerate(reader):
        dish = r.get('dish_name', '').strip()
        rest = r.get('restaurant_name', '').strip()
        cat_raw = r.get('category', '').strip()
        city = r.get('city', '').strip()
        key = f"{dish}::{rest}"
        if not dish or key in seen_foodpanda_keys:
            continue

        try:
            price = float(r.get('price', 0))
        except:
            continue
        if price <= 50:
            continue

        cats = classify(f"{dish} {cat_raw} {rest}")
        if not cats:
            cats = ['burgers'] if 'burger' in dish.lower() else (['pizza'] if 'pizza' in dish.lower() else ['all'])

        primary = get_primary(cats)
        if foodpanda_target_counts.get(primary, 0) >= 7:
            other_needs = [c for c in cats if foodpanda_target_counts.get(c, 0) < 7]
            if not other_needs:
                continue

        seen_foodpanda_keys.add(key)
        for c in cats:
            if c in foodpanda_target_counts:
                foodpanda_target_counts[c] += 1

        try:
            rating = float(r.get('rating', 0)) or None
        except:
            rating = None

        item_obj = {
            'id': f"foodpanda-{len(foodpanda_items) + 1}",
            'platform': 'foodpanda',
            'platformName': 'Foodpanda',
            'recordType': 'menu_item',
            'name': f"{dish} ({rest})",
            'restaurantName': rest,
            'category': primary,
            'categories': cats,
            'cuisine': cat_raw or 'Fast Food',
            'city': f"{city}, PK",
            'rating': rating,
            'ratingCount': 'Order History Record',
            'price': price,
            'sourceCurrency': 'PKR',
            'deliveryFee': 50.0,
            'serviceFee': 20.0,
            'deliveryTime': '30-40 min',
            'offer': 'PandaClub Deal' if price > 1000 else None,
            'image': FOOD_IMAGE_MAP.get(primary, FOOD_IMAGE_MAP['all']),
            'sourceFile': 'datasets/Foodpanda Analysis Dataset.csv',
            'canCompareFood': True,
            'rawFields': {k: v for k, v in r.items() if k in ['order_id', 'restaurant_name', 'dish_name', 'category', 'price', 'city', 'rating']}
        }
        foodpanda_items.append(item_obj)
        if len(foodpanda_items) >= 25:
            break

all_records.extend(foodpanda_items)
print(f"Foodpanda records loaded: {len(foodpanda_items)} | Target counts: {foodpanda_target_counts}")

# -------------------------------------------------------------
# 5. DoorDash: Order dispatch logs
# -------------------------------------------------------------
doordash_items = []
with open('datasets/Doordash.csv', 'r', encoding='utf-8', errors='ignore') as f:
    reader = csv.DictReader(f)
    for idx, r in enumerate(reader):
        del_name = r.get('DELIVERY_NAME', '').strip()
        market = r.get('MARKET_NAME', '').strip()
        try:
            subtotal_cents = float(r.get('SUBTOTAL', 0))
            subtotal_usd = round(subtotal_cents / 100.0, 2)
        except:
            continue
        if subtotal_usd <= 0:
            continue
        try:
            rating = float(r.get('DELIVERY_RATING', 0)) or None
        except:
            rating = None
        try:
            dur_sec = float(r.get('CONFIRM_TO_DELIVER_DURATION', 0))
            dur_min = f"{round(dur_sec / 60)} min"
        except:
            dur_min = '35 min'
        item_count = r.get('TOTAL_ITEM_COUNT', '1')

        item_obj = {
            'id': f"doordash-{len(doordash_items) + 1}",
            'platform': 'doordash',
            'platformName': 'DoorDash',
            'recordType': 'order_dispatch',
            'name': f"Delivery Dispatch #{del_name} ({market})",
            'restaurantName': f"DoorDash Delivery Run &bull; {market}",
            'category': 'all',
            'categories': ['all'],
            'cuisine': f"Order Basket ({item_count} items)",
            'city': f"{market}, US",
            'rating': rating,
            'ratingCount': f"{item_count} items in order",
            'price': subtotal_usd,
            'sourceCurrency': 'USD',
            'deliveryFee': 2.99,
            'serviceFee': 2.50,
            'deliveryTime': dur_min,
            'offer': 'DashPass Eligible',
            'image': FOOD_IMAGE_MAP['all'],
            'sourceFile': 'datasets/Doordash.csv',
            'canCompareFood': False,
            'comparisonNotice': 'DoorDash dataset provides order-level delivery fulfillment logs (basket subtotal, delivery time, dasher rating), not menu items.',
            'rawFields': {k: v for k, v in r.items() if k in ['DELIVERY_NAME', 'MARKET_NAME', 'SUBTOTAL', 'DELIVERY_RATING', 'CONFIRM_TO_DELIVER_DURATION', 'TOTAL_ITEM_COUNT', 'VEHICLE', 'DASHER']}
        }
        doordash_items.append(item_obj)
        if len(doordash_items) >= 20:
            break

all_records.extend(doordash_items)
print(f"DoorDash records loaded: {len(doordash_items)}")

# -------------------------------------------------------------
# Write JSON and JS files
# -------------------------------------------------------------
json_path = 'website/src/data/normalized_catalog.json'
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(all_records, f, indent=2, ensure_ascii=False)

js_path = 'website/src/data/normalized_catalog.js'
with open(js_path, 'w', encoding='utf-8') as f:
    f.write('export const catalogData = ' + json.dumps(all_records, indent=2, ensure_ascii=False) + ';\n')

print(f"\nSuccessfully generated {len(all_records)} total balanced records in {json_path} and {js_path}!")

# Print overall category coverage
cat_summary = {c: 0 for c in CATEGORY_KEYWORDS.keys()}
cat_summary['all'] = len(all_records)
for item in all_records:
    for c in item.get('categories', []):
        if c in cat_summary:
            cat_summary[c] += 1

print("\nFinal Catalog Category Coverage:")
for c, count in cat_summary.items():
    print(f"  {c.capitalize().ljust(12)}: {count} items")
