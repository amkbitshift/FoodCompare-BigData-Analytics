/**
 * Reusable Category Classifier & Synonym Mapping
 * FoodCompare Platform
 * 
 * Normalizes dish names, cuisines, and category strings to detect matching categories.
 * Supports multi-category assignment (e.g., Biryani is both 'biryani' and 'indian').
 */

export const CATEGORY_DEFINITIONS = {
  biryani: {
    id: 'biryani',
    label: 'Biryani',
    keywords: [
      'biryani', 'dum biryani', 'chicken biryani', 'veg biryani', 'mutton biryani',
      'hyderabadi biryani', 'biryani rice', 'handi biryani', 'pulao'
    ]
  },
  pizza: {
    id: 'pizza',
    label: 'Pizza',
    keywords: [
      'pizza', 'margherita', 'pepperoni', 'woodfired pizza', 'calzone', 'pizzeria',
      'thin crust', 'cheese pizza', 'paneer pizza'
    ]
  },
  burgers: {
    id: 'burgers',
    label: 'Burgers',
    keywords: [
      'burger', 'hamburger', 'cheeseburger', 'smash burger', 'slider', 'patty',
      'veggie burger', 'chicken burger', 'whopper'
    ]
  },
  indian: {
    id: 'indian',
    label: 'Indian',
    keywords: [
      'indian', 'south indian', 'north indian', 'dosa', 'idli', 'biryani', 'paneer',
      'dal', 'curry', 'roti', 'naan', 'paratha', 'thali', 'samosa', 'chaat', 'tandoori',
      'tikka', 'butter chicken', 'chole', 'bhature', 'masala dosa', 'vada', 'sambhar',
      'punjabi', 'mughlai', 'shawarma', 'kebab'
    ]
  },
  chinese: {
    id: 'chinese',
    label: 'Chinese',
    keywords: [
      'chinese', 'noodle', 'noodles', 'fried rice', 'manchurian', 'schezwan',
      'hakka', 'chowmein', 'dim sum', 'momos', 'wonton', 'asian', 'thai',
      'spring roll', 'sushi', 'chilli chicken', 'wok'
    ]
  },
  desserts: {
    id: 'desserts',
    label: 'Desserts',
    keywords: [
      'dessert', 'desserts', 'cake', 'brownie', 'ice cream', 'gulab jamun', 'waffle',
      'sweet', 'sweets', 'halwa', 'pastry', 'bakery', 'chocolate', 'kulfi', 'rasgulla',
      'doughnut', 'donut', 'sundae', 'cheesecake', 'muffin', 'truffle', 'mithai'
    ]
  },
  beverages: {
    id: 'beverages',
    label: 'Beverages',
    keywords: [
      'beverage', 'beverages', 'drinks', 'drink', 'juice', 'coffee', 'tea', 'chai',
      'milkshake', 'shake', 'smoothie', 'soda', 'lassi', 'mocktail', 'espresso',
      'latte', 'cold coffee', 'lemonade', 'bubble tea', 'frappe', 'cooler'
    ]
  }
};

/**
 * Classifies text into one or more categories based on keyword presence
 * @param {string} text - Combined dish name, cuisine, and category string
 * @returns {string[]} Array of matching category IDs, e.g. ['biryani', 'indian']
 */
export function classifyCategories(text) {
  if (!text) return [];

  const normalized = String(text).toLowerCase().trim();
  const matched = [];

  for (const [catId, def] of Object.entries(CATEGORY_DEFINITIONS)) {
    const hasMatch = def.keywords.some(kw => {
      // Use regex word boundary or substring match
      const regex = new RegExp(`\\b${kw.replace(/[-\\/\\\\^$*+?.()|[\\]{}]/g, '\\$&')}`, 'i');
      return regex.test(normalized) || normalized.includes(kw);
    });

    if (hasMatch) {
      matched.push(catId);
    }
  }

  return matched;
}

/**
 * Determine the primary display category for an item
 */
export function getPrimaryCategory(categories) {
  if (!categories || categories.length === 0) return 'all';
  // Specific food types take precedence over generic 'indian'
  if (categories.includes('biryani')) return 'biryani';
  if (categories.includes('pizza')) return 'pizza';
  if (categories.includes('burgers')) return 'burgers';
  if (categories.includes('chinese')) return 'chinese';
  if (categories.includes('desserts')) return 'desserts';
  if (categories.includes('beverages')) return 'beverages';
  if (categories.includes('indian')) return 'indian';
  return categories[0];
}

/**
 * Check if an item matches a selected category filter
 */
export function matchesCategory(itemCategories, selectedCategory) {
  if (!selectedCategory || selectedCategory === 'all') return true;
  if (!itemCategories || !Array.isArray(itemCategories)) return false;
  return itemCategories.includes(selectedCategory);
}
