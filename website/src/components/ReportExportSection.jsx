import React, { useState } from 'react';
import {
  downloadMarkdownReport,
  printOrSavePdfReport,
  generateMarkdownReport
} from '../utils/reportGenerator';

export default function ReportExportSection() {
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'info'|'error', msg: string }
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [reportMarkdown, setReportMarkdown] = useState('');

  const handleDownloadMarkdown = () => {
    try {
      setFeedback({ type: 'info', msg: 'Generating Markdown report file...' });
      downloadMarkdownReport();
      setFeedback({ type: 'success', msg: '✅ Downloaded FoodCompare_BigData_Research_Report.md' });
      setTimeout(() => setFeedback(null), 5000);
    } catch (err) {
      setFeedback({ type: 'error', msg: `Export failed: ${err.message}` });
    }
  };

  const handlePrintPdf = () => {
    try {
      setFeedback({ type: 'info', msg: 'Preparing printable academic report. Please select "Save as PDF" in your print window...' });
      printOrSavePdfReport();
      setFeedback({ type: 'success', msg: '📄 Printable PDF view generated successfully!' });
      setTimeout(() => setFeedback(null), 5000);
    } catch (err) {
      setFeedback({ type: 'error', msg: `PDF export blocked: ${err.message}` });
    }
  };

  const handleOpenPreview = () => {
    const md = generateMarkdownReport();
    setReportMarkdown(md);
    setIsPreviewOpen(true);
  };

  return (
    <div
      className="card"
      style={{
        padding: '22px 24px',
        marginBottom: '24px',
        backgroundColor: '#FFFFFF',
        border: '1.5px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}
      >
        {/* Left: Purpose & Details */}
        <div style={{ maxWidth: 620 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span className="badge badge-coral">Academic Submission Tool</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Markdown (.md) &bull; Print-Ready PDF (.pdf)
            </span>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
            Export Comprehensive Project Research Report
          </h2>
          <p className="text-muted" style={{ fontSize: '13px', marginTop: 4, lineHeight: 1.45 }}>
            Generate a full capstone report containing the abstract, data inventory (5.39M records), cleaning methodology, empirical EDA distributions, chart catalogs, and currency standardization disclosures.
          </p>
        </div>

        {/* Right: Export Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={handleDownloadMarkdown}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: 600, padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            title="Download full project report in Markdown format"
          >
            <span>📥 Download Markdown (.md)</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="btn btn-secondary btn-sm"
            style={{ fontWeight: 600, padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            title="Print or Save complete formatted academic report as PDF"
          >
            <span>📄 Save as PDF (.pdf)</span>
          </button>

          <button
            onClick={handleOpenPreview}
            className="btn btn-outline-coral btn-sm"
            style={{ fontWeight: 600, padding: '8px 14px' }}
          >
            👁️ Preview
          </button>
        </div>
      </div>

      {/* Dynamic Feedback Banner */}
      {feedback && (
        <div
          style={{
            marginTop: 14,
            padding: '8px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor:
              feedback.type === 'success'
                ? 'var(--green-50)'
                : feedback.type === 'error'
                ? '#FEF2F2'
                : 'var(--coral-50)',
            color:
              feedback.type === 'success'
                ? 'var(--green-600)'
                : feedback.type === 'error'
                ? '#DC2626'
                : 'var(--coral-700)',
            border: `1px solid ${
              feedback.type === 'success'
                ? 'var(--green-border)'
                : feedback.type === 'error'
                ? '#FECDD3'
                : 'var(--coral-200)'
            }`
          }}
        >
          <span>{feedback.msg}</span>
          <button
            onClick={() => setFeedback(null)}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'inherit', fontSize: 13 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Preview Modal / Drawer */}
      {isPreviewOpen && (
        <div className="drawer-backdrop" onClick={() => setIsPreviewOpen(false)}>
          <div
            className="comparison-drawer"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 840 }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                backgroundColor: '#FFFFFF',
                zIndex: 10
              }}
            >
              <div>
                <div className="badge badge-coral" style={{ marginBottom: 4 }}>
                  Research Report Preview
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>
                  FoodCompare — Big Data Analytics Report
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={handleDownloadMarkdown}
                  className="btn btn-sm btn-primary"
                >
                  📥 Download (.md)
                </button>
                <button
                  onClick={handlePrintPdf}
                  className="btn btn-sm btn-secondary"
                >
                  📄 Save as PDF
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="btn btn-sm"
                  style={{ width: 32, height: 32, borderRadius: '50%', padding: 0 }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Markdown Content Viewer */}
            <div style={{ padding: '24px', backgroundColor: '#FFFFFF', flex: 1, overflowY: 'auto' }}>
              <pre
                style={{
                  fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-app)',
                  padding: 20,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {reportMarkdown}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
