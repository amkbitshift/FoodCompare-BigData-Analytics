import { dataService } from '../website/src/services/dataService.js';

console.log('====================================================');
console.log('🏷️ AUDIT PART 3: BEST DEALS VERIFICATION');
console.log('====================================================');

const sortKeys = ['lowest_total', 'highest_discount', 'lowest_price', 'highest_rating', 'fastest_delivery'];
for (const k of sortKeys) {
  const deals = dataService.getBestDealsINR(k);
  console.log(`Sort [${k.padEnd(16)}]: ${deals.length} deals returned. Top deal: "${deals[0].foodName}" (${deals[0].platform}) - Est: ${deals[0].estimatedTotalFormatted}`);
}
