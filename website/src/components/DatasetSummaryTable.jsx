import React, { useState } from 'react';
import { DATASET_QUALITY_AUDIT } from '../data/sampleAnalyticsData';
import { IconShieldCheck, IconInfo, IconCheck } from './icons/Icons';

export default function DatasetSummaryTable({ selectedPlatform }) {
  const [selectedDataset, setSelectedDataset] = useState(null);

  // Filter datasets based on top-level filter if applicable
  const filteredData = selectedPlatform && selectedPlatform !== 'All Platforms'
    ? DATASET_QUALITY_AUDIT.filter((d) =>
        d.dataset.toLowerCase().includes(selectedPlatform.toLowerCase()) ||
        (selectedPlatform === 'Restaurant Menus' && d.dataset.includes('Menus'))
      )
    : DATASET_QUALITY_AUDIT;

  return (
    <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
      {/* Title & Description */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 18
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 className="heading-md">Recent Dataset Audits & Analysis Pipeline</h2>
            <span className="badge badge-success">
              <IconCheck size={12} /> Spark & Python Pipeline
            </span>
          </div>
          <p className="text-muted" style={{ marginTop: '2px' }}>
            Data health records, deduplication outcomes, and normalized analysis-ready schemas
          </p>
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Showing {filteredData.length} of {DATASET_QUALITY_AUDIT.length} audit logs
        </div>
      </div>

      {/* Responsive Table Container */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '13px'
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '2px solid var(--border-default)',
                color: 'var(--text-muted)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              <th style={{ padding: '10px 14px' }}>Dataset Name</th>
              <th style={{ padding: '10px 14px' }}>Cleaned Record Count</th>
              <th style={{ padding: '10px 14px' }}>Columns</th>
              <th style={{ padding: '10px 14px' }}>Audit Status</th>
              <th style={{ padding: '10px 14px' }}>Key Findings & Quality Action</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>Output Artifact</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr
                key={row.id}
                style={{
                  borderBottom: '1px solid var(--border-light)',
                  backgroundColor: idx % 2 === 0 ? '#ffffff' : 'var(--bg-app)',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : 'var(--bg-app)')
                }
              >
                <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{row.dataset}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>
                      {row.sourceFile}
                    </span>
                  </div>
                </td>

                <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {row.rows}
                </td>

                <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                  {row.columns}
                </td>

                <td style={{ padding: '12px 14px' }}>
                  <span
                    className={`badge ${
                      row.statusType === 'success'
                        ? 'badge-success'
                        : row.statusType === 'warning'
                        ? 'badge-warning'
                        : 'badge-info'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>

                <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', maxWidth: 360 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span>{row.findings}</span>
                    <span style={{ fontSize: 11, color: 'var(--navy-700)', fontWeight: 500 }}>
                      &bull; {row.actionTaken}
                    </span>
                  </div>
                </td>

                <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                  <code
                    style={{
                      fontSize: 11,
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {(row.outputFile || '').split(/[/\\]/).pop()}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
