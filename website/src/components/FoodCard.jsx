import React from 'react';
import { formatINR, formatMoney } from '../utils/currency';
import FoodImage from './FoodImage';

export default function FoodCard({ food, onCompare }) {
  const normPlat = food.platformId || food.platform;
  const isSwiggy = normPlat === 'swiggy';
  const isZomato = normPlat === 'zomato';
  const isGrubhub = normPlat === 'grubhub';
  const isDoorDash = normPlat === 'doordash';
  const isFoodpanda = normPlat === 'foodpanda';

  const platformClass = isSwiggy
    ? 'platform-swiggy'
    : isZomato
    ? 'platform-zomato'
    : isGrubhub
    ? 'platform-grubhub'
    : isDoorDash
    ? 'platform-doordash'
    : 'platform-foodpanda';

  const platformDisplayName = food.platformName || (
    isSwiggy ? 'Swiggy' : isZomato ? 'Zomato' : isGrubhub ? 'Grubhub' : isDoorDash ? 'DoorDash' : 'Foodpanda'
  );

  // Currency formatting via centralized utility
  const priceInfo = formatMoney(food.price, food.sourceCurrency || 'INR');
  const deliveryFeeFormatted = food.deliveryFeeINR !== null && food.deliveryFeeINR !== undefined
    ? formatINR(food.deliveryFeeINR)
    : null;

  return (
    <div className="food-card">
      {/* Image Container with Badges */}
      <div style={{ position: 'relative', width: '100%', height: 180, overflow: 'hidden' }}>
        <FoodImage item={food} alt={food.name} />

        {/* Top Floating Tags */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            right: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 6
          }}
        >
          <span className={`platform-pill ${platformClass}`}>
            {platformDisplayName}
          </span>

          {food.recordType === 'order_dispatch' ? (
            <span
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(4px)',
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 4
              }}
            >
              Order Dispatch Log
            </span>
          ) : food.recordType === 'restaurant_listing' ? (
            <span
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.85)',
                backdropFilter: 'blur(4px)',
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: 600,
                padding: '3px 7px',
                borderRadius: 4
              }}
            >
              Restaurant Venue
            </span>
          ) : food.offer ? (
            <span
              style={{
                backgroundColor: 'rgba(28, 25, 23, 0.85)',
                backdropFilter: 'blur(4px)',
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: 700,
                padding: '3px 7px',
                borderRadius: 4
              }}
            >
              {food.offer}
            </span>
          ) : null}
        </div>

        {/* Bottom Floating Delivery & Rating info */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 10,
            right: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 6
          }}
        >
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {food.rating ? (
              <span
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 4,
                  padding: '2px 6px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3
                }}
              >
                ★ {Number(food.rating).toFixed(1)}
              </span>
            ) : null}

            {food.deliveryTime && (
              <span
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 4,
                  padding: '2px 6px',
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                ⏱ {food.deliveryTime}
              </span>
            )}
          </div>

          {deliveryFeeFormatted && (
            <span
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 4,
                padding: '2px 6px',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              Fee: {deliveryFeeFormatted}
            </span>
          )}
        </div>
      </div>

      {/* Card Content Area */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: 8 }}>
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.25,
              marginBottom: 3
            }}
          >
            {food.name}
          </h3>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {food.restaurantName} &bull; {food.cuisine}
          </div>
        </div>

        {/* City & Record Verification Source */}
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>📍 {food.city}</span>
          <span style={{ color: 'var(--green-600)', fontWeight: 600 }}>
            ✓ Verified Record
          </span>
        </div>

        {/* Special Notice for Order-Level logs (DoorDash) */}
        {food.recordType === 'order_dispatch' && (
          <div
            style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-default)',
              padding: '6px 8px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 12,
              lineHeight: 1.3
            }}
          >
            ℹ️ <strong>Dispatch Order:</strong> Subtotal represents total basket charge.
          </div>
        )}

        {/* Pricing & Compare Action */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {food.recordType === 'order_dispatch' ? 'Order Subtotal (INR)' : 'Listed Price (INR)'}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {priceInfo.inrText}
              </span>
              {priceInfo.isConverted && (
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }} title={`Source: ${priceInfo.originalText}`}>
                  ({priceInfo.originalText})
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onCompare(food)}
            className="btn btn-outline-coral btn-sm"
            style={{ fontWeight: 700 }}
          >
            {food.canCompareFood === false ? 'Inspect Details →' : 'Compare prices →'}
          </button>
        </div>
      </div>
    </div>
  );
}
