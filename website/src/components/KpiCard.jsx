import React from 'react';

export default function KpiCard({
  label,
  value,
  unit = '',
  change,
  changeType = 'neutral',
  subtext,
  platform
}) {
  return (
    <div
      className="card"
      style={{
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      {/* Top row: Platform Tag and Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--text-muted)'
          }}
        >
          {platform}
        </span>
        {change && (
          <span
            className={`badge ${
              changeType === 'positive'
                ? 'badge-success'
                : changeType === 'warning'
                ? 'badge-warning'
                : 'badge-neutral'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {/* Main Metric Value */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}
          >
            {value}
          </span>
          {unit && (
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>
              {unit}
            </span>
          )}
        </div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginTop: 4 }}>
          {label}
        </div>
      </div>

      {/* Subtext info */}
      {subtext && (
        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            paddingTop: 8,
            borderTop: '1px solid var(--border-light)'
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
}
