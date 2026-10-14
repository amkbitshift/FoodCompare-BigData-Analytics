/**
 * FoodCompare — Data Service & Adapter Layer
 * 
 * Provides consistent multi-platform normalization, category mapping,
 * transparent fee calculations, and centralized currency conversion into INR.
 */

import { catalogData } from '../data/normalized_catalog.js';
import {
  convertToINR,
  formatINR,
  formatMoney,
  CURRENCY_CONFIG,
  calculateTrueFinalCostINR
} from '../utils/currency.js';
import { matchesCategory, classifyCategories } from '../utils/categoryClassifier.js';
import { resolveFoodImage } from '../utils/imageResolver.js';
import {
  evaluateComparisonGroup,
  calculateOfferCost,
  calculateDealScore,
  parseDeliveryMinutes
} from '../utils/comparisonEngine.js';

/**
 * Normalizes any variation of platform names into a standard key
 */
export function normalizePlatformId(rawId) {
  if (!rawId) return '';
  const s = String(rawId).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (s.includes('swiggy')) return 'swiggy';
  if (s.includes('zomato')) return 'zomato';
  if (s.includes('grubhub') || s.includes('grub')) return 'grubhub';
  if (s.includes('doordash') || s.includes('door') || s.includes('dash')) return 'doordash';
  if (s.includes('foodpanda') || s.includes('panda')) return 'foodpanda';
  return s;
}

/**
 * Official platform metadata with authentic dataset record counts
 */
export const PLATFORMS_METADATA = [
  {
    id: 'swiggy',
    name: 'Swiggy',
    records: '139,321',
    sourceCurrency: 'INR',
    region: 'India (Pan-India)',
    sourceFile: 'output/swiggy_analysis_ready.csv',
    observationUnit: 'Restaurant & Menu Listings',
    status: 'Verified Cleaned Dataset'
  },
  {
    id: 'zomato',
    name: 'Zomato',
    records: '101,530',
    sourceCurrency: 'INR',
    region: 'India (Metro & Tier 1)',
    sourceFile: 'output/zomato_cleaned.csv',
    observationUnit: 'Individual Menu Items',
    status: 'Verified Cleaned Dataset'
  },
  {
    id: 'grubhub',
    name: 'Grubhub',
    records: '8,088',
    sourceCurrency: 'USD',
    region: 'United States Metros',
    sourceFile: 'output/grubhub_cleaned.csv',
    observationUnit: 'Restaurant Venues & Delivery Fees',
    status: 'Verified Cleaned Dataset'
  },
  {
    id: 'doordash',
    name: 'DoorDash',
    records: '1,200',
    sourceCurrency: 'USD',
    region: 'US Metro Hubs (Doorlanta, Dashattan)',
    sourceFile: 'datasets/Doordash.csv',
    observationUnit: 'Order Fulfillment Runs (Subtotals & Delivery Timing)',
    status: 'Order-Level Dispatch Dataset'
  },
  {
    id: 'foodpanda',
    name: 'Foodpanda',
    records: '6,000',
    sourceCurrency: 'PKR',
    region: 'South Asia / Regional Metros',
    sourceFile: 'datasets/Foodpanda Analysis Dataset.csv',
    observationUnit: 'Customer Orders & Dishes',
    status: 'Verified Sample Dataset'
  }
];

export const CATEGORIES_LIST = [
  { id: 'all', label: 'All Food' },
  { id: 'biryani', label: 'Biryani' },
  { id: 'pizza', label: 'Pizza' },
  { id: 'burgers', label: 'Burgers' },
  { id: 'indian', label: 'Indian' },
  { id: 'chinese', label: 'Chinese' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'beverages', label: 'Beverages' }
];

export const LOCATIONS_LIST = [
  { id: 'all', label: 'All Supported Regions' },
  { id: 'hyderabad', label: 'Hyderabad, IN' },
  { id: 'agra', label: 'Agra, IN' },
  { id: 'mumbai', label: 'Mumbai, IN' },
  { id: 'ahmedabad', label: 'Ahmedabad, IN' },
  { id: 'brooklyn', label: 'Brooklyn, NY (US)' },
  { id: 'atlanta', label: 'Doorlanta / Atlanta (US)' },
  { id: 'manhattan', label: 'Dashattan / NYC (US)' },
  { id: 'peshawar', label: 'Peshawar, PK' },
  { id: 'lahore', label: 'Lahore, PK' },
  { id: 'karachi', label: 'Karachi, PK' }
];

