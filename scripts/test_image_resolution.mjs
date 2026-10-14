import { dataService } from '../website/src/services/dataService.js';
import { resolveFoodImage, IMAGE_POOLS, BRANDED_FALLBACK_SVG } from '../website/src/utils/imageResolver.js';

console.log('====================================================');
console.log('📸 FOODCOMPARE IMAGE RESOLUTION TEST SUITE');
console.log('====================================================');

let allPassed = true;

function check(condition, desc) {
  if (condition) {
    console.log(`  ✅ PASS: ${desc}`);
  } else {
    console.error(`  ❌ FAIL: ${desc}`);
    allPassed = false;
  }
}

// ----------------------------------------------------------------
// 1. BIRYANI CATEGORY INTEGRITY & AUTHENTICITY
// ----------------------------------------------------------------
console.log('\n--- 1. BIRYANI CATEGORY AUTHENTICITY & IMAGE INTEGRITY ---');
const biryaniItems = dataService.getFoodItems({ category: 'biryani' });
console.log(`Total Biryani items: ${biryaniItems.length}`);

let biryaniIdliDosaCount = 0;
let biryaniCurryCount = 0;
let biryaniValidCount = 0;
const biryaniImages = new Set();

biryaniItems.forEach(item => {
  const img = resolveFoodImage(item);
  biryaniImages.add(img);

  const isBiryaniPool = IMAGE_POOLS.biryani.includes(img);
  const isSouthPool = IMAGE_POOLS.indian_south.includes(img);
  const isCurryPool = IMAGE_POOLS.indian_curry.includes(img);

  if (isSouthPool) biryaniIdliDosaCount++;
  if (isCurryPool) biryaniCurryCount++;
  if (isBiryaniPool) biryaniValidCount++;

  let poolName = 'other';
  for (const [pool, urls] of Object.entries(IMAGE_POOLS)) {
    if (urls.includes(img)) poolName = pool;
  }
  console.log(`  [${item.id.padEnd(25)}] "${item.name.slice(0, 32).padEnd(32)}" -> [${poolName.padEnd(14)}]`);
});

check(biryaniItems.length >= 17, `Biryani dataset returns all valid listings (${biryaniItems.length} records)`);
check(biryaniIdliDosaCount === 0, `Zero biryani listings assigned South Indian idli/dosa images (Found: ${biryaniIdliDosaCount})`);
check(biryaniCurryCount === 0, `Zero biryani listings assigned Curry images (Found: ${biryaniCurryCount})`);
check(biryaniValidCount === biryaniItems.length, `100% of Biryani listings resolve to verified Biryani images (${biryaniValidCount}/${biryaniItems.length})`);
check(biryaniImages.size >= 2, `Biryani images exhibit variety across listings (${biryaniImages.size} distinct photographs)`);

// ----------------------------------------------------------------
// 2. SOUTH INDIAN DISHES ACCURACY TEST
// ----------------------------------------------------------------
console.log('\n--- 2. SOUTH INDIAN DISHES RECOGNITION TEST ---');
const southIndianDishes = [
  { name: 'Crispy Butter Masala Dosa', restaurantName: 'Paradise Biryani', cuisine: 'Biryani, South Indian', category: 'indian' },
  { name: 'Steamed Idli Sambar (4 pcs)', restaurantName: 'Royal Biryani House', cuisine: 'South Indian, Fast Food', category: 'indian' },
  { name: 'Medu Vada with Chutney', restaurantName: 'Biryani Express Hub', cuisine: 'South Indian', category: 'indian' },
  { name: 'Onion Tomato Uttapam', restaurantName: 'Bawarchi Biryani Centre', cuisine: 'South Indian', category: 'indian' },
  { name: 'Kerala Appam with Stew', restaurantName: 'Malabar Biryani Hub', cuisine: 'South Indian, Biryani', category: 'indian' },
  { name: 'Puttu and Kadala Curry', restaurantName: 'Unique Biryani Villa', cuisine: 'South Indian', category: 'indian' }
];

let southIndianPass = true;
southIndianDishes.forEach(dish => {
  const img = resolveFoodImage(dish);
  const isSouthPool = IMAGE_POOLS.indian_south.includes(img);
  const isBiryaniPool = IMAGE_POOLS.biryani.includes(img);
  console.log(`  Dish: "${dish.name.padEnd(28)}" at "${dish.restaurantName.padEnd(22)}" -> ${isSouthPool ? 'South Indian Pool (CORRECT)' : 'OTHER POOL'}`);
  if (!isSouthPool || isBiryaniPool) southIndianPass = false;
});
check(southIndianPass, 'South Indian dishes (idli, dosa, vada, appam, puttu) strictly map to South Indian images, even when restaurant/cuisine has "Biryani"');

