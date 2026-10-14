/**
 * Centralized Currency Formatting & Conversion Utility
 * FoodCompare Platform
 * 
 * Standards:
 * - Uses Indian English locale ('en-IN') and INR currency ('₹')
 * - Preserves original source currency and value in metadata
 * - Converts known currencies (USD, PKR) to INR using an explicit exchange rate configuration
 * - Prevents combining unconverted or unknown currencies
 */

export const CURRENCY_CONFIG = {
  targetCurrency: 'INR',
  targetLocale: 'en-IN',
  asOfDate: '2026-10-13',
  sourceAssumptions: {
    swiggy: { currency: 'INR', region: 'India', note: 'Native Indian Rupees' },
    zomato: { currency: 'INR', region: 'India', note: 'Native Indian Rupees' },
    grubhub: { currency: 'USD', region: 'United States', note: 'US Dollars' },
    doordash: { currency: 'USD', region: 'United States', note: 'US Dollars' },
    foodpanda: { currency: 'PKR', region: 'Pakistan / South Asia', note: 'Pakistani Rupees' }
  },
  // Benchmark exchange rates as of October 2026
  exchangeRatesToINR: {
    INR: 1.0,
    USD: 83.50, // 1 USD ≈ 83.50 INR
    PKR: 0.30   // 1 PKR ≈ 0.30 INR
  },
  disclaimer: 'Currency conversions reflect historical benchmark rates as of October 2026 (1 USD ≈ ₹83.50, 1 PKR ≈ ₹0.30). Original source values are preserved.'
};

/**
 * Format an amount in INR using en-IN locale
 * @param {number|null} amount - Amount in INR
 * @param {Object} options - Formatting options
 * @returns {string} e.g. "₹1,250" or "₹1,250.50"
 */
export function formatINR(amount, { showDecimals = 'auto', showSymbol = true } = {}) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Currency unavailable';
  }

  const num = Number(amount);
  const hasDecimals = num % 1 !== 0;

  let minDec = 0;
  let maxDec = 0;

  if (showDecimals === true) {
    minDec = 2;
    maxDec = 2;
  } else if (showDecimals === 'auto') {
    if (hasDecimals) {
      minDec = 2;
      maxDec = 2;
    } else {
      minDec = 0;
      maxDec = 0;
    }
  }

  try {
    const formatted = new Intl.NumberFormat(CURRENCY_CONFIG.targetLocale, {
      style: showSymbol ? 'currency' : 'decimal',
      currency: CURRENCY_CONFIG.targetCurrency,
      minimumFractionDigits: minDec,
      maximumFractionDigits: maxDec
    }).format(num);

    return formatted;
  } catch (e) {
    // Fallback if Intl fails
    const parts = num.toFixed(maxDec).split('.');
    const intPart = parts[0];
    const decPart = parts.length > 1 ? `.${parts[1]}` : '';
    return `${showSymbol ? '₹' : ''}${intPart}${decPart}`;
  }
}

/**
 * Convert a monetary amount from a known currency into INR
 * @param {number|null} amount - Original monetary amount
 * @param {string} fromCurrency - Currency code ('INR', 'USD', 'PKR')
 * @returns {number|null} Converted amount in INR, or null if currency is unknown
 */
export function convertToINR(amount, fromCurrency = 'INR') {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return null;
  }

  const curr = String(fromCurrency).toUpperCase();
  const rate = CURRENCY_CONFIG.exchangeRatesToINR[curr];

  if (!rate) {
    // Unknown or unsupported currency
    return null;
  }

  const inrVal = Number(amount) * rate;
  return Number(inrVal.toFixed(2));
}

/**
 * Format any value into INR while providing source currency context
 * @param {number|null} amount - Source value
 * @param {string} fromCurrency - Source currency code ('INR', 'USD', 'PKR')
 * @returns {Object} { inrText: string, originalText: string, isConverted: boolean, rateUsed: number|null }
 */
export function formatMoney(amount, fromCurrency = 'INR') {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return {
      inrText: 'Currency unavailable',
      originalText: 'N/A',
      isConverted: false,
      rateUsed: null
    };
  }

  const curr = String(fromCurrency).toUpperCase();
  const rate = CURRENCY_CONFIG.exchangeRatesToINR[curr];

  if (!rate) {
    return {
      inrText: 'Currency unavailable',
      originalText: `${amount} (${curr})`,
      isConverted: false,
      rateUsed: null
    };
  }

  const inrAmount = Number(amount) * rate;
  const inrFormatted = formatINR(inrAmount);

  let originalFormatted = '';
  if (curr === 'USD') {
    originalFormatted = `$${Number(amount).toFixed(2)} USD`;
  } else if (curr === 'PKR') {
    originalFormatted = `₨${Number(amount).toLocaleString()} PKR`;
  } else {
    originalFormatted = formatINR(amount);
  }

  return {
    inrText: inrFormatted,
    originalText: originalFormatted,
    isConverted: curr !== 'INR',
    rateUsed: rate
  };
}

/**
 * Safely compute estimated final cost strictly in INR
 * Ensures all elements are converted before summation, or flags unknown currencies
 */
export function calculateTrueFinalCostINR({
  itemPrice,
  itemCurrency = 'INR',
  deliveryFee = null,
  deliveryCurrency = 'INR',
  serviceFee = null,
  serviceCurrency = 'INR',
  otherCharges = null,
  otherCurrency = 'INR',
  discountAmount = 0,
  discountCurrency = 'INR'
}) {
  const convertedPrice = convertToINR(itemPrice, itemCurrency);
  if (convertedPrice === null) {
    return {
      totalINR: null,
      totalFormatted: 'Currency unavailable',
      isComplete: false,
      warning: 'Item price currency is unknown; cannot compute final total.'
    };
  }

  let total = convertedPrice;
  let isComplete = true;
  let warnings = [];

  // Delivery Fee
  if (deliveryFee !== null && deliveryFee !== undefined) {
    const convDel = convertToINR(deliveryFee, deliveryCurrency);
    if (convDel !== null) {
      total += convDel;
    } else {
      isComplete = false;
      warnings.push('Delivery fee currency could not be converted.');
    }
  } else {
    isComplete = false;
    warnings.push('Delivery fee not recorded in dataset.');
  }

  // Service Fee
  if (serviceFee !== null && serviceFee !== undefined) {
    const convSvc = convertToINR(serviceFee, serviceCurrency);
    if (convSvc !== null) {
      total += convSvc;
    }
  }

  // Other Charges
  if (otherCharges !== null && otherCharges !== undefined) {
    const convOth = convertToINR(otherCharges, otherCurrency);
    if (convOth !== null) {
      total += convOth;
    }
  }

  // Discount
  if (discountAmount && discountAmount > 0) {
    const convDisc = convertToINR(discountAmount, discountCurrency);
    if (convDisc !== null) {
      total = Math.max(0, total - convDisc);
    }
  }

  return {
    totalINR: Number(total.toFixed(2)),
    totalFormatted: formatINR(total),
    isComplete,
    warning: warnings.length > 0 ? warnings.join(' ') : null
  };
}