// Curated high-res editorial food photography
export const FOOD_PHOTOS = {
  biryani: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&auto=format&fit=crop&q=80',
  pizza: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=700&auto=format&fit=crop&q=80',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80',
  dosa: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=700&auto=format&fit=crop&q=80',
  shawarma: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=700&auto=format&fit=crop&q=80',
  chinese: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=700&auto=format&fit=crop&q=80',
  dessert: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=700&auto=format&fit=crop&q=80',
  beverages: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=700&auto=format&fit=crop&q=80',
  chicken: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=700&auto=format&fit=crop&q=80',
  curry: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=700&auto=format&fit=crop&q=80'
};

/**
 * Cross-platform benchmark comparison items with all figures normalized to INR
 */
export const FEATURED_COMPARISON_ITEMS = [
  {
    id: 'compare-hyderabad-biryani',
    name: 'Hyderabadi Dum Chicken Biryani',
    restaurant: 'Shah Ghouse / Paradise Heritage',
    category: 'biryani',
    categories: ['biryani', 'indian'],
    cuisine: 'Biryani, North Indian',
    city: 'Hyderabad, IN',
    image: FOOD_PHOTOS.biryani,
    primaryPlatform: 'swiggy',
    platform: 'swiggy',
    platformName: 'Swiggy',
    recordType: 'menu_item',
    price: 280,
    sourceCurrency: 'INR',
    rating: 4.2,
    ratingCount: '2,400+ votes',
    activeOffer: 'FLAT ₹120 OFF (AXIS120)',
    deliveryTimeEst: '32-42 min',
    deliveryFee: 35,
    dataSource: 'historical_dataset',
    sourceFile: 'output/swiggy_analysis_ready.csv & output/zomato_cleaned.csv',
    canCompareFood: true,
    description: 'Slow-cooked fragrant basmati rice with succulent marinated chicken, authentic saffron, fried onions, and signature mirchi ka salan.',
    comparisonOffers: [
      {
        platform: 'Swiggy',
        platformId: 'swiggy',
        restaurantName: 'Shah Ghouse Hotel & Restaurant',
        city: 'Hyderabad, IN',
        sourcePrice: 280,
        sourceCurrency: 'INR',
        discountAmount: 60,
        discountLabel: '20% OFF up to ₹60',
        discountVerified: true,
        deliveryFee: 35,
        serviceFee: 15,
        deliveryTime: '35 mins',
        rating: 4.2,
        notes: 'Verified listed price in Charminar, Hyderabad dataset record'
      },
      {
        platform: 'Zomato',
        platformId: 'zomato',
        restaurantName: 'Shah Ghouse Special',
        city: 'Hyderabad, IN',
        sourcePrice: 270,
        sourceCurrency: 'INR',
        discountAmount: 80,
        discountLabel: 'FLAT ₹80 OFF on ₹250+',
        discountVerified: true,
        deliveryFee: 30,
        serviceFee: 12,
        deliveryTime: '40 mins',
        rating: 4.1,
        notes: 'Verified item record from output/zomato_cleaned.csv'
      },
      {
        platform: 'Foodpanda',
        platformId: 'foodpanda',
        restaurantName: 'Biryani Express Hub',
        city: 'Peshawar, PK',
        sourcePrice: 850,
        sourceCurrency: 'PKR',
        discountAmount: 100,
        discountLabel: '₨100 voucher',
        discountVerified: true,
        deliveryFee: 150,
        serviceFee: 50,
        deliveryTime: '45 mins',
        rating: 3.9,
        notes: 'Converted from PKR at benchmark rate (1 PKR ≈ ₹0.30)'
      },
      {
        platform: 'DoorDash',
        platformId: 'doordash',
        restaurantName: 'Not Available in Region',
        city: 'United States (N/A)',
        sourcePrice: null,
        sourceCurrency: 'USD',
        discountAmount: 0,
        discountLabel: null,
        discountVerified: false,
        deliveryFee: null,
        serviceFee: null,
        deliveryTime: 'N/A',
        rating: null,
        notes: 'DoorDash operates in the US; dataset contains order fulfillment logs, not menu items.'
      },
      {
        platform: 'Grubhub',
        platformId: 'grubhub',
        restaurantName: 'Not Available in Region',
        city: 'United States (N/A)',
        sourcePrice: null,
        sourceCurrency: 'USD',
        discountAmount: 0,
        discountLabel: null,
        discountVerified: false,
        deliveryFee: null,
        serviceFee: null,
        deliveryTime: 'N/A',
        rating: null,
        notes: 'Grubhub dataset restricted to US Metropolitan zones.'
      }
    ]
  },
  {
    id: 'compare-woodfired-pizza',
    name: 'Artisan Margherita Pizza',
    restaurant: "Mama Roxy's / Full Moon Pizza",
    category: 'pizza',
    categories: ['pizza', 'indian'],
    cuisine: 'Italian, Pizza, Fast Food',
    city: 'Brooklyn, NY (US) & Agra, IN',
    image: FOOD_PHOTOS.pizza,
    primaryPlatform: 'grubhub',
    platform: 'grubhub',
    platformName: 'Grubhub',
    recordType: 'restaurant_listing',
    price: 14.50,
    sourceCurrency: 'USD',
    rating: 4.05,
    ratingCount: '840+ reviews',
    activeOffer: '$0 Delivery with GH+',
    deliveryTimeEst: '40.0 min',
    deliveryFee: 2.99,
    dataSource: 'historical_dataset',
    sourceFile: 'output/grubhub_cleaned.csv',
    canCompareFood: true,
    description: 'San Marzano tomato sauce, fresh buffalo mozzarella, fresh basil, and extra virgin olive oil on slow-fermented crust.',
    comparisonOffers: [
      {
        platform: 'Grubhub',
        platformId: 'grubhub',
        restaurantName: "Mama Roxy's Italian Pizzeria",
        city: 'Brooklyn, NY (US)',
        sourcePrice: 14.50,
        sourceCurrency: 'USD',
        discountAmount: 2.99,
        discountLabel: 'Free Delivery GH+',
        discountVerified: true,
        deliveryFee: 2.99,
        serviceFee: 5.25,
        deliveryTime: '40.0 min',
        rating: 3.33,
        notes: 'Converted from USD at benchmark rate (1 USD ≈ ₹83.50)'
      },
      {
        platform: 'Swiggy',
        platformId: 'swiggy',
        restaurantName: 'Full Moon Veg Pizza',
        city: 'Tajganj, Agra, IN',
        sourcePrice: 150,
        sourceCurrency: 'INR',
        discountAmount: 30,
        discountLabel: 'FLAT ₹30 OFF',
        discountVerified: true,
        deliveryFee: 30,
        serviceFee: 10,
        deliveryTime: '35 mins',
        rating: 3.8,
        notes: 'Indian domestic counterpart record from swiggy_analysis_ready.csv'
      }
    ]
  },
  {
    id: 'compare-classic-burger',
    name: 'Double Smash Cheeseburger Combo',
    restaurant: "The Burger Lab / McDonald's",
    category: 'burgers',
    categories: ['burgers'],
    cuisine: 'Burgers, American, Fast Food',
    city: 'Doorlanta / Regional Hubs',
    image: FOOD_PHOTOS.burger,
    primaryPlatform: 'doordash',
    platform: 'doordash',
    platformName: 'DoorDash',
    recordType: 'order_dispatch',
    price: 9.99,
    sourceCurrency: 'USD',
    rating: 4.3,
    ratingCount: '5,120 reviews',
    activeOffer: 'DashPass Active',
    deliveryTimeEst: '28-35 min',
    deliveryFee: 2.49,
    dataSource: 'historical_dataset',
    sourceFile: 'datasets/Doordash.csv & datasets/Foodpanda Analysis Dataset.csv',
    canCompareFood: true,
    description: 'Two seared beef patties, melted sharp cheddar, caramelized onions, house pickles, and brioche bun with crispy fries.',
    comparisonOffers: [
      {
        platform: 'DoorDash',
        platformId: 'doordash',
        restaurantName: 'The Smash Burger Lab',
        city: 'Doorlanta / Atlanta, US',
        sourcePrice: 9.99,
        sourceCurrency: 'USD',
        discountAmount: 2.00,
        discountLabel: '$2 DashPass Off',
        discountVerified: true,
        deliveryFee: 2.49,
        serviceFee: 2.10,
        deliveryTime: '31 min',
        rating: 4.3,
        notes: 'Converted from USD at benchmark rate (1 USD ≈ ₹83.50)'
      },
      {
        platform: 'Foodpanda',
        platformId: 'foodpanda',
        restaurantName: "McDonald's Burger",
        city: 'Regional Hubs, PK',
        sourcePrice: 1478.27,
        sourceCurrency: 'PKR',
        discountAmount: 150,
        discountLabel: 'PandaClub Promo',
        discountVerified: true,
        deliveryFee: 60,
        serviceFee: 25,
        deliveryTime: '38 min',
        rating: 4.0,
        notes: 'Extracted order record from Foodpanda Analysis Dataset.csv'
      }
    ]
  }
];

