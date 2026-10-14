/**
 * Reusable Food Image Resolver & Organized Photo Library
 * FoodCompare Platform
 * 
 * Selects appropriate, varied, royalty-free food photographs based on:
 * 1. Specific dish name (e.g., Momos vs Noodles vs Fried Rice vs Shawarma)
 * 2. Food category (e.g., Biryani, Pizza, Burgers, Desserts, Beverages)
 * 3. Cuisine / venue type (e.g., Restaurant Listings, Order Dispatches)
 * 
 * Uses deterministic selection (hash of item ID/name) to ensure the same record
 * always displays the exact same image, while different items in the same category
 * receive genuinely varied photographs.
 */

// Stable Unsplash Food Photos Library
export const IMAGE_POOLS = {
  // 1. Biryani
  biryani: [
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&auto=format&fit=crop&q=80', // Hyderabadi Dum Biryani
    'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=700&auto=format&fit=crop&q=80', // Handi Claypot Biryani
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=700&auto=format&fit=crop&q=80'  // Spiced Chicken Biryani
  ],

  // 2. Pizza
  pizza_margherita: [
    'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=700&auto=format&fit=crop&q=80', // Fresh Margherita Pizza
    'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=700&auto=format&fit=crop&q=80'  // Woodfired Cheese Pizza
  ],
  pizza_general: [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&auto=format&fit=crop&q=80', // Loaded Pizza Slice
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&auto=format&fit=crop&q=80'  // Rustic Stonebake Pizza
  ],

  // 3. Burgers
  burgers: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80', // Classic Cheeseburger
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=700&auto=format&fit=crop&q=80', // Double Patty Burger with Fries
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=700&auto=format&fit=crop&q=80'  // Gourmet Brioche Burger
  ],

  // 4. Indian Dish-Specific
  indian_south: [
    'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=700&auto=format&fit=crop&q=80', // Crispy Masala Dosa
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=700&auto=format&fit=crop&q=80'  // South Indian Idli & Vada
  ],
  indian_curry: [
    'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=700&auto=format&fit=crop&q=80', // Paneer Butter Masala
    'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=700&auto=format&fit=crop&q=80'  // Grand Indian Thali & Dal
  ],
  indian_shawarma: [
    'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=700&auto=format&fit=crop&q=80'  // Grilled Chicken Shawarma Wrap
  ],

  // 5. Chinese Dish-Specific (NOODLES, MOMOS, RICE, MANCHURIAN)
  chinese_momos: [
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=700&auto=format&fit=crop&q=80', // Steamed Momos & Dumplings
    'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=700&auto=format&fit=crop&q=80'  // Bamboo Steamer Dim Sum
  ],
  chinese_rice: [
    'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=700&auto=format&fit=crop&q=80'  // Wok Egg & Veg Fried Rice
  ],
  chinese_noodles: [
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&auto=format&fit=crop&q=80', // Authentic Asian Noodles Bowl
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=700&auto=format&fit=crop&q=80'  // Schezwan Hakka Noodles
  ],
  chinese_manchurian: [
    'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=700&auto=format&fit=crop&q=80'  // Asian Chilli Wok Stir-fry
  ],

  // 6. Desserts Dish-Specific
  dessert_cake: [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&auto=format&fit=crop&q=80'  // Chocolate Truffle Cake
  ],
  dessert_brownie: [
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700&auto=format&fit=crop&q=80'  // Fudgy Chocolate Brownie
  ],
  dessert_waffle: [
    'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=700&auto=format&fit=crop&q=80'  // Belgian Chocolate Waffle
  ],
  dessert_icecream: [
    'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=700&auto=format&fit=crop&q=80', // Artisanal Ice Cream Scoops
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=700&auto=format&fit=crop&q=80'  // Assorted Confectionery Sweets
  ],

  // 7. Beverages Dish-Specific
  beverage_coffee: [
    'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=700&auto=format&fit=crop&q=80'  // Iced Cold Coffee & Frappe
  ],
  beverage_tea: [
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=700&auto=format&fit=crop&q=80'  // Traditional Masala Chai / Tea
  ],
  beverage_juice: [
    'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=700&auto=format&fit=crop&q=80'  // Fresh Squeezed Citrus Juice
  ],
  beverage_smoothie: [
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=700&auto=format&fit=crop&q=80'  // Berry Fruit Smoothie Bowl
  ],
  beverage_shake: [
    'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700&auto=format&fit=crop&q=80'  // Thick Milkshake with Toppings
  ],

  // 8. Restaurant Venues & Dining Listings (Grubhub / Listing sources)
  restaurant_venues: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&auto=format&fit=crop&q=80', // Modern Restaurant Dining
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80'  // Italian Bistro & Kitchen
  ],

  // 9. Order Fulfillment & Courier Dispatches (DoorDash)
  order_dispatch: [
    'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=700&auto=format&fit=crop&q=80'  // Packaged Food Delivery Dispatch
  ]
};

