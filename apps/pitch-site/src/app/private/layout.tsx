import React from 'react';
import Link from 'next/link';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Confidential banner */}
      <div
        style={{
          background: 'linear-gradient(90deg, #f85149, #d29922)',
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 700,
          textAlign: 'center',
          padding: '6px 12px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        🔒 CONFIDENTIAL — Internal Outreach Command Center. Do not share. Do not screenshot.
      </div>

      {/* Private nav */}
      <div
        style={{
          backgroundColor: '#161b22',
          borderBottom: '1px solid #21262d',
          padding: '12px 0',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/private" style={{ fontSize: 14, fontWeight: 700, color: '#f85149' }}>
              🔒 PRIVATE
            </Link>
            <Link href="/private" style={{ fontSize: 13, color: '#c9d1d9' }}>Dashboard</Link>
            <Link href="/private/outreach" style={{ fontSize: 13, color: '#c9d1d9' }}>Outreach Queue</Link>
            <Link href="/private/pipeline" style={{ fontSize: 13, color: '#c9d1d9' }}>Pipeline</Link>
            <Link href="/private/templates" style={{ fontSize: 13, color: '#c9d1d9' }}>Email Templates</Link>
            <Link href="/private/nda" style={{ fontSize: 13, color: '#c9d1d9' }}>NDA Templates</Link>
            <Link href="/private/checklists" style={{ fontSize: 13, color: '#c9d1d9' }}>Checklists</Link>
          </div>
          <Link href="/" style={{ fontSize: 12, color: '#8b949e' }}>← Exit to public site</Link>
        </div>
      </div>

      {children}
    </>
  );
}
