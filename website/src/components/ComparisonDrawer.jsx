import React from 'react';
import { formatINR, formatMoney } from '../utils/currency';
import { evaluateComparisonGroup } from '../utils/comparisonEngine';
import FoodImage from './FoodImage';

export default function ComparisonDrawer({ food, isOpen, onClose }) {
  if (!isOpen || !food) return null;

  const isOrderDispatch = food.recordType === 'order_dispatch';

  // Construct raw offers: use comparisonOffers if present, else create a single-platform entry
  const rawOffers = (food.comparisonOffers && food.comparisonOffers.length > 0)
    ? food.comparisonOffers
    : [{
        platform: food.platformName || food.platform,
        platformId: food.platformId || food.platform,
        restaurantName: food.restaurantName || food.name,
        city: food.city || 'Regional Area',
        sourcePrice: food.price,
        sourceCurrency: food.sourceCurrency || 'INR',
        discountAmount: 0,
        discountLabel: food.offer || null,
        discountVerified: false,
        deliveryFee: food.deliveryFee !== undefined ? food.deliveryFee : null,
        serviceFee: food.serviceFee !== undefined ? food.serviceFee : null,
        deliveryTime: food.deliveryTime || 'N/A',
        rating: food.rating,
        notes: `Direct authentic listing from ${food.platformName || 'platform'} dataset.`
      }];

  // Dynamically evaluate all offers with strict math, separate criteria, and market disclosures
  const { evaluatedOffers: offers, summary } = evaluateComparisonGroup(rawOffers, food);

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="comparison-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            backgroundColor: '#FFFFFF',
            zIndex: 10
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-coral">
                {isOrderDispatch ? 'Order Dispatch Analysis' : 'Cross-Platform True Cost'}
              </span>
              {summary.isLocalComparison ? (
                <span className="badge badge-green" style={{ fontSize: 11 }}>
                  ✓ Local Like-for-Like Comparison
                </span>
              ) : summary.availableOffersCount > 1 ? (
                <span className="badge badge-amber" style={{ fontSize: 11 }}>
                  🌐 Cross-Market Benchmark
                </span>
              ) : (
                <span className="badge" style={{ fontSize: 11, backgroundColor: '#F1F5F9', color: '#475569' }}>
                  Single Platform Record
                </span>
              )}
              <span style={{ fontSize: 11, color: 'var(--green-600)', fontWeight: 600 }}>
                ✓ Indian Rupees (₹ INR)
              </span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
              {food.name}
            </h2>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {food.restaurantName} &bull; {food.cuisine} &bull; {food.city}
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-sm"
            style={{ borderRadius: '50%', width: 34, height: 34, padding: 0, fontSize: 16 }}
            aria-label="Close Comparison"
          >
            ✕
          </button>
        </div>

        {/* Selected Item Overview */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-app)' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
              <FoodImage item={food} alt={food.name} />
            </div>
            <div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {food.description || (
                  isOrderDispatch
                    ? `Fulfillment order record from DoorDash delivery runs in ${food.city}. Represents an entire multi-item delivery trip.`
                    : `Authentic food item record from ${food.platformName} catalog with verified rating and location coverage.`
                )}
              </p>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                Source Record: <code>{food.sourceFile || 'Cleaned Research Dataset'}</code>
                {food.sourceCurrency !== 'INR' && (
                  <span style={{ marginLeft: 8, color: 'var(--navy-700)', fontWeight: 600 }}>
                    (Original: {food.sourceCurrency})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* If Order Dispatch (DoorDash) */}
        {isOrderDispatch ? (
          <div style={{ padding: '24px' }}>
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                marginBottom: 20
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                📋 Order-Level Dispatch Metadata
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
                The DoorDash dataset contains fulfillment metrics for whole deliveries rather than itemized menus. Below is the verified dispatch breakdown converted to Indian Rupees (₹):
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                <div style={{ padding: 12, backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid var(--border-default)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Order Basket Subtotal</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
                    {formatMoney(food.price, food.sourceCurrency).inrText}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                    Original: ${Number(food.price).toFixed(2)} USD
                  </div>
                </div>

                <div style={{ padding: 12, backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid var(--border-default)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Estimated Delivery Fee</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
                    {formatINR(food.deliveryFeeINR)}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                    Original: ${Number(food.deliveryFee).toFixed(2)} USD
                  </div>
                </div>

                <div style={{ padding: 12, backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid var(--border-default)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Fulfillment Duration</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
                    {food.deliveryTime}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                    Confirm-to-deliver turnaround
                  </div>
                </div>

                <div style={{ padding: 12, backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid var(--border-default)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Dasher Rating</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
                    ★ {food.rating ? Number(food.rating).toFixed(1) : 'Not rated'}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                    {food.ratingCount}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                ℹ️ <em>Note: Menu item comparison is disabled for this record because individual dish lines are not provided in the source DoorDash dataset.</em>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Calculation Formula Banner */}
            <div
              style={{
                margin: '16px 24px 8px',
                padding: '12px 16px',
                backgroundColor: 'var(--coral-50)',
                border: '1px solid var(--coral-200)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--coral-700)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Standardized INR Cost Formula
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-primary)', marginTop: 2, fontWeight: 600 }}>
                Estimated Final Cost (₹) = Item Price + Delivery Fee + Service Fee - Verified Discount
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                Foreign datasets (USD, PKR) converted at benchmark exchange rates (1 USD ≈ ₹83.50, 1 PKR ≈ ₹0.30). Unrecorded fees or discounts are strictly disclosed.
              </div>
            </div>

            {/* Geographic & Cross-Market Disclosures (Requirement 3 & 4) */}
            {!summary.isLocalComparison && summary.availableOffersCount > 1 ? (
              <div
                style={{
                  margin: '12px 24px 0',
                  padding: '12px 16px',
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FCD34D',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#92400E' }}>
                  <span>🌐 Cross-Market / Cross-City Research Benchmark</span>
                </div>
                <p style={{ fontSize: 12, color: '#78350F', marginTop: 4, lineHeight: 1.45, marginBottom: 0 }}>
                  {summary.marketDisclosure} {summary.productDisclosure}
                </p>
              </div>
            ) : summary.canRecommendLowest ? (
              <div
                style={{
                  margin: '12px 24px 0',
                  padding: '10px 16px',
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>✓ Verified Lowest Cost Analysis</span>
                </div>
                <p style={{ fontSize: 12, color: '#14532D', marginTop: 2, marginBottom: 0 }}>
                  {summary.recommendationNotice}
                </p>
              </div>
            ) : (
              <div
                style={{
                  margin: '12px 24px 0',
                  padding: '10px 16px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>ℹ️ Comparison Scope Notice</span>
                </div>
                <p style={{ fontSize: 12, color: '#475569', marginTop: 2, marginBottom: 0 }}>
                  {summary.recommendationNotice}
                </p>
              </div>
            )}

            {/* Platform Offer Cards List */}
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Platform Price Breakdowns ({offers.filter(o => o.isAvailable).length} Available, {summary.verifiedOffersCount} Complete)
              </h3>

              {offers.map((offer, idx) => {
                const isUnavailable = !offer.isAvailable;
                const cost = offer.cost;
                const priceFormatted = !isUnavailable ? formatMoney(offer.sourcePrice, offer.sourceCurrency) : null;

                return (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid',
                      borderColor: offer.isLowestTotal ? 'var(--green-600)' : 'var(--border-default)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '18px',
                      backgroundColor: isUnavailable ? 'var(--bg-subtle)' : '#FFFFFF',
                      boxShadow: offer.isLowestTotal ? 'var(--shadow-sm)' : 'none',
                      position: 'relative'
                    }}
                  >
                    {/* Highlights Badges Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: 'var(--text-primary)'
                          }}
                        >
                          {offer.platform}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          &bull; {offer.restaurantName}
                          {offer.city && (
                            <span style={{ marginLeft: 4, color: 'var(--text-secondary)', fontWeight: 600 }}>
                              ({offer.city})
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Dynamic Badges Derived from Actual Calculations */}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {offer.isLowestTotal && (
                          <span className="badge badge-green">★ Lowest Verified Total</span>
                        )}
                        {offer.isTiedLowest && (
                          <span className="badge badge-green">★ Tied Lowest Total</span>
                        )}
                        {offer.isBestDiscount && (
                          <span className="badge badge-coral">🏷️ Best Discount</span>
                        )}
                        {offer.isFastestDelivery && (
                          <span className="badge badge-blue">⚡ Fastest ({offer.deliveryTime})</span>
                        )}
                        {offer.isHighestRating && (
                          <span className="badge badge-amber">★ Top Rated</span>
                        )}
                        {cost && !cost.isComplete && !isUnavailable && (
                          <span className="badge" style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontSize: 10 }}>
                            Partial Estimate
                          </span>
                        )}
                        {offer.isSoleVerifiedOffer && (
                          <span className="badge" style={{ backgroundColor: '#F1F5F9', color: '#475569', fontSize: 10 }}>
                            Single Verified Offer
                          </span>
                        )}
                      </div>
                    </div>

                    {isUnavailable ? (
                      <div style={{ padding: '10px 0', color: 'var(--text-muted)', fontSize: 12, fontStyle: 'italic' }}>
                        {offer.notes}
                      </div>
                    ) : (
                      <div>
                        {/* Breakdown Grid in INR */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                            gap: 12,
                            padding: '12px 0',
                            borderTop: '1px solid var(--border-light)',
                            borderBottom: '1px solid var(--border-light)',
                            marginBottom: 12
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Listed Price</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                              {priceFormatted.inrText}
                            </div>
                            {priceFormatted.isConverted && (
                              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                                ({priceFormatted.originalText})
                              </div>
                            )}
                          </div>

                          <div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Verified Discount</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: cost.discountINR > 0 ? 'var(--green-600)' : 'var(--text-muted)' }}>
                              {cost.discountINR > 0 ? `-${formatINR(cost.discountINR)}` : 'None'}
                            </div>
                            {offer.discountLabel && (
                              <div style={{ fontSize: 10, color: 'var(--coral-700)' }}>
                                {offer.discountLabel}
                              </div>
                            )}
                          </div>

                          <div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Delivery Fee</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
                              {cost.deliveryFeeINR !== null ? formatINR(cost.deliveryFeeINR) : 'Unrecorded'}
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Service Fee</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
                              {cost.serviceFeeINR !== null ? formatINR(cost.serviceFeeINR) : 'Unrecorded'}
                            </div>
                          </div>
                        </div>

                        {/* Final Estimated Cost Row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                          <div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Estimated Final Cost</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                              <span style={{ fontSize: 22, fontWeight: 800, color: offer.isLowestTotal ? 'var(--green-600)' : 'var(--text-primary)' }}>
                                {cost.totalFormatted}
                              </span>
                              {!cost.isComplete && (
                                <span style={{ fontSize: 11, color: 'var(--amber-600)', fontWeight: 600 }}>
                                  (Excludes unrecorded delivery fee)
                                </span>
                              )}
                            </div>
                          </div>

                          <div style={{ textAlign: 'right', fontSize: 12 }}>
                            <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                              ⏱ {offer.deliveryTime}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                              ★ {offer.rating ? `${Number(offer.rating).toFixed(1)}/5.0` : 'No rating'}
                            </div>
                          </div>
                        </div>

                        {/* Warning if fee unrecorded */}
                        {cost.warning && (
                          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--amber-600)', backgroundColor: 'var(--amber-50)', padding: '5px 8px', borderRadius: 4 }}>
                            ⚠️ {cost.warning}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Precision Details Table with strictly INR values */}
            <div style={{ padding: '16px 24px 36px', borderTop: '1px solid var(--border-default)', backgroundColor: 'var(--bg-app)' }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                Precision Comparison Matrix (All figures standardized in ₹ INR)
              </h4>

              <div style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase' }}>
                      <th style={{ padding: '8px 10px' }}>Platform</th>
                      <th style={{ padding: '8px 10px' }}>Restaurant & Market</th>
                      <th style={{ padding: '8px 10px' }}>Base (INR)</th>
                      <th style={{ padding: '8px 10px' }}>Delivery</th>
                      <th style={{ padding: '8px 10px' }}>Discount</th>
                      <th style={{ padding: '8px 10px' }}>Est. Total</th>
                      <th style={{ padding: '8px 10px' }}>Turnaround</th>
                      <th style={{ padding: '8px 10px' }}>Rating</th>
                      <th style={{ padding: '8px 10px' }}>Recommendation Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.filter(o => o.isAvailable).map((o, idx) => {
                      const cost = o.cost;
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: o.isLowestTotal ? 'rgba(34, 197, 94, 0.04)' : 'transparent' }}>
                          <td style={{ padding: '8px 10px', fontWeight: 700 }}>{o.platform}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--text-secondary)' }}>
                            {o.restaurantName}
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{o.city || food.city}</div>
                          </td>
                          <td style={{ padding: '8px 10px' }}>{formatINR(cost.priceINR)}</td>
                          <td style={{ padding: '8px 10px' }}>
                            {cost.deliveryFeeINR !== null ? formatINR(cost.deliveryFeeINR) : 'Unrecorded'}
                          </td>
                          <td style={{ padding: '8px 10px', color: 'var(--green-600)' }}>
                            {cost.discountINR > 0 ? `-${formatINR(cost.discountINR)}` : '—'}
                          </td>
                          <td style={{ padding: '8px 10px', fontWeight: 800, color: o.isLowestTotal ? 'var(--green-600)' : 'var(--text-primary)' }}>
                            {cost.totalFormatted}
                          </td>
                          <td style={{ padding: '8px 10px' }}>{o.deliveryTime}</td>
                          <td style={{ padding: '8px 10px' }}>★ {o.rating || '—'}</td>
                          <td style={{ padding: '8px 10px' }}>
                            {o.isLowestTotal ? (
                              <span style={{ color: 'var(--green-600)', fontWeight: 700 }}>★ Lowest Total</span>
                            ) : o.isTiedLowest ? (
                              <span style={{ color: 'var(--green-600)', fontWeight: 700 }}>★ Tied Lowest</span>
                            ) : o.isBestDiscount ? (
                              <span style={{ color: 'var(--coral-700)', fontWeight: 600 }}>Best Discount</span>
                            ) : o.isFastestDelivery ? (
                              <span style={{ color: 'var(--blue-600)', fontWeight: 600 }}>Fastest</span>
                            ) : !cost.isComplete ? (
                              <span style={{ color: 'var(--amber-600)', fontSize: 11 }}>Incomplete Fee</span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>Verified Quote</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
