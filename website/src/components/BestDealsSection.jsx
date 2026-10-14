import React, { useState } from 'react';
import { dataService } from '../services/dataService';
import { formatINR } from '../utils/currency';
import FoodImage from './FoodImage';

export default function BestDealsSection({ onSelectFood }) {
  const [dealSort, setDealSort] = useState('lowest_total');
  const deals = dataService.getBestDealsINR(dealSort);

  const sortOptions = [
    { id: 'lowest_total', label: 'Lowest Estimated Total (₹)', desc: 'Sorted strictly by estimated final cost (INR) ascending. Lowest total wins.' },
    { id: 'highest_discount', label: 'Highest Verified Discount (₹)', desc: 'Ranked by verified discount savings (INR) descending, independent of final cost.' },
    { id: 'fastest_delivery', label: 'Fastest Delivery', desc: 'Ranked by estimated delivery turnaround in minutes ascending.' },
    { id: 'highest_rating', label: 'Highest Rating', desc: 'Ranked by customer review ratings descending.' },
    { id: 'lowest_price', label: 'Lowest Listed Base Price (₹)', desc: 'Ranked by menu base price before delivery and service fees.' },
    { id: 'best_deal_score', label: 'Best Deal Score (Composite Value)', desc: 'Ranked by transparent formula: 50% discount savings ratio + 30% rating + 20% delivery speed.' }
  ];

  const currentOption = sortOptions.find(o => o.id === dealSort) || sortOptions[0];

  const getRankBadge = (sortId) => {
    switch (sortId) {
      case 'lowest_total':
        return <span className="badge badge-green">#1 Lowest Cost</span>;
      case 'highest_discount':
        return <span className="badge badge-coral">#1 Best Discount</span>;
      case 'fastest_delivery':
        return <span className="badge badge-blue">#1 Fastest</span>;
      case 'highest_rating':
        return <span className="badge badge-amber">#1 Top Rated</span>;
      case 'best_deal_score':
        return <span className="badge badge-green">#1 Best Deal Score</span>;
      case 'lowest_price':
        return <span className="badge badge-green">#1 Lowest Base</span>;
      default:
        return <span className="badge badge-green">#1 Best Deal</span>;
    }
  };

  return (
    <section style={{ padding: '40px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-default)' }}>
      <div className="container">
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 20
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span className="badge badge-coral">Audited Platform Deals</span>
              <span style={{ fontSize: 12, color: 'var(--green-600)', fontWeight: 600 }}>
                Standardized in Indian Rupees (₹)
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Best Verified Food Deals Across Platforms
            </h2>
            <p className="text-muted" style={{ fontSize: 13, marginTop: 4 }}>
              {currentOption.desc}
            </p>
          </div>

          {/* Sorting Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
              Rank by:
            </span>
            <select
              value={dealSort}
              onChange={(e) => setDealSort(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-app)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Deals Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20
          }}
        >
          {deals.slice(0, 6).map((deal, idx) => (
            <div
              key={idx}
              className="food-card"
              style={{
                padding: 16,
                justifyContent: 'space-between',
                border: idx === 0 ? '1.5px solid var(--green-600)' : '1px solid var(--border-default)'
              }}
            >
              <div>
                {/* Platform Badge & Rank */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span className={`platform-pill platform-${deal.platformId}`}>
                    {deal.platform}
                  </span>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {idx === 0 && getRankBadge(dealSort)}
                    {dealSort === 'best_deal_score' && deal.dealScore && (
                      <span className="badge" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', fontSize: 10 }}>
                        Score: {deal.dealScore}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                    <FoodImage item={{ id: deal.foodId, name: deal.foodName, category: deal.category }} alt={deal.foodName} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>
                      {deal.foodName}
                    </h4>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {deal.restaurantName}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                      📍 {deal.city}
                    </div>
                  </div>
                </div>

                {/* Offer Pill */}
                {deal.discountLabel ? (
                  <div
                    style={{
                      backgroundColor: 'var(--coral-50)',
                      border: '1px solid var(--coral-200)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '5px 8px',
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--coral-700)',
                      marginBottom: 12
                    }}
                  >
                    🏷️ {deal.discountLabel}
                    {deal.discountAmountINR > 0 && (
                      <span style={{ marginLeft: 4, color: 'var(--green-600)' }}>
                        (Save {formatINR(deal.discountAmountINR)})
                      </span>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, fontStyle: 'italic' }}>
                    Standard listed menu price
                  </div>
                )}
              </div>

              {/* Price & Turnaround Row */}
              <div
                style={{
                  paddingTop: 12,
                  borderTop: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Est. Final Cost</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
                    {deal.estimatedTotalFormatted}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    ⏱ {deal.deliveryTime} &bull; ★ {deal.rating ? Number(deal.rating).toFixed(1) : '—'}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const item = dataService.getItemById(deal.foodId);
                    if (item) onSelectFood(item);
                  }}
                  className="btn btn-sm btn-outline-coral"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
