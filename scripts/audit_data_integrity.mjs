import { dataService, PLATFORMS_METADATA, CATEGORIES_LIST } from '../website/src/services/dataService.js';
import { catalogData } from '../website/src/data/normalized_catalog.js';

console.log('====================================================');
console.log('🔍 AUDIT PART 1: DATA INTEGRITY & PLATFORM COUNTS');
console.log('====================================================');

const allItems = dataService.getFoodItems({ category: 'all', platform: 'all' });
console.log('Total catalogData entries:', catalogData.length);
console.log('Total getFoodItems("all", "all"):', allItems.length);

// Check duplicate IDs
const idCounts = {};
for (const item of allItems) {
  idCounts[item.id] = (idCounts[item.id] || 0) + 1;
}
const duplicateIds = Object.entries(idCounts).filter(([_, c]) => c > 1);
console.log('Duplicate IDs found:', duplicateIds.length);
if (duplicateIds.length > 0) {
  console.log('Duplicate IDs:', duplicateIds);
}

// Platforms audit
console.log('\n--- Platform Record Counts ---');
const platforms = ['all', 'swiggy', 'zomato', 'grubhub', 'doordash', 'foodpanda'];
for (const p of platforms) {
  const items = dataService.getFoodItems({ category: 'all', platform: p });
  console.log(`Platform [${p.padEnd(10)}]: ${items.length} records`);
}

// Categories audit
console.log('\n--- Category Record Counts (platform=all) ---');
for (const cat of CATEGORIES_LIST) {
  const items = dataService.getFoodItems({ category: cat.id, platform: 'all' });
  console.log(`Category [${cat.id.padEnd(10)}]: ${items.length} records`);
}

// Platform + Category Matrix
console.log('\n--- Platform x Category Breakdown ---');
for (const p of ['swiggy', 'zomato', 'grubhub', 'doordash', 'foodpanda']) {
  const pItems = dataService.getFoodItems({ category: 'all', platform: p });
  const counts = CATEGORIES_LIST.filter(c => c.id !== 'all').map(c => {
    const matching = dataService.getFoodItems({ category: c.id, platform: p });
    return `${c.id}:${matching.length}`;
  }).join(', ');
  console.log(`${p.padEnd(10)} (total ${pItems.length}) -> ${counts}`);
}

// Sorting Audit
console.log('\n--- Sorting Checks ---');
const ascItems = dataService.getFoodItems({ sortBy: 'price_asc' });
const descItems = dataService.getFoodItems({ sortBy: 'price_desc' });
const ratingItems = dataService.getFoodItems({ sortBy: 'rating' });

let ascSorted = true;
for (let i = 1; i < ascItems.length; i++) {
  if (ascItems[i].priceINR < ascItems[i-1].priceINR) { ascSorted = false; break; }
}
let descSorted = true;
for (let i = 1; i < descItems.length; i++) {
  if (descItems[i].priceINR > descItems[i-1].priceINR) { descSorted = false; break; }
}
let ratingSorted = true;
for (let i = 1; i < ratingItems.length; i++) {
  if ((ratingItems[i].rating || 0) > (ratingItems[i-1].rating || 0)) { ratingSorted = false; break; }
}

console.log('Price Ascending Sort Valid:', ascSorted ? 'PASS' : 'FAIL');
console.log('Price Descending Sort Valid:', descSorted ? 'PASS' : 'FAIL');
console.log('Rating Sort Valid:', ratingSorted ? 'PASS' : 'FAIL');

// Search Audit
console.log('\n--- Search Checks ---');
for (const q of ['biryani', 'pizza', 'burger', 'kanpur', 'brooklyn', 'zomato']) {
  const res = dataService.getFoodItems({ search: q });
  console.log(`Search query "${q}": ${res.length} matches`);
}