// ----------------------------------------------------------------
// 3. MULTI-CUISINE & COMPOUND DISH NAME TEST
// ----------------------------------------------------------------
console.log('\n--- 3. MULTI-CUISINE & COMPOUND DISH NAME TEST ---');
const compoundTestItems = [
  { id: 'test-paneer-biryani', name: 'Jumbo Paneer Biryani [Serves 5]', cuisine: 'Chinese', category: 'biryani' },
  { id: 'test-curry-biryani', name: 'KTR Biryani and Curry', cuisine: 'Curry, Indian', category: 'biryani' },
  { id: 'test-pizza-paneer', name: 'Tandoor Paneer Pizza', cuisine: 'Chinese', category: 'pizza' },
  { id: 'test-burger-combo', name: 'Double Smash Cheeseburger Combo', cuisine: 'American, Fast Food', category: 'burgers' }
];

const imgPaneerBiryani = resolveFoodImage(compoundTestItems[0]);
const imgCurryBiryani = resolveFoodImage(compoundTestItems[1]);
const imgPaneerPizza = resolveFoodImage(compoundTestItems[2]);
const imgBurgerCombo = resolveFoodImage(compoundTestItems[3]);

check(IMAGE_POOLS.biryani.includes(imgPaneerBiryani), 'Paneer Biryani maps to Biryani photography (not paneer butter masala curry)');
check(IMAGE_POOLS.biryani.includes(imgCurryBiryani), 'Biryani and Curry listing maps to Biryani photography (not curry)');
check(IMAGE_POOLS.pizza_general.includes(imgPaneerPizza) || IMAGE_POOLS.pizza_margherita.includes(imgPaneerPizza), 'Tandoor Paneer Pizza maps to Pizza photography (not curry)');
check(IMAGE_POOLS.burgers.includes(imgBurgerCombo), 'Cheeseburger combo maps to Burger photography (not order dispatch)');

// ----------------------------------------------------------------
// 4. CHINESE CATEGORY IMAGE DIVERSITY TEST
// ----------------------------------------------------------------
console.log('\n--- 4. CHINESE CATEGORY IMAGE DIVERSITY TEST ---');
const chineseItems = dataService.getFoodItems({ category: 'chinese' });
console.log(`Total Chinese items: ${chineseItems.length}`);

const chineseImageSet = new Set();
chineseItems.forEach(item => {
  chineseImageSet.add(resolveFoodImage(item));
});

console.log(`Distinct image URLs used across Chinese items: ${chineseImageSet.size}`);
check(chineseImageSet.size >= 4, `Chinese category diversity: ≥4 distinct dish images (Found: ${chineseImageSet.size})`);

// ----------------------------------------------------------------
// 5. CATEGORY-BY-CATEGORY VARIETY TEST
// ----------------------------------------------------------------
console.log('\n--- 5. CATEGORY-BY-CATEGORY VARIETY TEST ---');
const categories = ['biryani', 'pizza', 'burgers', 'indian', 'desserts', 'beverages'];

categories.forEach(cat => {
  const items = dataService.getFoodItems({ category: cat });
  const imgSet = new Set(items.map(it => resolveFoodImage(it)));
  const passes = imgSet.size >= 2;
  console.log(`  [Category] ${cat.padEnd(12)} -> ${items.length.toString().padStart(2)} items | ${imgSet.size.toString().padStart(2)} distinct images | Status: ${passes ? 'PASS' : 'FAIL'}`);
  check(passes, `Category "${cat}" provides varied food photography`);
});

// ----------------------------------------------------------------
// 6. DETERMINISTIC STABILITY TEST
// ----------------------------------------------------------------
console.log('\n--- 6. DETERMINISTIC STABILITY TEST ---');
const sample = chineseItems[0];
const img1 = resolveFoodImage(sample);
const img2 = resolveFoodImage(sample);
check(img1 === img2, `Image resolver is deterministic across repeated calls for "${sample.name}"`);

// ----------------------------------------------------------------
// 7. FALLBACK INTEGRITY & PLACEHOLDER TEST
// ----------------------------------------------------------------
console.log('\n--- 7. FALLBACK INTEGRITY & PLACEHOLDER TEST ---');
const weirdItem = { name: 'XYZ Mystery Unknown Item 12345', cuisine: 'None', recordType: 'unknown' };
const fallbackImg = resolveFoodImage(weirdItem);
check(fallbackImg === BRANDED_FALLBACK_SVG, 'Unknown non-matching item resolves cleanly to neutral BRANDED_FALLBACK_SVG placeholder');

// Priority 1 verification test:
const verifiedCustomItem = { name: 'Special Item', category: 'biryani', verifiedImage: 'https://example.com/custom_verified_biryani.jpg' };
check(resolveFoodImage(verifiedCustomItem) === 'https://example.com/custom_verified_biryani.jpg', 'Priority 1: Explicit verified dish image is returned verbatim');

// Priority 2 verification test:
const localAssetItem = { name: 'Local Item', category: 'biryani', localImage: '/images/dishes/local_biryani.jpg' };
check(resolveFoodImage(localAssetItem) === '/images/dishes/local_biryani.jpg', 'Priority 2: Local category asset is returned verbatim');

console.log('\n====================================================');
console.log(`OVERALL IMAGE RESOLUTION STATUS: ${allPassed ? '✅ ALL CHECKS PASSED' : '❌ SOME CHECKS FAILED'}`);
console.log('====================================================\n');

if (!allPassed) {
  process.exit(1);
}
