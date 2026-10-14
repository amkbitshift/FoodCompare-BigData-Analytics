import {
  convertToINR,
  formatINR,
  formatMoney,
  CURRENCY_CONFIG,
  calculateTrueFinalCostINR
} from '../website/src/utils/currency.js';

console.log('====================================================');
console.log('💰 AUDIT PART 2: CURRENCY CONVERSION & EDGE CASES');
console.log('====================================================');

// Test 1: Native INR formatting
const inrTest = formatINR(250.5);
console.log('formatINR(250.5):', inrTest, '->', inrTest.includes('₹') ? 'PASS' : 'FAIL');

// Test 2: Standard conversion USD -> INR
const usdInr = convertToINR(10, 'USD');
console.log('convertToINR(10, "USD"):', usdInr, '(Expected: 835.00) ->', usdInr === 835 ? 'PASS' : 'FAIL');

// Test 3: Standard conversion PKR -> INR
const pkrInr = convertToINR(1000, 'PKR');
console.log('convertToINR(1000, "PKR"):', pkrInr, '(Expected: 300.00) ->', pkrInr === 300 ? 'PASS' : 'FAIL');

// Test 4: Unknown currency safety (must return null, never silently convert)
const eurInr = convertToINR(10, 'EUR');
console.log('convertToINR(10, "EUR") [Unknown]:', eurInr, '->', eurInr === null ? 'PASS' : 'FAIL');

const xyzInr = convertToINR(10, 'XYZ');
console.log('convertToINR(10, "XYZ") [Unknown]:', xyzInr, '->', xyzInr === null ? 'PASS' : 'FAIL');

// Test 5: formatMoney traceability
const fmUsd = formatMoney(14.50, 'USD');
console.log('formatMoney(14.50, "USD"):', fmUsd);
const fmTrace = fmUsd.inrText.includes('₹') && fmUsd.originalText.includes('$14.50 USD') && fmUsd.isConverted === true;
console.log('USD Traceability check:', fmTrace ? 'PASS' : 'FAIL');

// Test 6: Incomplete breakdown calculation (missing delivery fee)
const calcIncomplete = calculateTrueFinalCostINR({
  itemPrice: 200,
  itemCurrency: 'INR',
  deliveryFee: null,
  discountAmount: 20
});
console.log('calculateTrueFinalCostINR without deliveryFee:', calcIncomplete);
console.log('isComplete flag false when fee missing:', calcIncomplete.isComplete === false ? 'PASS' : 'FAIL');
console.log('Warning present:', calcIncomplete.warning ? 'PASS' : 'FAIL');

// Test 7: Unknown currency in calculateTrueFinalCostINR
const calcUnknown = calculateTrueFinalCostINR({
  itemPrice: 200,
  itemCurrency: 'GBP'
});
console.log('calculateTrueFinalCostINR with unknown currency:', calcUnknown);
console.log('Returns null total for unknown currency:', calcUnknown.totalINR === null ? 'PASS' : 'FAIL');

console.log('\nALL CURRENCY CHECKS COMPLETED.');
