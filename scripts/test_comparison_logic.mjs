/**
 * FoodCompare — Comparison & Recommendation Regression Test Suite
 * 
 * Verifies that:
 * 1. Given totals of ₹1,649.13 (Grubhub) and ₹160 (Swiggy), the ₹160 option strictly wins
 *    the lowest-cost comparison, and the higher total is NEVER labeled cheapest.
 * 2. Discounts are subtracted only once and totals cannot become negative.
 * 3. Unverified discounts are not deducted.
 * 4. Unknown/unrecorded fees mark totals as incomplete and exclude them from fully verified cheapest claims.
 * 5. Ties are correctly flagged for identical lowest totals.
 * 6. Single or empty comparison sets do not make unsupported cheapest claims.
 * 7. Best Discount ranks purely by verified discount savings, independent of final cost.
 * 8. Fastest Delivery ranks purely by delivery time turnaround.
 * 9. Best Deals sorting orders strictly by selected criterion.
 * 10. Cross-market / cross-city benchmarks are explicitly disclosed.
 */

import {
  evaluateComparisonGroup,
  calculateOfferCost,
  calculateDealScore,
  parseDeliveryMinutes
} from '../website/src/utils/comparisonEngine.js';
import { dataService, FEATURED_COMPARISON_ITEMS } from '../website/src/services/dataService.js';

console.log('================================================================');
console.log('🧪 RUNNING COMPARISON & RECOMMENDATION REGRESSION TESTS');
console.log('================================================================');

let totalTests = 0;
let passedTests = 0;

