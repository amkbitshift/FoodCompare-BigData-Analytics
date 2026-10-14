import { formatINR, convertToINR, formatMoney, calculateTrueFinalCostINR } from '../website/src/utils/currency.js';
import { dataService } from '../website/src/services/dataService.js';
import { CATEGORIES_LIST } from '../website/src/services/dataService.js';

console.log('====================================================');
console.log('🧪 FOODCOMPARE EXPLORE FOOD VERIFICATION TEST SUITE');
console.log('====================================================');

// TEST 1: Test each category individually
console.log('\n--- 1. CATEGORY COVERAGE TEST ---');
let allCategoriesPass = true;
const categoryResults = {};

CATEGORIES_LIST.forEach(cat => {
  const items = dataService.getFoodItems({ category: cat.id });
  categoryResults[cat.id] = items.length;
  const isPass = cat.id === 'all' ? items.length >= 100 : items.length >= 2;
  if (!isPass) allCategoriesPass = false;

  console.log(`[Category] ${cat.label.padEnd(14)} -> ${items.length.toString().padStart(3)} items | Status: ${isPass ? 'PASS (≥2)' : 'FAIL (<2)'}`);

  // Print first 2 sample items
  if (items.length > 0) {
    items.slice(0, 2).forEach((it, i) => {
      console.log(`     Sample ${i + 1}: "${it.name}" (${it.platformName}) | Price: ${formatINR(it.priceINR)} | Cats: [${it.categories.join(', ')}]`);
    });
  }
});

// TEST 2: Test each platform individually
console.log('\n--- 2. PLATFORM ISOLATION TEST ---');
const platforms = ['all', 'swiggy', 'zomato', 'grubhub', 'doordash', 'foodpanda'];
let allPlatformsPass = true;

platforms.forEach(p => {
  const items = dataService.getFoodItems({ platform: p });
  const isPass = items.length >= 15;
  if (!isPass) allPlatformsPass = false;
  console.log(`[Platform] ${p.padEnd(12)} -> ${items.length.toString().padStart(3)} items | Status: ${isPass ? 'PASS (≥15)' : 'FAIL (<15)'}`);
});

// TEST 3: Duplicate Record Check
console.log('\n--- 3. DUPLICATION INTEGRITY TEST ---');
const allItems = dataService.getFoodItems({ category: 'all', platform: 'all' });
const idSet = new Set();
let duplicatesFound = 0;
allItems.forEach(it => {
  if (idSet.has(it.id)) duplicatesFound++;
  idSet.add(it.id);
});
console.log(`Total unique catalog items: ${allItems.length}`);
console.log(`Duplicate IDs found: ${duplicatesFound} (Expected: 0) -> ${duplicatesFound === 0 ? 'PASS' : 'FAIL'}`);

// TEST 4: Search + Category Filter Combinations
console.log('\n--- 4. SEARCH + CATEGORY FILTER TEST ---');
const searchCatTests = [
  { search: 'chicken', category: 'biryani' },
  { search: 'margherita', category: 'pizza' },
  { search: 'burger', category: 'burgers' },
  { search: 'dosa', category: 'indian' },
  { search: 'noodle', category: 'chinese' },
  { search: 'chocolate', category: 'desserts' },
  { search: 'juice', category: 'beverages' }
];

searchCatTests.forEach(t => {
  const res = dataService.getFoodItems({ search: t.search, category: t.category });
  console.log(`Search "${t.search}" in category [${t.category}] -> ${res.length} matches`);
});

// TEST 5: Search + Platform Filter Combinations
console.log('\n--- 5. SEARCH + PLATFORM FILTER TEST ---');
const searchPlatTests = [
  { search: 'biryani', platform: 'swiggy' },
  { search: 'shawarma', platform: 'zomato' },
  { search: 'pizza', platform: 'grubhub' },
  { search: 'order', platform: 'doordash' },
  { search: 'burger', platform: 'foodpanda' }
];

searchPlatTests.forEach(t => {
  const res = dataService.getFoodItems({ search: t.search, platform: t.platform });
  console.log(`Search "${t.search}" on platform [${t.platform}] -> ${res.length} matches`);
});

// TEST 6: Empty Result State Handling
console.log('\n--- 6. EMPTY STATE TEST ---');
const emptyTest = dataService.getFoodItems({ search: 'nonexistentdishxyz999' });
console.log(`Search for "nonexistentdishxyz999" -> ${emptyTest.length} matches (Expected: 0) -> ${emptyTest.length === 0 ? 'PASS' : 'FAIL'}`);

console.log('\n====================================================');
console.log(`OVERALL TEST STATUS: ${allCategoriesPass && allPlatformsPass && duplicatesFound === 0 ? '✅ ALL CHECKS PASSED' : '❌ SOME CHECKS FAILED'}`);
console.log('====================================================\n');
