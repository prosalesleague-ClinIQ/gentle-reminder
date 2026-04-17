'use client';

import React from 'react';
import Link from 'next/link';

export default function Nav() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(10, 14, 26, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #21262d',
        padding: '16px 0',
      }}
    >
      <div
        className="container"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #58a6ff, #3fb950)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            GR
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f0f6fc' }}>Gentle Reminder</div>
            <div style={{ fontSize: 11, color: '#8b949e', marginTop: -2 }}>IP Portfolio</div>
          </div>
        </Link>

        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link href="/ip" style={{ fontSize: 14, color: '#c9d1d9' }}>
            IP Portfolio
          </Link>
          <Link href="/investors" style={{ fontSize: 14, color: '#c9d1d9' }}>
            Investors
          </Link>
          <Link href="/partners" style={{ fontSize: 14, color: '#c9d1d9' }}>
            Partners
          </Link>
          <Link href="/grants" style={{ fontSize: 14, color: '#c9d1d9' }}>
            Grants
          </Link>
          <Link href="/clinical" style={{ fontSize: 14, color: '#c9d1d9' }}>
            Clinical
          </Link>
          <Link href="/contact" className="btn-primary" style={{ padding: '8px 16px', fontSize: 14 }}>
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
