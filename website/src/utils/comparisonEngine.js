/**
 * FoodCompare — Comparison & Recommendation Engine
 * 
 * Provides dynamic, mathematically rigorous cross-platform comparison,
 * ensuring lowest-cost recommendations are strictly derived from verified totals,
 * separate from discount and speed rankings, with transparent cross-market disclosures.
 */

import { convertToINR, formatINR, calculateTrueFinalCostINR } from './currency.js';

/**
 * Standardize platform identifiers
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
 * Parse human delivery turnaround strings into numeric minutes for sorting and comparison
 * e.g. "35 mins" -> 35, "40.0 min" -> 40, "28-35 min" -> 31.5
 */
export function parseDeliveryMinutes(timeStr) {
  if (typeof timeStr === 'number' && !isNaN(timeStr)) {
    return timeStr;
  }
  if (!timeStr || typeof timeStr !== 'string') {
    return null;
  }

  const s = timeStr.trim().toLowerCase();
  if (s === 'n/a' || s === 'unavailable' || s === 'not rated') {
    return null;
  }

  // Check for range like "28-35 min" or "32-42 min"
  const rangeMatch = s.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/);
  if (rangeMatch) {
    const low = parseFloat(rangeMatch[1]);
    const high = parseFloat(rangeMatch[2]);
    if (!isNaN(low) && !isNaN(high)) {
      return Number(((low + high) / 2).toFixed(1));
    }
  }

  // Check for single number like "35 mins", "40.0 min"
  const singleMatch = s.match(/(\d+(?:\.\d+)?)/);
  if (singleMatch) {
    const val = parseFloat(singleMatch[1]);
    return isNaN(val) ? null : val;
  }

  return null;
}

/**
 * Safely compute cost breakdown for a single offer in INR
 * Ensures discounts are subtracted only once and totals cannot become negative.
 */
export function calculateOfferCost(offer) {
  if (!offer || offer.sourcePrice === null || offer.sourcePrice === undefined || isNaN(offer.sourcePrice)) {
    return {
      priceINR: null,
      deliveryFeeINR: null,
      serviceFeeINR: null,
      discountINR: 0,
      totalINR: null,
      totalFormatted: 'Price not available',
      formula: 'Not listed on platform',
      isComplete: false,
      warning: 'This platform does not service this region or item.',
      deliveryMinutes: null,
      rating: null
    };
  }

  const curr = offer.sourceCurrency || 'INR';
  const price = Number(offer.sourcePrice);
  const delFee = offer.deliveryFee !== null && offer.deliveryFee !== undefined && !isNaN(offer.deliveryFee)
    ? Number(offer.deliveryFee)
    : null;
  const svcFee = offer.serviceFee !== null && offer.serviceFee !== undefined && !isNaN(offer.serviceFee)
    ? Number(offer.serviceFee)
    : null;

  // Only apply discount if explicitly verified
  const hasVerifiedDiscount = Boolean(offer.discountVerified && offer.discountAmount && Number(offer.discountAmount) > 0);
  const discAmount = hasVerifiedDiscount ? Number(offer.discountAmount) : 0;

  const costResult = calculateTrueFinalCostINR({
    itemPrice: price,
    itemCurrency: curr,
    deliveryFee: delFee,
    deliveryCurrency: curr,
    serviceFee: svcFee,
    serviceCurrency: curr,
    discountAmount: discAmount,
    discountCurrency: curr
  });

  const priceConv = convertToINR(price, curr);
  const delConv = delFee !== null ? convertToINR(delFee, curr) : null;
  const svcConv = svcFee !== null ? convertToINR(svcFee, curr) : null;
  const discConv = discAmount > 0 ? convertToINR(discAmount, curr) : 0;

  // An offer is strictly complete only if price and delivery fee are known and valid
  const isComplete = costResult.isComplete && delConv !== null && priceConv !== null;

  let formula = '';
  if (delConv !== null) {
    formula = `${formatINR(priceConv)} + ${formatINR(delConv)} (del) + ${formatINR(svcConv || 0)} (svc) - ${formatINR(discConv)} (disc)`;
  } else {
    formula = `${formatINR(priceConv)} - ${formatINR(discConv)} (disc) + fees [Delivery fee unrecorded]`;
  }

  const deliveryMinutes = parseDeliveryMinutes(offer.deliveryTime);
  const numRating = typeof offer.rating === 'number' && !isNaN(offer.rating)
    ? offer.rating
    : (parseFloat(offer.rating) || null);

  return {
    priceINR: priceConv,
    deliveryFeeINR: delConv,
    serviceFeeINR: svcConv,
    discountINR: discConv,
    totalINR: costResult.totalINR,
    totalFormatted: costResult.totalFormatted,
    formula,
    isComplete,
    warning: isComplete ? null : (costResult.warning || 'Delivery fee not recorded in dataset.'),
    deliveryMinutes,
    rating: numRating
  };
}

