import React from 'react';
import { FOOD_PHOTOS } from '../services/dataService';
import { IconSearch } from './Navbar';
import FoodImage from './FoodImage';

export default function Hero({
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  onChipClick
}) {
  const chips = ['Biryani', 'Pizza', 'Burgers', 'Dosa', 'Shawarma', 'Chinese'];

  return (
    <section
      style={{
        padding: '44px 0 36px',
        borderBottom: '1px solid var(--border-default)',
        backgroundColor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: 40
          }}
        >
          {/* Left Column: Headlines & Search Form */}
          <div style={{ maxWidth: 560 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
              <span className="badge badge-coral" style={{ fontSize: 12, padding: '4px 10px' }}>
                Multi-Platform Food Intelligence
              </span>
              <span className="text-muted" style={{ fontSize: 12 }}>
                &bull; 5 Platforms Indexed
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(30px, 4.2vw, 44px)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: 14
              }}
            >
              Your cravings. Every platform.{' '}
              <span style={{ color: 'var(--coral-600)' }}>One smarter choice.</span>
            </h1>

            <p
              style={{
                fontSize: '16px',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                marginBottom: 26
              }}
            >
              Discover food, compare menu prices, uncover offers, and see the estimated total before you order.
            </p>

            {/* Large Search Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-app)',
                border: '1.5px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                padding: '6px 8px 6px 16px',
                gap: 12,
                boxShadow: 'var(--shadow-sm)',
                marginBottom: 18,
                transition: 'border-color 0.2s ease'
              }}
            >
              <IconSearch size={18} style={{ color: 'var(--coral-600)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search biryani, pizza, burgers, restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  width: '100%',
                  fontSize: '15px',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit'
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
              >
                Compare food
              </button>
            </form>

            {/* Popular Search Chips */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
                Popular:
              </span>
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => onChipClick(chip)}
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-full)',
                    padding: '4px 12px',
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--coral-50)';
                    e.currentTarget.style.borderColor = 'var(--coral-200)';
                    e.currentTarget.style.color = 'var(--coral-700)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Editorial Food Visual & Floating Badges */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 480,
                height: 340,
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-default)'
              }}
            >
              <FoodImage
                item={{ name: 'Hyderabadi Dum Chicken Biryani', category: 'biryani' }}
                alt="Editorial Biryani Food Presentation"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(28,25,23,0) 40%, rgba(28,25,23,0.75) 100%)'
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  right: 20,
                  color: '#FFFFFF'
                }}
              >
                <div style={{ display: 'inline-flex', padding: '3px 8px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', fontSize: 11, fontWeight: 600, marginBottom: 6 }}>
                  Featured Comparison
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>
                  Hyderabadi Dum Chicken Biryani
                </h3>
                <p style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>
                  Compared across Swiggy, Zomato & Foodpanda &bull; Verified ₹80 savings available
                </p>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div
              style={{
                position: 'absolute',
                top: -12,
                right: 12,
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'var(--green-50)',
                  color: 'var(--green-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 16
                }}
              >
                ✓
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                  True Cost Calculation
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Item + Delivery + Fees - Discount
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
