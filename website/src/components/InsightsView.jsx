import React from 'react';
import ReportExportSection from './ReportExportSection';
import ChartSection from './ChartSection';
import MLEvaluationSection from './MLEvaluationSection';
import DatasetSummaryTable from './DatasetSummaryTable';
import KeyInsightsCard from './KeyInsightsCard';
import { PLATFORM_COMPARISON_METRICS } from '../data/sampleAnalyticsData';
import { CURRENCY_CONFIG } from '../utils/currency';

export default function InsightsView() {
  return (
    <div style={{ padding: '36px 0', backgroundColor: 'var(--bg-app)' }}>
      <div className="container">
        {/* Page Title */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span className="badge badge-coral">Academic Project Insights</span>
            <span className="text-muted" style={{ fontSize: 12 }}>
              PySpark &bull; Python EDA &bull; 5.39M Records &bull; INR Standardized
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Comparative Big Data Analytics & Research Findings
          </h1>
          <p className="text-muted" style={{ maxWidth: 800 }}>
            Underlying data architecture, empirical distributions, platform fee structures, currency conversions, and dataset quality audits powering FoodCompare.
          </p>
        </div>

        {/* Prominent Export Research Report Section */}
        <ReportExportSection />

        {/* Currency Conversion & Exchange Rate Standard Card */}
        <div className="card" style={{ padding: '22px', marginBottom: 24, borderLeft: '4px solid var(--coral-600)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                💱 Centralized Currency Conversion & Assumptions (As of {CURRENCY_CONFIG.asOfDate})
              </h3>
              <p className="text-muted" style={{ fontSize: 13, marginTop: 2 }}>
                {CURRENCY_CONFIG.disclaimer}
              </p>
            </div>
            <span className="badge badge-green" style={{ fontSize: 12 }}>
              Base: Indian Rupee (₹ INR)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 8, border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>INDIA (Swiggy, Zomato)</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                1.00 INR = ₹1.00
              </div>
              <div style={{ fontSize: 11, color: 'var(--green-600)', marginTop: 2 }}>Native Source Currency</div>
            </div>

            <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 8, border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>UNITED STATES (Grubhub, DoorDash)</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                1.00 USD ≈ ₹83.50 INR
              </div>
              <div style={{ fontSize: 11, color: 'var(--coral-700)', marginTop: 2 }}>Benchmark Exchange Assumption</div>
            </div>

            <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 8, border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>SOUTH ASIA (Foodpanda)</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                1.00 PKR ≈ ₹0.30 INR
              </div>
              <div style={{ fontSize: 11, color: 'var(--coral-700)', marginTop: 2 }}>Benchmark Exchange Assumption</div>
            </div>
          </div>
        </div>

        {/* Key Findings & Workflow Card */}
        <KeyInsightsCard />

        {/* Interactive Charts Area */}
        <ChartSection />

        {/* Machine Learning Model Evaluation & Benchmark Experiments */}
        <MLEvaluationSection />

        {/* Dataset Quality Audit Table */}
        <DatasetSummaryTable selectedPlatform="All Platforms" />

        {/* Platform Data Specifications */}
        <div className="card" style={{ padding: '24px', marginTop: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            Platform Scope, Currencies & Observation Units
          </h3>
          <p className="text-muted" style={{ fontSize: 13, marginBottom: 16 }}>
            Understanding regional variance, currency conventions, and schema differences
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-default)', color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>Platform</th>
                  <th style={{ padding: '10px 12px' }}>Total Records</th>
                  <th style={{ padding: '10px 12px' }}>Observation Unit</th>
                  <th style={{ padding: '10px 12px' }}>Mean Rating</th>
                  <th style={{ padding: '10px 12px' }}>Original Currency</th>
                  <th style={{ padding: '10px 12px' }}>Price Metric (INR)</th>
                  <th style={{ padding: '10px 12px' }}>Geographic Reach</th>
                </tr>
              </thead>
              <tbody>
                {PLATFORM_COMPARISON_METRICS.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{row.platform}</td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{row.totalRecords}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{row.observationUnit}</td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{row.avgRating ? `${row.avgRating} / 5.0` : '—'}</td>
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--navy-700)' }}>{row.originalCurrency}</td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{row.avgPrice}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: 12 }}>{row.geography}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