function assert(condition, description) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${description}`);
  } else {
    console.error(`  ❌ FAIL: ${description}`);
  }
}

// ----------------------------------------------------------------
// TEST GROUP 1: THE CORE PIZZA REGRESSION (₹160 vs ₹1,649.13)
// ----------------------------------------------------------------
console.log('\n--- 1. PIZZA REGRESSION: SWIGGY (₹160) VS GRUBHUB (₹1,649.13) ---');

const pizzaItem = FEATURED_COMPARISON_ITEMS.find(i => i.id === 'compare-woodfired-pizza');
assert(Boolean(pizzaItem), 'Found featured pizza comparison item');

const pizzaEval = evaluateComparisonGroup(pizzaItem.comparisonOffers, pizzaItem);
const ghOffer = pizzaEval.evaluatedOffers.find(o => o.platformId === 'grubhub');
const swOffer = pizzaEval.evaluatedOffers.find(o => o.platformId === 'swiggy');

assert(Boolean(ghOffer) && Boolean(swOffer), 'Both Grubhub and Swiggy offers present in pizza comparison');

// Numerical costs
// Grubhub: $14.50 + $2.99 + $5.25 - $2.99 = $19.75 USD * 83.50 = ₹1,649.13
// Swiggy: 150 + 30 + 10 - 30 = ₹160
assert(Math.abs(ghOffer.cost.totalINR - 1649.13) < 0.1, `Grubhub estimated total is ₹1,649.13 (got ${ghOffer.cost.totalINR})`);
assert(Math.abs(swOffer.cost.totalINR - 160.00) < 0.1, `Swiggy estimated total is ₹160.00 (got ${swOffer.cost.totalINR})`);

// The crucial fix: ₹160 must win, ₹1,649.13 must lose
assert(swOffer.isLowestTotal === true, 'Swiggy (₹160.00) strictly wins "Lowest Verified Total"');
assert(ghOffer.isLowestTotal === false, 'Grubhub (₹1,649.13) is NEVER labeled "Lowest Verified Total"');

// Independence of criteria
// Grubhub discount: $2.99 USD * 83.50 = ₹249.67. Swiggy discount: ₹30.
assert(ghOffer.isBestDiscount === true, 'Grubhub wins "Best Discount" on discount amount (₹249.67 vs ₹30), independent of final cost');
assert(swOffer.isBestDiscount === false, 'Swiggy does not have highest discount');

// Speed: Swiggy 35 min vs Grubhub 40 min
assert(swOffer.isFastestDelivery === true, 'Swiggy (35 min) wins "Fastest Delivery" over Grubhub (40 min)');
assert(ghOffer.isFastestDelivery === false, 'Grubhub (40 min) is not fastest');

// Rating: Swiggy 3.8 vs Grubhub 3.33
assert(swOffer.isHighestRating === true, 'Swiggy (3.8) wins "Top Rated" over Grubhub (3.33)');

// Cross-market disclosure: Brooklyn, NY vs Agra, IN
assert(pizzaEval.summary.isLocalComparison === false, 'Flagged as non-local comparison (Brooklyn, NY vs Agra, IN)');
assert(pizzaEval.summary.marketDisclosure.includes('Cross-Market'), 'Includes explicit cross-market benchmark disclosure');

// ----------------------------------------------------------------
// TEST GROUP 2: DISCOUNT APPLICATION & NON-NEGATIVE TOTALS
// ----------------------------------------------------------------
console.log('\n--- 2. DISCOUNT APPLICATION & NON-NEGATIVE BOUNDS ---');

// Discount subtracted exactly once
const singleCost = calculateOfferCost({
  sourcePrice: 200,
  sourceCurrency: 'INR',
  deliveryFee: 40,
  serviceFee: 10,
  discountAmount: 50,
  discountVerified: true
});
// 200 + 40 + 10 - 50 = 200
assert(singleCost.totalINR === 200, `Discount subtracted once: 200 + 40 + 10 - 50 = 200 (got ${singleCost.totalINR})`);
assert(singleCost.discountINR === 50, 'Verified discount registered as 50 INR');

// Unverified discount must NOT be subtracted
const unverifiedCost = calculateOfferCost({
  sourcePrice: 200,
  sourceCurrency: 'INR',
  deliveryFee: 40,
  serviceFee: 10,
  discountAmount: 50,
  discountVerified: false // Unverified
});
assert(unverifiedCost.totalINR === 250, `Unverified discount NOT deducted: total remains 250 (got ${unverifiedCost.totalINR})`);
assert(unverifiedCost.discountINR === 0, 'Unverified discount INR is 0');

// Oversized discount: totals cannot become negative
const hugeDiscountCost = calculateOfferCost({
  sourcePrice: 100,
  sourceCurrency: 'INR',
  deliveryFee: 20,
  serviceFee: 10,
  discountAmount: 500, // Exceeds sum of 130
  discountVerified: true
});
assert(hugeDiscountCost.totalINR === 0, `Total bounded at 0 (never negative): got ${hugeDiscountCost.totalINR}`);

// ----------------------------------------------------------------
// TEST GROUP 3: UNKNOWN & UNRECORDED FEES
// ----------------------------------------------------------------
console.log('\n--- 3. UNKNOWN FEES & INCOMPLETE ESTIMATES ---');

const incompleteOffer = {
  platform: 'PlatformX',
  sourcePrice: 100,
  sourceCurrency: 'INR',
  deliveryFee: null, // Unrecorded delivery fee
  serviceFee: 10,
  discountAmount: 0,
  discountVerified: false
};
const incompleteCost = calculateOfferCost(incompleteOffer);
assert(incompleteCost.isComplete === false, 'Offer with unrecorded delivery fee flagged isComplete = false');
assert(incompleteCost.warning.includes('Delivery fee not recorded'), 'Warning includes delivery fee notice');

// When comparing one complete (₹180) vs one incomplete (₹100 base)
const mixedGroup = [
  {
    platform: 'A',
    sourcePrice: 150,
    sourceCurrency: 'INR',
    deliveryFee: 20,
    serviceFee: 10,
    discountVerified: true,
    discountAmount: 0 // Total = 180 (complete)
  },
  {
    platform: 'B',
    sourcePrice: 90,
    sourceCurrency: 'INR',
    deliveryFee: null, // Incomplete!
    serviceFee: null,
    discountVerified: false,
    discountAmount: 0
  }
];
const mixedEval = evaluateComparisonGroup(mixedGroup, { city: 'Test City' });
// Since only 1 offer is complete, it must NOT make an unsupported "cheapest among competitors" claim
assert(mixedEval.summary.canRecommendLowest === false, 'Cannot recommend cheapest when only 1 offer is fully verified');
assert(mixedEval.evaluatedOffers[0].isLowestTotal === false, 'Complete offer not awarded isLowestTotal when competitors have unknown fees');
assert(mixedEval.evaluatedOffers[1].isLowestTotal === false, 'Incomplete offer not awarded isLowestTotal');

// ----------------------------------------------------------------
// TEST GROUP 4: TIES HANDLING
// ----------------------------------------------------------------
console.log('\n--- 4. TIES HANDLING ---');

const tiedGroup = [
  {
    platform: 'Swiggy',
    sourcePrice: 200,
    sourceCurrency: 'INR',
    deliveryFee: 30,
    serviceFee: 10,
    discountAmount: 40,
    discountVerified: true // Total = 200
  },
  {
    platform: 'Zomato',
    sourcePrice: 180,
    sourceCurrency: 'INR',
    deliveryFee: 40,
    serviceFee: 10,
    discountAmount: 30,
    discountVerified: true // Total = 200
  }
];
const tiedEval = evaluateComparisonGroup(tiedGroup, { city: 'Mumbai, IN' });
assert(tiedEval.summary.hasTiedLowest === true, 'Detected tied lowest total');
assert(tiedEval.evaluatedOffers[0].isLowestTotal === true, 'Swiggy flagged lowest in tie');
assert(tiedEval.evaluatedOffers[0].isTiedLowest === true, 'Swiggy flagged tied in tie');
assert(tiedEval.evaluatedOffers[1].isLowestTotal === true, 'Zomato flagged lowest in tie');
assert(tiedEval.evaluatedOffers[1].isTiedLowest === true, 'Zomato flagged tied in tie');

// ----------------------------------------------------------------
// TEST GROUP 5: EMPTY & SINGLE ENTRIES
// ----------------------------------------------------------------
console.log('\n--- 5. EMPTY & SINGLE ENTRIES ---');

// Empty comparison
const emptyEval = evaluateComparisonGroup([], {});
assert(emptyEval.summary.canRecommendLowest === false, 'Empty comparison: canRecommendLowest is false');
assert(emptyEval.evaluatedOffers.length === 0, 'Empty comparison: 0 evaluated offers');

// Single valid entry
const singleGroup = [
  {
    platform: 'Swiggy',
    sourcePrice: 250,
    sourceCurrency: 'INR',
    deliveryFee: 30,
    serviceFee: 10,
    discountAmount: 20,
    discountVerified: true
  }
];
const singleEval = evaluateComparisonGroup(singleGroup, { city: 'Delhi, IN' });
assert(singleEval.summary.canRecommendLowest === false, 'Single entry: canRecommendLowest is false (cannot compare with itself)');
assert(singleEval.evaluatedOffers[0].isLowestTotal === false, 'Single entry: isLowestTotal is false');
assert(singleEval.evaluatedOffers[0].isSoleVerifiedOffer === true, 'Single entry: flagged as isSoleVerifiedOffer');

// ----------------------------------------------------------------
// TEST GROUP 6: BEST DEALS SORTING LOGIC
// ----------------------------------------------------------------
console.log('\n--- 6. BEST DEALS SORTING LOGIC ---');

// 1. Lowest Total sort
const dealsByTotal = dataService.getBestDealsINR('lowest_total');
assert(dealsByTotal.length >= 6, `Retrieved ${dealsByTotal.length} deals sorted by lowest total`);
for (let i = 0; i < dealsByTotal.length - 1; i++) {
  assert(
    dealsByTotal[i].estimatedTotalINR <= dealsByTotal[i + 1].estimatedTotalINR,
    `Ascending cost check [${i}]: ${dealsByTotal[i].estimatedTotalINR} <= ${dealsByTotal[i + 1].estimatedTotalINR}`
  );
}
assert(dealsByTotal[0].estimatedTotalINR === 160, `Lowest cost deal is ₹160 (Swiggy Pizza)`);

// 2. Highest Discount sort
const dealsByDiscount = dataService.getBestDealsINR('highest_discount');
for (let i = 0; i < dealsByDiscount.length - 1; i++) {
  assert(
    dealsByDiscount[i].discountAmountINR >= dealsByDiscount[i + 1].discountAmountINR,
    `Descending discount check [${i}]: ${dealsByDiscount[i].discountAmountINR} >= ${dealsByDiscount[i + 1].discountAmountINR}`
  );
}
assert(Math.abs(dealsByDiscount[0].discountAmountINR - 249.67) < 0.1, `Highest discount is ₹249.67 ($2.99 USD)`);

// 3. Fastest Delivery sort
const dealsBySpeed = dataService.getBestDealsINR('fastest_delivery');
for (let i = 0; i < dealsBySpeed.length - 1; i++) {
  assert(
    dealsBySpeed[i].deliveryMinutes <= dealsBySpeed[i + 1].deliveryMinutes,
    `Ascending speed check [${i}]: ${dealsBySpeed[i].deliveryMinutes} <= ${dealsBySpeed[i + 1].deliveryMinutes}`
  );
}
assert(dealsBySpeed[0].deliveryMinutes === 31, `Fastest deal turnaround is 31 min (DoorDash)`);

// 4. Best Deal Score composite formula
const dealsByScore = dataService.getBestDealsINR('best_deal_score');
for (let i = 0; i < dealsByScore.length - 1; i++) {
  assert(
    dealsByScore[i].dealScore >= dealsByScore[i + 1].dealScore,
    `Descending deal score check [${i}]: ${dealsByScore[i].dealScore} >= ${dealsByScore[i + 1].dealScore}`
  );
}
assert(typeof dealsByScore[0].dealScore === 'number' && dealsByScore[0].dealScore > 0, `Deal score computed correctly (${dealsByScore[0].dealScore})`);

// ----------------------------------------------------------------
// TEST GROUP 7: ITEM 3 CLASSIC BURGER DYNAMIC EVALUATION
// ----------------------------------------------------------------
console.log('\n--- 7. BURGER COMPARISON: DOORDASH VS FOODPANDA ---');

const burgerItem = FEATURED_COMPARISON_ITEMS.find(i => i.id === 'compare-classic-burger');
const burgerEval = evaluateComparisonGroup(burgerItem.comparisonOffers, burgerItem);
const ddBurger = burgerEval.evaluatedOffers.find(o => o.platformId === 'doordash');
const fpBurger = burgerEval.evaluatedOffers.find(o => o.platformId === 'foodpanda');

// DoorDash: (9.99 + 2.49 + 2.10 - 2.00) * 83.50 = ₹1,050.43
// Foodpanda: (1478.27 + 60 + 25 - 150) * 0.30 = ₹423.98
assert(Math.abs(ddBurger.cost.totalINR - 1050.43) < 0.1, `DoorDash total is ₹1,050.43 (got ${ddBurger.cost.totalINR})`);
assert(Math.abs(fpBurger.cost.totalINR - 423.98) < 0.1, `Foodpanda total is ₹423.98 (got ${fpBurger.cost.totalINR})`);
assert(fpBurger.isLowestTotal === true, 'Foodpanda (₹423.98) wins Lowest Verified Total over DoorDash (₹1,050.43)');
assert(ddBurger.isLowestTotal === false, 'DoorDash (₹1,050.43) is not labeled Lowest Total');
assert(ddBurger.isBestDiscount === true, 'DoorDash ($2 = ₹167) wins Best Discount over Foodpanda (₨150 = ₹45)');
assert(ddBurger.isFastestDelivery === true, 'DoorDash (31 min) wins Fastest over Foodpanda (38 min)');

console.log('================================================================');
console.log(`TOTAL REGRESSION TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
console.log('================================================================');

if (totalTests !== passedTests) {
  process.exit(1);
} else {
  console.log('🏆 ALL COMPARISON & RECOMMENDATION TESTS PASSED 100%');
}
