import React from 'react';
import { IconDownload, IconRefresh } from './icons/Icons';
import { PROJECT_METADATA } from '../data/sampleAnalyticsData';

export default function Header({
  selectedPlatform,
  setSelectedPlatform,
  onRefresh
}) {
  const platforms = ['All Platforms', 'Swiggy', 'Zomato', 'Grubhub', 'Restaurant Menus'];

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}
    >
      {/* Title & Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
        <h1
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {PROJECT_METADATA.title}
        </h1>
        <span className="badge badge-info" style={{ display: 'none', mdDisplay: 'inline-flex' }}>
          {PROJECT_METADATA.badge}
        </span>
      </div>

      {/* Header Actions & Platform Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Filter Segmented Control */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '2px',
            gap: '2px'
          }}
        >
          {platforms.map((p) => {
            const isSelected = selectedPlatform === p;
            return (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                style={{
                  border: 'none',
                  background: isSelected ? '#ffffff' : 'transparent',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: 12,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  boxShadow: isSelected ? 'var(--shadow-xs)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <button
          onClick={onRefresh}
          className="btn"
          title="Reset & Refresh view"
          style={{ display: 'inline-flex', padding: '6px 12px', fontSize: 12 }}
        >
          <IconRefresh size={14} />
          <span>Sync Data</span>
        </button>

        <button
          onClick={() => {
            alert('Summary export: 5,394,588 records verified across Swiggy, Zomato, Grubhub, and PySpark Menus.');
          }}
          className="btn btn-primary"
          style={{ display: 'inline-flex', padding: '6px 14px', fontSize: 12 }}
        >
          <IconDownload size={14} />
          <span>Export Summary</span>
        </button>
      </div>
    </header>
  );
}
