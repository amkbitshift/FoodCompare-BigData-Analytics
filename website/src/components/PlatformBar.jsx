import React from 'react';
import { PLATFORMS_METADATA, normalizePlatformId } from '../services/dataService';

export default function PlatformBar({
  selectedPlatform,
  setSelectedPlatform
}) {
  const normSelected = normalizePlatformId(selectedPlatform);

  return (
    <div
      style={{
        padding: '16px 0',
        backgroundColor: 'var(--bg-app)',
        borderBottom: '1px solid var(--border-default)'
      }}
    >
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
            Filter Platform:
          </span>

          {/* "All" Platform button */}
          <button
            onClick={() => setSelectedPlatform('all')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: normSelected === 'all' || !normSelected ? 'var(--navy-900)' : 'var(--border-default)',
              backgroundColor: normSelected === 'all' || !normSelected ? 'var(--navy-900)' : '#FFFFFF',
              color: normSelected === 'all' || !normSelected ? '#FFFFFF' : 'var(--text-primary)',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            All Platforms
          </button>

          {/* Individual Platform Buttons */}
          {PLATFORMS_METADATA.map((p) => {
            const isSelected = normSelected === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(isSelected ? 'all' : p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--coral-600)' : 'var(--border-default)',
                  backgroundColor: isSelected ? 'var(--coral-50)' : '#FFFFFF',
                  color: isSelected ? 'var(--coral-700)' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{p.name}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: isSelected ? 'var(--coral-600)' : 'var(--text-muted)'
                  }}
                >
                  ({p.records})
                </span>
              </button>
            );
          })}
        </div>

        {/* Currency & Observation Notice */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--green-600)' }}></span>
          <span>All prices converted to Indian Rupees (₹) &bull; Verified Historical Datasets</span>
        </div>
      </div>
    </div>
  );
}