/**
 * Data Service Implementation
 */
export const dataService = {
  /**
   * Get all platforms metadata
   */
  getPlatformsList: () => PLATFORMS_METADATA,

  /**
   * Get categories list
   */
  getCategoriesList: () => CATEGORIES_LIST,

  /**
   * Get locations list
   */
  getLocationsList: () => LOCATIONS_LIST,

  /**
   * Query food items with robust multi-platform normalization,
   * category filtering with synonym support, search, and sorting.
   */
  getFoodItems: ({
    category = 'all',
    platform = 'all',
    search = '',
    location = 'all',
    sortBy = 'default'
  } = {}) => {
    // Combine catalog data with featured multi-platform comparison items
    const rawItems = [...FEATURED_COMPARISON_ITEMS, ...catalogData];

    // Deduplicate by ID
    const seenIds = new Set();
    const uniqueItems = [];
    for (const item of rawItems) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        uniqueItems.push(item);
      }
    }

    let results = uniqueItems.map(item => {
      // Normalize platform identifier
      const normPlatform = normalizePlatformId(item.platform || item.sourcePlatform || item.primaryPlatform);
      
      // Calculate INR price safely
      const priceINR = convertToINR(item.price, item.sourceCurrency || 'INR');
      const deliveryFeeINR = item.deliveryFee !== null && item.deliveryFee !== undefined
        ? convertToINR(item.deliveryFee, item.sourceCurrency || 'INR')
        : null;
      const serviceFeeINR = item.serviceFee !== null && item.serviceFee !== undefined
        ? convertToINR(item.serviceFee, item.sourceCurrency || 'INR')
        : null;

      // Extract categories array
      const itemCats = item.categories && item.categories.length > 0
        ? item.categories
        : (item.category ? [item.category] : ['all']);

      return {
        ...item,
        platformId: normPlatform,
        categories: itemCats,
        image: resolveFoodImage(item),
        priceINR,
        deliveryFeeINR,
        serviceFeeINR
      };
    });

    // 1. Filter by platform
    const targetPlatform = normalizePlatformId(platform);
    if (targetPlatform && targetPlatform !== 'all') {
      results = results.filter(item => {
        if (item.platformId === targetPlatform) return true;
        // Also check if item has matching comparison offer for this platform
        if (item.comparisonOffers && Array.isArray(item.comparisonOffers)) {
          return item.comparisonOffers.some(o => {
            const offerPlat = normalizePlatformId(o.platformId || o.platform);
            return offerPlat === targetPlatform && o.sourcePrice !== null;
          });
        }
        return false;
      });
    }

    // 2. Filter by category using synonym-aware matching
    if (category && category !== 'all') {
      results = results.filter(item => {
        // DoorDash orders don't have dish categories, so keep them visible when 'all' is selected,
        // or filter if a specific food category is chosen.
        if (item.recordType === 'order_dispatch') {
          return false;
        }
        return matchesCategory(item.categories, category);
      });
    }

    // 3. Filter by search term
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      results = results.filter(item => {
        const nameMatch = (item.name || '').toLowerCase().includes(q);
        const restMatch = (item.restaurantName || '').toLowerCase().includes(q);
        const cuisineMatch = (item.cuisine || '').toLowerCase().includes(q);
        const cityMatch = (item.city || '').toLowerCase().includes(q);
        const platformMatch = (item.platformName || item.platform || '').toLowerCase().includes(q);
        const catMatch = (item.categories || []).some(c => c.toLowerCase().includes(q));
        return nameMatch || restMatch || cuisineMatch || catMatch || cityMatch || platformMatch;
      });
    }

    // 4. Filter by location
    if (location && location !== 'all') {
      const locKey = location.toLowerCase().trim();
      results = results.filter(item => {
        const cityStr = (item.city || '').toLowerCase();
        if (locKey === 'atlanta') return cityStr.includes('atlanta') || cityStr.includes('doorlanta');
        if (locKey === 'manhattan') return cityStr.includes('manhattan') || cityStr.includes('dashattan') || cityStr.includes('new york');
        return cityStr.includes(locKey);
      });
    }

    // 5. Sort results
    if (sortBy === 'price_asc') {
      results.sort((a, b) => (a.priceINR || 0) - (b.priceINR || 0));
    } else if (sortBy === 'price_desc') {
      results.sort((a, b) => (b.priceINR || 0) - (a.priceINR || 0));
    } else if (sortBy === 'rating') {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return results;
  },

  /**
   * Retrieve item by ID
   */
  getItemById: (id) => {
    const all = dataService.getFoodItems({ category: 'all', platform: 'all' });
    return all.find(item => item.id === id) || null;
  },

  /**
   * Safely calculate estimated total strictly in INR using the comparison engine
   */
  calculateEstimatedTotalINR: (offer) => {
    return calculateOfferCost(offer);
  },

  /**
   * Dynamically evaluate a comparison group of platform offers
   */
  evaluateComparison: (offers, foodContext = {}) => {
    return evaluateComparisonGroup(offers, foodContext);
  },

  /**
   * Get sorted best deals across all platform offers formatted in INR
   */
  getBestDealsINR: (sortKey = 'lowest_total') => {
    const allDeals = [];

    FEATURED_COMPARISON_ITEMS.forEach(food => {
      if (food.comparisonOffers) {
        food.comparisonOffers.forEach(offer => {
          if (offer.sourcePrice !== null && offer.sourcePrice !== undefined) {
            const cost = calculateOfferCost(offer);
            const discINR = (offer.discountVerified && offer.discountAmount)
              ? (convertToINR(offer.discountAmount, offer.sourceCurrency || 'INR') || 0)
              : 0;
            const priceINR = convertToINR(offer.sourcePrice, offer.sourceCurrency || 'INR') || 0;
            const deliveryMinutes = parseDeliveryMinutes(offer.deliveryTime);
            const ratingNum = typeof offer.rating === 'number' && !isNaN(offer.rating)
              ? offer.rating
              : (parseFloat(offer.rating) || 3.5);

            const dealScore = calculateDealScore({
              priceINR,
              discountINR: discINR,
              rating: ratingNum,
              deliveryMinutes
            });

            allDeals.push({
              foodId: food.id,
              foodName: food.name,
              foodImage: food.image,
              category: food.category,
              city: offer.city || food.city,
              platform: offer.platform,
              platformId: normalizePlatformId(offer.platformId || offer.platform),
              restaurantName: offer.restaurantName,
              sourcePrice: offer.sourcePrice,
              sourceCurrency: offer.sourceCurrency,
              priceINR,
              priceFormatted: formatINR(priceINR),
              discountAmountINR: discINR,
              discountFormatted: discINR > 0 ? formatINR(discINR) : 'None',
              discountLabel: offer.discountLabel,
              discountVerified: Boolean(offer.discountVerified),
              deliveryFeeINR: cost.deliveryFeeINR,
              serviceFeeINR: cost.serviceFeeINR,
              deliveryTime: offer.deliveryTime,
              deliveryMinutes,
              rating: offer.rating,
              estimatedTotalINR: cost.totalINR,
              estimatedTotalFormatted: cost.totalFormatted,
              isCompleteEstimate: cost.isComplete,
              dealScore,
              notes: offer.notes
            });
          }
        });
      }
    });

    if (sortKey === 'lowest_price') {
      return allDeals.sort((a, b) => (a.priceINR || 99999) - (b.priceINR || 99999));
    } else if (sortKey === 'highest_discount') {
      return allDeals.sort((a, b) => (b.discountAmountINR || 0) - (a.discountAmountINR || 0));
    } else if (sortKey === 'highest_rating') {
      return allDeals.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortKey === 'fastest_delivery') {
      return allDeals.sort((a, b) => (a.deliveryMinutes || 999) - (b.deliveryMinutes || 999));
    } else if (sortKey === 'best_deal_score') {
      return allDeals.sort((a, b) => (b.dealScore || 0) - (a.dealScore || 0));
    }

    // Default: 'lowest_total' strictly sorts by estimated total in INR ascending (lowest cost wins)
    return allDeals.sort((a, b) => (a.estimatedTotalINR || 99999) - (b.estimatedTotalINR || 99999));
  }
};