// Branded Neutral SVG Placeholder for safe fallback
export const BRANDED_FALLBACK_SVG = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='450' viewBox='0 0 700 450' fill='%23F8FAF5'%3E%3Crect width='100%25' height='100%25' fill='%23FAF8F5'/%3E%3Crect x='100' y='60' width='500' height='330' rx='16' fill='%23F3EFEA' stroke='%23E7E2DA' stroke-width='2'/%3E%3Ccircle cx='350' cy='190' r='48' fill='%23FFE4E6'/%3E%3Cpath d='M338 178c0-8 6-14 14-14s14 6 14 14v28h-28v-28z' fill='%23E23744'/%3E%3Ccircle cx='350' cy='225' r='5' fill='%23E23744'/%3E%3Ctext x='350' y='275' font-family='sans-serif' font-size='16' font-weight='700' fill='%231C1917' text-anchor='middle'%3EFoodCompare%3C/text%3E%3Ctext x='350' y='298' font-family='sans-serif' font-size='12' fill='%2378716C' text-anchor='middle'%3EAuthentic Food Dataset Record%3C/text%3E%3C/svg%3E";

/**
 * Deterministic string hash function
 */
function hashString(str) {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Pick deterministically from an image array
 */
function pickDeterministic(arr, key) {
  if (!arr || arr.length === 0) return BRANDED_FALLBACK_SVG;
  const idx = hashString(key) % arr.length;
  return arr[idx];
}

// Word-boundary regex patterns for accurate dish identification
const SOUTH_INDIAN_DISH_REGEX = /\b(dosa|idli|idly|vada|vadas|medu vada|sambar vada|uttapam|appam|puttu|pongal|bisi bele)\b/i;
const BIRYANI_DISH_REGEX = /\b(biryani|pulao|pulav)\b/i;
const PIZZA_DISH_REGEX = /\b(pizza|calzone|pizzeria)\b/i;
const BURGER_DISH_REGEX = /\b(burger|cheeseburger|hamburger|slider|sliders|patty|patties|whopper)\b/i;
const MOMOS_DISH_REGEX = /\b(momo|momos|dumpling|dumplings|dim sum|wonton|wontons)\b/i;
const NOODLES_DISH_REGEX = /\b(noodle|noodles|chowmein|hakka|ramen|thukpa)\b/i;
const FRIED_RICE_DISH_REGEX = /\b(fried rice|wok rice)\b/i;
const MANCHURIAN_DISH_REGEX = /\b(manchurian|chilli chicken|chilli paneer|schezwan)\b/i;
const SHAWARMA_DISH_REGEX = /\b(shawarma|kebab|kebabs|kabab|kababs|frankie|wrap)\b/i;
const CURRY_DISH_REGEX = /\b(curry|curries|dal|daal|thali|roti|naan|paneer|butter chicken|chole|rajma|bhature|paratha)\b/i;
const WAFFLE_DISH_REGEX = /\b(waffle|waffles)\b/i;
const BROWNIE_DISH_REGEX = /\b(brownie|brownies)\b/i;
const CAKE_DISH_REGEX = /\b(cake|cakes|pastry|pastries|muffin|muffins|truffle)\b/i;
const ICECREAM_DISH_REGEX = /\b(ice cream|sundae|kulfi|sweet|sweets|halwa|gulab jamun|rasgulla|dessert)\b/i;
const COFFEE_DISH_REGEX = /\b(coffee|latte|espresso|cappuccino|frappe|cold coffee)\b/i;
const TEA_DISH_REGEX = /\b(tea|chai)\b/i;
const JUICE_DISH_REGEX = /\b(juice|lemonade|cooler|mojito)\b/i;
const SMOOTHIE_DISH_REGEX = /\b(smoothie|smoothies|acai)\b/i;
const SHAKE_DISH_REGEX = /\b(shake|shakes|milkshake|milkshakes)\b/i;

/**
 * Resolves an appropriate, high-resolution food image based on record attributes.
 * Follows a strict 4-tier priority order:
 * 1. A verified image explicitly associated with the actual dish or menu item.
 * 2. An existing local image whose content matches the dish category.
 * 3. A category-specific fallback image that accurately represents the food.
 * 4. If no suitable image exists, show a neutral FoodCompare placeholder.
 * 
 * Rules:
 * - South Indian dishes (idli, dosa, vada, appam, puttu) always map to South Indian photography.
 * - Listings in the biryani category always map to authentic biryani photography.
 * - When a listing has multiple cuisines, the image matches the displayed dish rather than an unrelated cuisine tag.
 * - Restaurant names do NOT dictate the photograph.
 * 
 * @param {Object} item - Food or restaurant item record
 * @returns {string} Image URL
 */
export function resolveFoodImage(item) {
  if (!item) return BRANDED_FALLBACK_SVG;

  // ----------------------------------------------------------------
  // Priority 1: Verified image explicitly associated with actual dish
  // ----------------------------------------------------------------
  if (item.verifiedImage && typeof item.verifiedImage === 'string' && item.verifiedImage.trim()) {
    return item.verifiedImage.trim();
  }
  if (item.verifiedDishImage && typeof item.verifiedDishImage === 'string' && item.verifiedDishImage.trim()) {
    return item.verifiedDishImage.trim();
  }

  // ----------------------------------------------------------------
  // Priority 2: Existing local image whose content matches dish category
  // ----------------------------------------------------------------
  if (item.localImage && typeof item.localImage === 'string' && item.localImage.trim()) {
    return item.localImage.trim();
  }

  // ----------------------------------------------------------------
  // Priority 3: Category-specific & dish-specific fallback images
  // ----------------------------------------------------------------
  const name = (item.name || '').trim();
  const cuisine = (item.cuisine || '').toLowerCase();
  const category = (item.category || (item.categories && item.categories[0]) || '').toLowerCase();
  const recordType = item.recordType || '';
  const key = item.id || item.name || 'food_item';

  // 3a. Order Fulfillment / Dispatch Runs (DoorDash)
  if (recordType === 'order_dispatch' || /\b(order dispatch|courier transit|market subtotal)\b/i.test(name)) {
    return pickDeterministic(IMAGE_POOLS.order_dispatch, key);
  }

  // 3b. Explicit South Indian Dishes (idli, dosa, vada, appam, puttu)
  // Dish name takes absolute priority over restaurant name or multi-cuisine tags
  if (SOUTH_INDIAN_DISH_REGEX.test(name)) {
    return pickDeterministic(IMAGE_POOLS.indian_south, key);
  }

  // 3c. Biryani Listings
  // Items categorized as biryani or named with biryani/pulao strictly receive biryani images.
  // Secondary cuisine tags (e.g. "South Indian" or "Curry") never override a biryani dish.
  if (
    category === 'biryani' ||
    BIRYANI_DISH_REGEX.test(name) ||
    (item.categories && item.categories.includes('biryani') && category !== 'indian')
  ) {
    return pickDeterministic(IMAGE_POOLS.biryani, key);
  }

  // 3d. Pizza (Margherita vs Specialty)
  if (category === 'pizza' || PIZZA_DISH_REGEX.test(name)) {
    if (/\b(margherita|cheese|veg)\b/i.test(name)) {
      return pickDeterministic(IMAGE_POOLS.pizza_margherita, key);
    }
    return pickDeterministic(IMAGE_POOLS.pizza_general, key);
  }

  // 3e. Burgers
  if (category === 'burgers' || BURGER_DISH_REGEX.test(name)) {
    return pickDeterministic(IMAGE_POOLS.burgers, key);
  }

  // 3f. Chinese Dish Specifics (Momos, Fried Rice, Noodles, Manchurian)
  if (MOMOS_DISH_REGEX.test(name)) {
    return pickDeterministic(IMAGE_POOLS.chinese_momos, key);
  }
  if (FRIED_RICE_DISH_REGEX.test(name)) {
    return pickDeterministic(IMAGE_POOLS.chinese_rice, key);
  }
  if (NOODLES_DISH_REGEX.test(name)) {
    return pickDeterministic(IMAGE_POOLS.chinese_noodles, key);
  }
  if (MANCHURIAN_DISH_REGEX.test(name)) {
    return pickDeterministic(IMAGE_POOLS.chinese_manchurian, key);
  }
  if (category === 'chinese') {
    return pickDeterministic(IMAGE_POOLS.chinese_noodles, key);
  }

  // 3g. Desserts (Waffle, Brownie, Cake, Ice Cream/Sweets)
  if (WAFFLE_DISH_REGEX.test(name)) {
    return pickDeterministic(IMAGE_POOLS.dessert_waffle, key);
  }
  if (BROWNIE_DISH_REGEX.test(name)) {
    return pickDeterministic(IMAGE_POOLS.dessert_brownie, key);
  }
  if (CAKE_DISH_REGEX.test(name)) {
    return pickDeterministic(IMAGE_POOLS.dessert_cake, key);
  }
  if (ICECREAM_DISH_REGEX.test(name)) {
    return pickDeterministic(IMAGE_POOLS.dessert_icecream, key);
  }
  if (category === 'desserts') {
    return pickDeterministic(IMAGE_POOLS.dessert_icecream, key);
  }

  // 3h. Beverages (Coffee, Tea, Juice, Smoothie, Shake)
  if (COFFEE_DISH_REGEX.test(name)) {
    return pickDeterministic(IMAGE_POOLS.beverage_coffee, key);
  }
  if (TEA_DISH_REGEX.test(name)) {
    return pickDeterministic(IMAGE_POOLS.beverage_tea, key);
  }
  if (JUICE_DISH_REGEX.test(name)) {
    return pickDeterministic(IMAGE_POOLS.beverage_juice, key);
  }
  if (SMOOTHIE_DISH_REGEX.test(name)) {
    return pickDeterministic(IMAGE_POOLS.beverage_smoothie, key);
  }
  if (SHAKE_DISH_REGEX.test(name)) {
    return pickDeterministic(IMAGE_POOLS.beverage_shake, key);
  }
  if (category === 'beverages') {
    return pickDeterministic(IMAGE_POOLS.beverage_juice, key);
  }

  // 3i. Indian Dish Specifics (Shawarma/Rolls, Curries/Thalis, South Indian cuisine fallback)
  if (SHAWARMA_DISH_REGEX.test(name)) {
    return pickDeterministic(IMAGE_POOLS.indian_shawarma, key);
  }
  if (CURRY_DISH_REGEX.test(name)) {
    return pickDeterministic(IMAGE_POOLS.indian_curry, key);
  }
  if (category === 'indian') {
    if (cuisine.includes('south indian') && !cuisine.includes('north indian')) {
      return pickDeterministic(IMAGE_POOLS.indian_south, key);
    }
    return pickDeterministic(IMAGE_POOLS.indian_curry, key);
  }

  // 3j. Restaurant Venues / Generic Dining
  if (recordType === 'restaurant_listing') {
    return pickDeterministic(IMAGE_POOLS.restaurant_venues, key);
  }

  // 3k. Direct Category Fallbacks
  if (category === 'biryani') return pickDeterministic(IMAGE_POOLS.biryani, key);
  if (category === 'pizza') return pickDeterministic(IMAGE_POOLS.pizza_general, key);
  if (category === 'burgers') return pickDeterministic(IMAGE_POOLS.burgers, key);
  if (category === 'chinese') return pickDeterministic(IMAGE_POOLS.chinese_noodles, key);
  if (category === 'indian') return pickDeterministic(IMAGE_POOLS.indian_curry, key);
  if (category === 'desserts') return pickDeterministic(IMAGE_POOLS.dessert_icecream, key);
  if (category === 'beverages') return pickDeterministic(IMAGE_POOLS.beverage_juice, key);

  // ----------------------------------------------------------------
  // Priority 4: Neutral FoodCompare Branded Placeholder
  // ----------------------------------------------------------------
  return BRANDED_FALLBACK_SVG;
}
