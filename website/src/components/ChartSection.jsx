import React, { useState } from 'react';
import {
  RATING_DISTRIBUTION_DATA,
  TOP_CUISINES_DATA,
  CITY_COVERAGE_DATA,
  EDA_CHARTS_GALLERY
} from '../data/sampleAnalyticsData';

export default function ChartSection() {
  const [activeChartTab, setActiveChartTab] = useState('ratings');
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
      {/* Header and Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          paddingBottom: '18px',
          borderBottom: '1px solid var(--border-default)',
          marginBottom: '20px'
        }}
      >
        <div>
          <h2 className="heading-md">Platform Comparative Exploratory Analysis</h2>
          <p className="text-muted" style={{ marginTop: '2px' }}>
            Empirical distributions across ratings, cuisine specializations, and geographic clusters
          </p>
        </div>

        {/* Chart View Selector */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '3px',
            gap: '3px',
            border: '1px solid var(--border-default)'
          }}
        >
          <button
            onClick={() => {
              setActiveChartTab('ratings');
              setHoveredItem(null);
            }}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: activeChartTab === 'ratings' ? 600 : 500,
              backgroundColor: activeChartTab === 'ratings' ? '#ffffff' : 'transparent',
              color: activeChartTab === 'ratings' ? 'var(--text-primary)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              boxShadow: activeChartTab === 'ratings' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Rating Distribution
          </button>

          <button
            onClick={() => {
              setActiveChartTab('cuisines');
              setHoveredItem(null);
            }}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: activeChartTab === 'cuisines' ? 600 : 500,
              backgroundColor: activeChartTab === 'cuisines' ? '#ffffff' : 'transparent',
              color: activeChartTab === 'cuisines' ? 'var(--text-primary)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              boxShadow: activeChartTab === 'cuisines' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Top Cuisines Volume
          </button>

          <button
            onClick={() => {
              setActiveChartTab('geography');
              setHoveredItem(null);
            }}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: activeChartTab === 'geography' ? 600 : 500,
              backgroundColor: activeChartTab === 'geography' ? '#ffffff' : 'transparent',
              color: activeChartTab === 'geography' ? 'var(--text-primary)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              boxShadow: activeChartTab === 'geography' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            City Record Density
          </button>

          <button
            onClick={() => {
              setActiveChartTab('artifacts');
              setHoveredItem(null);
            }}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: activeChartTab === 'artifacts' ? 600 : 500,
              backgroundColor: activeChartTab === 'artifacts' ? '#ffffff' : 'transparent',
              color: activeChartTab === 'artifacts' ? 'var(--coral-700)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              boxShadow: activeChartTab === 'artifacts' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            📊 Python EDA Plots ({EDA_CHARTS_GALLERY.length})
          </button>
        </div>
      </div>

      {/* Render Selected Visualisation */}
      <div style={{ position: 'relative', minHeight: 320 }}>
        {activeChartTab === 'ratings' && (
          <RatingsComparativeChart hoveredItem={hoveredItem} setHoveredItem={setHoveredItem} />
        )}
        {activeChartTab === 'cuisines' && (
          <CuisinesVolumeChart hoveredItem={hoveredItem} setHoveredItem={setHoveredItem} />
        )}
        {activeChartTab === 'geography' && (
          <CityDensityChart hoveredItem={hoveredItem} setHoveredItem={setHoveredItem} />
        )}
        {activeChartTab === 'artifacts' && (
          <ArtifactsGallery />
        )}
      </div>

      {/* Footer Notes */}
      <div
        style={{
          marginTop: '18px',
          paddingTop: '14px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}
      >
        <span>
          Note: Observations reflect cleaned project subsets: Swiggy (139K), Zomato (101K), Grubhub (8.08K).
        </span>
        <span style={{ fontWeight: 500 }}>
          Source: Python EDA Scripts &bull; output/*.csv
        </span>
      </div>
    </div>
  );
}

// 1. Ratings Comparative Chart
function RatingsComparativeChart({ hoveredItem, setHoveredItem }) {
  const maxVal = 60; // max percentage for scale

  return (
    <div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 16, fontSize: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: '#1e3a8a' }}></span>
          <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Swiggy (Mean 4.04)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: '#0284c7' }}></span>
          <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Zomato (Mean 3.89)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: '#64748b' }}></span>
          <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Grubhub (Mean 3.40)</span>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {RATING_DISTRIBUTION_DATA.map((bucket, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 75,
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textAlign: 'right'
              }}
            >
              {bucket.range} ★
            </span>

            {/* Bars grouping */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                backgroundColor: 'var(--bg-subtle)',
                padding: '6px 8px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              {/* Swiggy Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    height: 14,
                    width: `${(bucket.swiggy / maxVal) * 100}%`,
                    backgroundColor: '#1e3a8a',
                    borderRadius: 2,
                    transition: 'width 0.3s ease'
                  }}
                  onMouseEnter={() => setHoveredItem({ label: `Swiggy [${bucket.range}]`, val: `${bucket.swiggy}%` })}
                  onMouseLeave={() => setHoveredItem(null)}
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 45 }}>
                  {bucket.swiggy}%
                </span>
              </div>

              {/* Zomato Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    height: 14,
                    width: `${(bucket.zomato / maxVal) * 100}%`,
                    backgroundColor: '#0284c7',
                    borderRadius: 2,
                    transition: 'width 0.3s ease'
                  }}
                  onMouseEnter={() => setHoveredItem({ label: `Zomato [${bucket.range}]`, val: `${bucket.zomato}%` })}
                  onMouseLeave={() => setHoveredItem(null)}
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 45 }}>
                  {bucket.zomato}%
                </span>
              </div>

              {/* Grubhub Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    height: 14,
                    width: `${(bucket.grubhub / maxVal) * 100}%`,
                    backgroundColor: '#64748b',
                    borderRadius: 2,
                    transition: 'width 0.3s ease'
                  }}
                  onMouseEnter={() => setHoveredItem({ label: `Grubhub [${bucket.range}]`, val: `${bucket.grubhub}%` })}
                  onMouseLeave={() => setHoveredItem(null)}
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 45 }}>
                  {bucket.grubhub}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Cuisines Volume Chart
function CuisinesVolumeChart({ hoveredItem, setHoveredItem }) {
  const maxCount = 40000;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
        Analysis of 139,321 Swiggy records: Chinese and North Indian represent over 47% of total offerings.
      </div>

      {TOP_CUISINES_DATA.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span
            style={{
              width: 100,
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--text-primary)',
              textAlign: 'right',
              whiteSpace: 'nowrap'
            }}
          >
            {item.cuisine}
          </span>

          <div
            style={{
              flex: 1,
              height: 22,
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(item.count / maxCount) * 100}%`,
                backgroundColor: idx === 0 ? '#1e3a8a' : idx === 1 ? '#2563eb' : '#3b82f6',
                borderRadius: 'var(--radius-sm)',
                transition: 'width 0.3s ease'
              }}
              onMouseEnter={() => setHoveredItem({ label: item.cuisine, val: `${item.count.toLocaleString()} records` })}
              onMouseLeave={() => setHoveredItem(null)}
            />
          </div>

          <span style={{ width: 110, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
            {item.count.toLocaleString()}{' '}
            <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)' }}>
              ({item.percentage}%)
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

// 3. City Density Chart
function CityDensityChart({ hoveredItem, setHoveredItem }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
        Evenly sampled distribution (~2,000 records per metro/regional hub) across cleaned Swiggy records.
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12
        }}
      >
        {CITY_COVERAGE_DATA.map((city, idx) => (
          <div
            key={idx}
            style={{
              padding: '12px 14px',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                {city.city}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy-700)' }}>
                {city.records.toLocaleString()}
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              State: {city.state}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Real Python/Matplotlib EDA Output Charts Gallery

function ArtifactsGallery() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentChart = EDA_CHARTS_GALLERY[selectedIdx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            Project EDA Output Artifacts (Generated via Python matplotlib/seaborn scripts)
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Visualizations produced by <code>{currentChart.script}</code> and saved in <code>output/</code>
          </div>
        </div>

        {/* Dropdown Selector */}
        <select
          value={selectedIdx}
          onChange={(e) => setSelectedIdx(Number(e.target.value))}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-primary)',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer'
          }}
        >
          {EDA_CHARTS_GALLERY.map((chart, idx) => (
            <option key={chart.id} value={idx}>
              {idx + 1}. {chart.title}
            </option>
          ))}
        </select>
      </div>

      {/* Main Image View */}
      <div
        style={{
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ padding: '12px 18px', backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            {currentChart.title}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            File: <code>output{currentChart.src.replace('/charts', '')}</code>
          </div>
        </div>

        <div style={{ padding: '16px', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
          <img
            src={currentChart.src}
            alt={currentChart.title}
            style={{
              maxWidth: '100%',
              maxHeight: 520,
              height: 'auto',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)'
            }}
          />
        </div>

        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border-light)', fontSize: 12, color: 'var(--text-secondary)', backgroundColor: 'var(--bg-app)' }}>
          ℹ️ {currentChart.description}
        </div>
      </div>

      {/* Thumbnails Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
        {EDA_CHARTS_GALLERY.map((chart, idx) => {
          const isSelected = idx === selectedIdx;
          return (
            <button
              key={chart.id}
              onClick={() => setSelectedIdx(idx)}
              style={{
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid',
                borderColor: isSelected ? 'var(--coral-600)' : 'var(--border-default)',
                backgroundColor: isSelected ? 'var(--coral-50)' : '#FFFFFF',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: isSelected ? 'var(--coral-700)' : 'var(--text-muted)' }}>
                Chart {idx + 1}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {chart.title}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
