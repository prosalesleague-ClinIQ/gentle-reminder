import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Internal — Gentle Reminder',
  description: 'Internal page.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-snippet': -1,
      'max-image-preview': 'none',
      'max-video-preview': -1,
    },
  },
};

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Internal banner */}
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
        🔒 INTERNAL — Hidden from search, URL is public. Share only with trusted parties.
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
              🔒 INTERNAL
            </Link>
            <Link href="/private" style={{ fontSize: 13, color: '#c9d1d9' }}>Dashboard</Link>
            <Link href="/private/execute" style={{ fontSize: 13, color: '#f85149', fontWeight: 600 }}>🔥 Execute</Link>
            <Link href="/private/materials" style={{ fontSize: 13, color: '#3fb950', fontWeight: 600 }}>📚 Materials</Link>
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
