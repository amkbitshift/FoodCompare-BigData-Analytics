import React from 'react';
import { LOCATIONS_LIST } from '../services/dataService';

export const IconSearch = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const IconMapPin = ({ size = 15, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const IconMenu = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

export default function Navbar({
  activeNav,
  setActiveNav,
  searchTerm,
  setSearchTerm,
  selectedLocation,
  setSelectedLocation,
  onOpenSearch
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore Food' },
    { id: 'compare', label: 'Compare Prices' },
    { id: 'deals', label: 'Best Deals' },
    { id: 'insights', label: 'Insights' }
  ];

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-default)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--navbar-height)', gap: 16 }}>
        {/* Brand Logo & Tagline */}
        <div
          onClick={() => { setActiveNav('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--coral-600)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: '-0.03em'
            }}
          >
            FC
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Food<span style={{ color: 'var(--coral-600)' }}>Compare</span>
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.01em' }}>
              One Place. Every Platform.
            </span>
          </div>
        </div>

        {/* Global Nav Links (Desktop) */}
        <nav style={{ display: 'none', mdDisplay: 'flex', gap: 4 }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = activeNav === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveNav(link.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--coral-50)' : 'transparent',
                  color: isActive ? 'var(--coral-700)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Search Field & Location Selector (Desktop) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, maxWidth: 440, justifyContent: 'flex-end' }}>
          {/* Quick Search Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '7px 12px',
              width: '100%',
              maxWidth: 260
            }}
          >
            <IconSearch size={15} className="text-muted" />
            <input
              type="text"
              placeholder="Search dishes or places..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (activeNav === 'insights') setActiveNav('explore');
              }}
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                width: '100%',
                fontSize: 13,
                color: 'var(--text-primary)',
                fontFamily: 'inherit'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12 }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Location Picker */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 10px',
              cursor: 'pointer'
            }}
          >
            <IconMapPin size={14} style={{ color: 'var(--coral-600)', flexShrink: 0 }} />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              {LOCATIONS_LIST.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="btn-icon"
          style={{ display: 'inline-flex', mdDisplay: 'none', padding: 8, border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)' }}
          aria-label="Toggle Navigation"
        >
          <IconMenu size={18} />
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--border-default)',
            backgroundColor: '#FFFFFF',
            padding: '12px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveNav(link.id);
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                textAlign: 'left',
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: activeNav === link.id ? 'var(--coral-50)' : 'transparent',
                color: activeNav === link.id ? 'var(--coral-700)' : 'var(--text-primary)',
                fontWeight: 600,
                fontSize: 14
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