/**
 * Dynamically evaluate a group of comparison offers
 * Derives badges from real numerical values, separate criteria, and geographic disclosures.
 */
export function evaluateComparisonGroup(offers = [], foodContext = {}) {
  if (!Array.isArray(offers) || offers.length === 0) {
    return {
      evaluatedOffers: [],
      summary: {
        totalOffers: 0,
        availableOffersCount: 0,
        verifiedOffersCount: 0,
        isLocalComparison: false,
        marketDisclosure: 'No comparison offers provided for this record.',
        productDisclosure: '',
        lowestTotalValue: null,
        hasTiedLowest: false,
        canRecommendLowest: false,
        recommendationNotice: 'No comparison offers available.'
      }
    };
  }

  // 1. Enrich all offers with cost breakdowns
  const enriched = offers.map(offer => {
    const isAvailable = offer.sourcePrice !== null && offer.sourcePrice !== undefined && !isNaN(offer.sourcePrice);
    const cost = isAvailable ? calculateOfferCost(offer) : calculateOfferCost(null);
    return {
      ...offer,
      platformId: normalizePlatformId(offer.platformId || offer.platform),
      isAvailable,
      cost,
      // Clear out any hardcoded legacy flags so they can never override dynamic logic
      isLowestTotal: false,
      isTiedLowest: false,
      isBestDiscount: false,
      isFastestDelivery: false,
      isHighestRating: false,
      isSoleVerifiedOffer: false
    };
  });

  const availableOffers = enriched.filter(o => o.isAvailable && o.cost.totalINR !== null);
  const verifiedOffers = availableOffers.filter(o => o.cost.isComplete === true);

  // 2. Evaluate Geographic / Cross-Market Scope
  // Check if all available offers operate in the same city / geographic area
  const cities = availableOffers
    .map(o => (o.city || foodContext.city || '').toLowerCase().trim())
    .filter(Boolean);
  
  const uniqueCities = new Set(cities);
  const currencies = new Set(availableOffers.map(o => o.sourceCurrency || 'INR'));

  const isLocalComparison = uniqueCities.size <= 1 && currencies.size <= 1;

  let marketDisclosure = '';
  let productDisclosure = '';

  if (availableOffers.length <= 1) {
    marketDisclosure = 'Single Platform Record: This item represents an individual platform listing. Cross-platform comparisons require at least two competing platform offerings in the same service area.';
  } else if (!isLocalComparison) {
    marketDisclosure = 'Cross-Market Research Benchmark: The compared listings originate from different geographic markets, cities, or national currencies. They demonstrate international price and fee variance across platforms, NOT an interchangeable local delivery choice.';
    productDisclosure = 'Different Dining Venues: Listings represent independent restaurant kitchens with differing recipe compositions, portion sizes, and regional cost bases.';
  } else {
    marketDisclosure = `Verified Local Comparison: Competing platforms service the same metropolitan delivery area (${foodContext.city || 'Local Area'}).`;
  }

  // 3. Evaluate "Lowest Verified Total" strictly from verified complete totals
  let lowestTotalValue = null;
  let hasTiedLowest = false;
  let canRecommendLowest = false;
  let recommendationNotice = '';

  if (verifiedOffers.length >= 2) {
    canRecommendLowest = true;
    lowestTotalValue = Math.min(...verifiedOffers.map(o => o.cost.totalINR));
    
    const matchingLowest = verifiedOffers.filter(o => Math.abs(o.cost.totalINR - lowestTotalValue) < 0.01);
    hasTiedLowest = matchingLowest.length > 1;

    for (const offer of verifiedOffers) {
      if (Math.abs(offer.cost.totalINR - lowestTotalValue) < 0.01) {
        offer.isLowestTotal = true;
        offer.isTiedLowest = hasTiedLowest;
      } else {
        offer.isLowestTotal = false;
      }
    }

    if (hasTiedLowest) {
      recommendationNotice = `Multiple platforms offer the tied lowest verified total of ${formatINR(lowestTotalValue)}.`;
    } else {
      recommendationNotice = `Lowest verified total of ${formatINR(lowestTotalValue)} identified dynamically across ${verifiedOffers.length} verified platform quotes.`;
    }
  } else if (verifiedOffers.length === 1) {
    // Exactly one verified offer: cannot claim "cheapest among platforms"
    canRecommendLowest = false;
    verifiedOffers[0].isLowestTotal = false;
    verifiedOffers[0].isSoleVerifiedOffer = true;
    recommendationNotice = 'Only one platform offer has fully verified end-to-end fees. A cross-platform lowest cost recommendation requires at least two verified competitors.';
  } else {
    // 0 verified complete offers
    canRecommendLowest = false;
    recommendationNotice = 'No platform offer includes complete fee disclosures (e.g., delivery fee unrecorded). True lowest total cannot be verified.';
  }

  // 4. Evaluate "Best Discount" (Purely by verified discount amount in INR)
  const offersWithDiscount = availableOffers.filter(o => o.cost.discountINR > 0);
  if (offersWithDiscount.length > 0) {
    const maxDiscount = Math.max(...offersWithDiscount.map(o => o.cost.discountINR));
    if (maxDiscount > 0) {
      for (const offer of availableOffers) {
        if (Math.abs(offer.cost.discountINR - maxDiscount) < 0.01) {
          offer.isBestDiscount = true;
        }
      }
    }
  }

  // 5. Evaluate "Fastest Delivery" (Purely by delivery turnaround in minutes)
  const offersWithMinutes = availableOffers.filter(o => o.cost.deliveryMinutes !== null && o.cost.deliveryMinutes > 0);
  if (offersWithMinutes.length >= 2) {
    const minMinutes = Math.min(...offersWithMinutes.map(o => o.cost.deliveryMinutes));
    for (const offer of availableOffers) {
      if (offer.cost.deliveryMinutes !== null && Math.abs(offer.cost.deliveryMinutes - minMinutes) < 0.01) {
        offer.isFastestDelivery = true;
      }
    }
  }

  // 6. Evaluate "Top Rated" (Purely by rating score)
  const offersWithRating = availableOffers.filter(o => o.cost.rating !== null && o.cost.rating > 0);
  if (offersWithRating.length >= 2) {
    const maxRating = Math.max(...offersWithRating.map(o => o.cost.rating));
    for (const offer of availableOffers) {
      if (offer.cost.rating !== null && Math.abs(offer.cost.rating - maxRating) < 0.01) {
        offer.isHighestRating = true;
      }
    }
  }

  return {
    evaluatedOffers: enriched,
    summary: {
      totalOffers: offers.length,
      availableOffersCount: availableOffers.length,
      verifiedOffersCount: verifiedOffers.length,
      isLocalComparison,
      marketDisclosure,
      productDisclosure,
      lowestTotalValue,
      hasTiedLowest,
      canRecommendLowest,
      recommendationNotice
    }
  };
}

/**
 * Transparent composite scoring for "Best Deals"
 * Formula:
 * - 50% discount savings ratio
 * - 30% verified user rating
 * - 20% delivery speed factor
 */
export function calculateDealScore({ priceINR, discountINR, rating, deliveryMinutes }) {
  const basePrice = Math.max(1, priceINR || 1);
  const discount = Math.max(0, discountINR || 0);
  
  // Savings ratio score (0 - 50 points, capped at 50% discount)
  const savingsRatio = Math.min(0.5, discount / basePrice);
  const savingsScore = (savingsRatio / 0.5) * 50;

  // Rating score (0 - 30 points, based on 5-star scale)
  const validRating = typeof rating === 'number' && !isNaN(rating) ? rating : 3.5;
  const ratingScore = (validRating / 5.0) * 30;

  // Speed score (0 - 20 points, faster is better)
  const minutes = typeof deliveryMinutes === 'number' && !isNaN(deliveryMinutes) ? deliveryMinutes : 40;
  const speedScore = Math.max(0, 1 - (minutes / 60)) * 20;

  const totalScore = Number((savingsScore + ratingScore + speedScore).toFixed(1));
  return Math.max(0, Math.min(100, totalScore));
}
