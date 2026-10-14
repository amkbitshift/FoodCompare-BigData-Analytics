import React from 'react';
import { CATEGORIES_LIST } from '../services/dataService';

export default function CategoryStrip({
  selectedCategory,
  setSelectedCategory
}) {
  return (
    <div
      style={{
        padding: '16px 0',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-default)',
        position: 'sticky',
        top: 'var(--navbar-height)',
        zIndex: 40
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            overflowX: 'auto',
            paddingBottom: 4,
            scrollbarWidth: 'none'
          }}
        >
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--coral-600)' : 'var(--border-default)',
                  backgroundColor: isSelected ? 'var(--coral-600)' : 'var(--bg-app)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: 13,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-app)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
