'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Overview', icon: 'grid' },
  { href: '/patients', label: 'Patients', icon: 'users' },
  { href: '/biomarkers', label: 'Biomarkers', icon: 'chart' },
  { href: '/timeline', label: 'Timeline', icon: 'file' },
  { href: '/medications', label: 'Medications', icon: 'grid' },
  { href: '/reports', label: 'Reports', icon: 'file' },
  { href: '/research', label: 'Research', icon: 'chart' },
  { href: '/settings', label: 'Settings', icon: 'gear' },
];

const iconMap: Record<string, JSX.Element> = {
  grid: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="7" height="7" rx="1" />
      <rect x="11" y="2" width="7" height="7" rx="1" />
      <rect x="2" y="11" width="7" height="7" rx="1" />
      <rect x="11" y="11" width="7" height="7" rx="1" />
    </svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="6" r="3" />
      <path d="M1 17c0-3 2.7-5 6-5s6 2 6 5" />
      <circle cx="14.5" cy="6.5" r="2.5" />
      <path d="M15 12c2.2.5 4 2 4 5" />
    </svg>
  ),
  file: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 2h8l4 4v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
      <path d="M12 2v4h4" />
      <line x1="6" y1="10" x2="14" y2="10" />
      <line x1="6" y1="13" x2="14" y2="13" />
      <line x1="6" y1="16" x2="10" y2="16" />
    </svg>
  ),
  chart: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="4" y1="18" x2="4" y2="10" />
      <line x1="8" y1="18" x2="8" y2="6" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="16" y1="18" x2="16" y2="3" />
    </svg>
  ),
  gear: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="10" r="3" />
      <path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.5 3.5l1.4 1.4M15.1 15.1l1.4 1.4M3.5 16.5l1.4-1.4M15.1 4.9l1.4-1.4" />
    </svg>
  ),
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 240,
        minHeight: '100vh',
        background: '#0A1628',
        color: '#94A3B8',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
      }}
    >
      {/* Logo / Brand */}
      <div
        style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid #1E293B',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            GR
          </div>
          <div>
            <div style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>
              Gentle Reminder
            </div>
            <div style={{ fontSize: 11, color: '#64748B', letterSpacing: '0.05em' }}>
              CLINICAL PORTAL
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 8,
                marginBottom: 2,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? '#E2E8F0' : '#94A3B8',
                background: isActive ? '#1E293B' : 'transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.7 }}>{iconMap[item.icon]}</span>
              {item.label}
              {isActive && (
                <div
                  style={{
                    width: 3,
                    height: 20,
                    borderRadius: 2,
                    background: '#3B82F6',
                    position: 'absolute',
                    left: 0,
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User / Footer */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94A3B8',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          SK
        </div>
        <div>
          <div style={{ color: '#E2E8F0', fontSize: 13, fontWeight: 500 }}>Dr. Sarah Kim</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>Neurologist</div>
        </div>
      </div>
    </aside>
  );
}
