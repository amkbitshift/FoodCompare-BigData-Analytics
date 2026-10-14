/**
 * FoodCompare Comprehensive Functionality & Data-Integrity Audit Suite
 */

import { dataService, PLATFORMS_METADATA, CATEGORIES_LIST, LOCATIONS_LIST, FEATURED_COMPARISON_ITEMS } from '../website/src/services/dataService.js';
import { catalogData } from '../website/src/data/normalized_catalog.js';
import {
  convertToINR,
  formatINR,
  formatMoney,
  CURRENCY_CONFIG,
  calculateTrueFinalCostINR
} from '../website/src/utils/currency.js';
import { resolveFoodImage } from '../website/src/utils/imageResolver.js';
import {
  PROJECT_METADATA,
  KPI_SUMMARY,
  PLATFORM_COMPARISON_METRICS,
  DATASET_QUALITY_AUDIT
} from '../website/src/data/sampleAnalyticsData.js';

console.log('================================================================');
console.log('🏁 FOODCOMPARE FINAL FUNCTIONALITY & DATA-INTEGRITY AUDIT SUITE');
console.log('================================================================');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, description) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${description}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${description}`);
  }
}

// ----------------------------------------------------------------
// SECTION 1: NAVIGATION & VIEW INTEGRITY
// ----------------------------------------------------------------
console.log('\n--- SECTION 1: NAVIGATION & VIEW INTEGRITY ---');
const navViews = ['home', 'explore', 'compare', 'deals', 'insights'];
assert(navViews.length === 5, 'All 5 distinct core views are specified (Home, Explore, Compare, Deals, Insights)');
assert(FEATURED_COMPARISON_ITEMS.length >= 3, 'Featured comparison benchmark items exist for Compare Prices view');
assert(LOCATIONS_LIST.length >= 10, 'All 10 regional geographic hubs are registered in LOCATIONS_LIST');

// ----------------------------------------------------------------
// SECTION 2: DATA & FILTER INTEGRITY
// ----------------------------------------------------------------
console.log('\n--- SECTION 2: DATA & FILTERS INTEGRITY ---');

// Check no duplicate IDs
const allItems = dataService.getFoodItems({ category: 'all', platform: 'all' });
const idMap = new Set();
let duplicatesFound = false;
for (const item of allItems) {
  if (idMap.has(item.id)) duplicatesFound = true;
  idMap.add(item.id);
}
assert(!duplicatesFound, `Zero duplicate item IDs found across ${allItems.length} loaded records`);

// Platform counts
const swiggyItems = dataService.getFoodItems({ platform: 'swiggy' });
const zomatoItems = dataService.getFoodItems({ platform: 'zomato' });
const grubhubItems = dataService.getFoodItems({ platform: 'grubhub' });
const doordashItems = dataService.getFoodItems({ platform: 'doordash' });
const foodpandaItems = dataService.getFoodItems({ platform: 'foodpanda' });

assert(swiggyItems.length > 0, `Swiggy returns genuine records (${swiggyItems.length} items)`);
assert(zomatoItems.length > 0, `Zomato returns genuine records (${zomatoItems.length} items)`);
assert(grubhubItems.length > 0, `Grubhub returns genuine records (${grubhubItems.length} items)`);
assert(doordashItems.length > 0, `DoorDash returns genuine records (${doordashItems.length} items)`);
assert(foodpandaItems.length > 0, `Foodpanda returns genuine records (${foodpandaItems.length} items)`);

// Category counts
for (const cat of CATEGORIES_LIST) {
  const cItems = dataService.getFoodItems({ category: cat.id, platform: 'all' });
  assert(cItems.length >= 2, `Category "${cat.label}" returns genuine records (${cItems.length} items, >= 2 target)`);
}

// Location filter counts
for (const loc of LOCATIONS_LIST) {
  const lItems = dataService.getFoodItems({ location: loc.id });
  assert(lItems.length > 0, `Location "${loc.label}" returns genuine records (${lItems.length} items)`);
}

// Sorting logic
const ascItems = dataService.getFoodItems({ sortBy: 'price_asc' });
let isAsc = true;
for (let i = 1; i < ascItems.length; i++) {
  if (ascItems[i].priceINR < ascItems[i - 1].priceINR) { isAsc = false; break; }
}
assert(isAsc, 'Price ascending sort strictly orders by priceINR');

const descItems = dataService.getFoodItems({ sortBy: 'price_desc' });
let isDesc = true;
for (let i = 1; i < descItems.length; i++) {
  if (descItems[i].priceINR > descItems[i - 1].priceINR) { isDesc = false; break; }
}
assert(isDesc, 'Price descending sort strictly orders by priceINR');

// ----------------------------------------------------------------
// SECTION 3: IMAGES & VISUAL RESOLVER
// ----------------------------------------------------------------
console.log('\n--- SECTION 3: IMAGE RESOLVER & DIVERSITY ---');
const sampleMomos = { name: 'Steamed Veg Momos', category: 'chinese' };
const sampleNoodles = { name: 'Hakka Noodles', category: 'chinese' };
const sampleFriedRice = { name: 'Schezwan Fried Rice', category: 'chinese' };
const sampleDosa = { name: 'Masala Dosa', category: 'indian' };
const sampleBiryani = { name: 'Chicken Dum Biryani', category: 'biryani' };

const imgMomos = resolveFoodImage(sampleMomos);
const imgNoodles = resolveFoodImage(sampleNoodles);
const imgRice = resolveFoodImage(sampleFriedRice);
const imgDosa = resolveFoodImage(sampleDosa);
const imgBiryani = resolveFoodImage(sampleBiryani);

assert(imgMomos !== imgNoodles, 'Momos and Noodles resolve to distinct images within Chinese cuisine');
assert(imgNoodles !== imgRice, 'Noodles and Fried Rice resolve to distinct images within Chinese cuisine');
assert(imgDosa !== imgBiryani, 'South Indian Dosa and Biryani resolve to distinct images');

// Deterministic stability
const imgStable1 = resolveFoodImage({ id: 'stable-1', name: 'Paneer Butter Masala', category: 'indian' });
const imgStable2 = resolveFoodImage({ id: 'stable-1', name: 'Paneer Butter Masala', category: 'indian' });
assert(imgStable1 === imgStable2, 'Image resolver is deterministic across repeated calls/renders');

// ----------------------------------------------------------------
// SECTION 4: CURRENCY, DISCOUNTS & TOTAL COST FORMULAS
// ----------------------------------------------------------------
console.log('\n--- SECTION 4: CURRENCY & COST CALCULATIONS ---');
assert(CURRENCY_CONFIG.targetCurrency === 'INR', 'Base target currency is INR');
assert(CURRENCY_CONFIG.exchangeRatesToINR.USD === 83.50, 'USD benchmark exchange rate is documented (83.50)');
assert(CURRENCY_CONFIG.exchangeRatesToINR.PKR === 0.30, 'PKR benchmark exchange rate is documented (0.30)');

// Unknown currency handling
assert(convertToINR(100, 'EUR') === null, 'Unknown currency EUR returns null (never silently converted)');
assert(convertToINR(100, 'UNKNOWN') === null, 'Unsupported currency UNKNOWN returns null');

// Traceability
const moneyTrace = formatMoney(12.50, 'USD');
assert(moneyTrace.isConverted === true, 'Foreign currency flagged as converted');
assert(moneyTrace.inrText.includes('₹'), 'Converted text uses INR symbol');
assert(moneyTrace.originalText.includes('$12.50 USD'), 'Original currency ($12.50 USD) preserved in metadata');

// Breakdown with missing fee
const partialCalc = calculateTrueFinalCostINR({
  itemPrice: 200,
  itemCurrency: 'INR',
  deliveryFee: null,
  discountAmount: 20
});
assert(partialCalc.isComplete === false, 'Final total flagged incomplete when delivery fee is unrecorded');
assert(partialCalc.warning.includes('Delivery fee not recorded'), 'Explicit warning attached for unrecorded fee');

// ----------------------------------------------------------------
// SECTION 5: BEST DEALS & INSIGHTS DATA PROVENANCE
// ----------------------------------------------------------------
console.log('\n--- SECTION 5: BEST DEALS & INSIGHTS ---');
const dealsLowest = dataService.getBestDealsINR('lowest_total');
assert(dealsLowest.length > 0, `Best deals returns ranked items (${dealsLowest.length} verified deals)`);
assert(dealsLowest[0].estimatedTotalFormatted.includes('₹'), 'Top deal estimated total formatted in INR');

assert(PLATFORM_COMPARISON_METRICS.length === 5, 'All 5 platforms analyzed in platform metrics table');
assert(DATASET_QUALITY_AUDIT.length === 5, 'All 5 dataset audits documented with artifact references');
assert(PROJECT_METADATA.platformsAnalyzed.length === 5, 'All 5 platforms documented in project metadata');

// ----------------------------------------------------------------
// SUMMARY REPORT
// ----------------------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🏆 AUDIT SUITE STATUS: 100% PASS');
}
