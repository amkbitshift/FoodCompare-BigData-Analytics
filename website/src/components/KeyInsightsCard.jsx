import React from 'react';
import { METHODOLOGY_STAGES } from '../data/sampleAnalyticsData';
import { IconShieldCheck, IconFileText, IconCheck } from './icons/Icons';

export default function KeyInsightsCard() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 20,
        marginBottom: 24
      }}
    >
      {/* Findings Card */}
      <div className="card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <IconFileText size={18} className="text-muted" />
          <h3 className="heading-md">Key Analytical Findings</h3>
        </div>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--navy-700)', fontWeight: 700, marginTop: 2 }}>&bull;</span>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Rating Parity: </strong>
              Swiggy exhibits an average restaurant/menu rating of <strong>4.04/5.0</strong> across 105,864 rated items, while Zomato averages <strong>3.89/5.0</strong> across 101,530 items.
            </div>
          </li>

          <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--navy-700)', fontWeight: 700, marginTop: 2 }}>&bull;</span>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Grubhub Economics (Standardized to INR): </strong>
              US Grubhub dataset reflects an average estimated delivery time of <strong>42.54 minutes</strong>, with a mean delivery fee of <strong>₹204.58</strong> ($2.45 USD original) and service fee of <strong>₹514.36</strong> ($6.16 USD).
            </div>
          </li>

          <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--navy-700)', fontWeight: 700, marginTop: 2 }}>&bull;</span>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>PySpark Big Data Scaling: </strong>
              The restaurant menus dataset comprises <strong>5,082,180 records</strong> across 63,309 unique restaurant entities, processed and cleaned using distributed PySpark routines.
            </div>
          </li>
        </ul>
      </div>

      {/* Methodology Pipeline Card */}
      <div className="card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <IconShieldCheck size={18} className="text-muted" />
          <h3 className="heading-md">Big Data Processing Workflow</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {METHODOLOGY_STAGES.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>
                  {m.step}
                </span>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                  {m.name}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.detail}</span>
                <span
                  className={`badge ${
                    m.status === 'Completed' ? 'badge-success' : 'badge-info'
                  }`}
                  style={{ fontSize: 10, padding: '1px 6px' }}
                >
                  {m.status === 'Completed' ? <IconCheck size={10} /> : null}
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
