import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-default)',
        padding: '40px 0 28px',
        marginTop: 'auto'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 32,
            marginBottom: 32
          }}
        >
          {/* Brand & Purpose */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--coral-600)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 13
                }}
              >
                FC
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>
                Food<span style={{ color: 'var(--coral-600)' }}>Compare</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              One Place. Every Platform. Better Deals. An academic food-tech discovery platform evaluating menu prices, delivery fees, and verified promotions.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, textTransform: 'uppercase' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <li>
                <button
                  onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
                >
                  Explore Food
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('compare'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
                >
                  Compare Prices
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('deals'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
                >
                  Best Verified Deals
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('insights'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
                >
                  Big Data Research & Insights
                </button>
              </li>
            </ul>
          </div>

          {/* Data Transparency & Disclaimer */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, textTransform: 'uppercase' }}>
              Data Provenance & Policy
            </h4>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              All price calculations rely on cleaned historical research datasets (Swiggy, Zomato, Grubhub, DoorDash, and Foodpanda). Hypothetical or expired vouchers are never subtracted.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: 20,
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            fontSize: 12,
            color: 'var(--text-muted)'
          }}
        >
          <div>
            &copy; 2026 FoodCompare &bull; College Capstone: Comparative Big Data Analytics of Online Food Delivery Platforms
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Python &bull; PySpark &bull; React &bull; Vite</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
