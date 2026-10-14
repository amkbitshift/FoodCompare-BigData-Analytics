import React from 'react';
import {
  IconDashboard,
  IconBarChart,
  IconPieChart,
  IconLayers,
  IconShieldCheck,
  IconFileText,
  IconChevronLeft,
  IconChevronRight
} from './icons/Icons';

export default function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed
}) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: IconDashboard },
    { id: 'platforms', label: 'Platform Comparison', icon: IconBarChart },
    { id: 'ratings', label: 'Ratings & Pricing', icon: IconPieChart },
    { id: 'cuisines', label: 'Cuisines & Cities', icon: IconLayers },
    { id: 'quality', label: 'Data Quality & Audit', icon: IconShieldCheck },
    { id: 'methodology', label: 'Methodology & Reports', icon: IconFileText }
  ];

  return (
    <aside
      style={{
        width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        minWidth: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20
      }}
    >
      {/* Sidebar Header / Logo */}
      <div
        style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '0' : '0 16px',
          borderBottom: '1px solid var(--border-default)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              backgroundColor: 'var(--navy-900)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 14,
              flexShrink: 0
            }}
          >
            FD
          </div>
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                BigData Analytics
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Food Platforms</span>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="btn-icon"
            style={{ border: 'none', background: 'transparent', padding: 4 }}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <IconChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: collapsed ? '10px 0' : '9px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: isActive ? 'var(--navy-900)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: 13,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.15s ease, color 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <Icon size={18} />
              </span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle for Collapsed View */}
      {collapsed && (
        <div style={{ padding: '8px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setCollapsed(false)}
            className="btn-icon"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <IconChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Sidebar Footer */}
      {!collapsed && (
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-subtle)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>
              College Capstone Project
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Big Data Architecture &bull; 2026
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
