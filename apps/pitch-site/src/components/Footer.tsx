import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #21262d',
        padding: '48px 0 32px',
        marginTop: 80,
      }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f6fc', marginBottom: 12 }}>
              Gentle Reminder
            </div>
            <p style={{ fontSize: 13, color: '#8b949e', lineHeight: 1.6 }}>
              23 patentable innovations in clinical-grade dementia care.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6fc', marginBottom: 12 }}>IP Portfolio</div>
            <Link href="/ip" style={{ display: 'block', fontSize: 13, color: '#8b949e', marginBottom: 6 }}>
              Overview
            </Link>
            <Link href="/ip?tier=1" style={{ display: 'block', fontSize: 13, color: '#8b949e', marginBottom: 6 }}>
              Tier 1 (5)
            </Link>
            <Link href="/ip?tier=2" style={{ display: 'block', fontSize: 13, color: '#8b949e', marginBottom: 6 }}>
              Tier 2 (7)
            </Link>
            <Link href="/ip?tier=3" style={{ display: 'block', fontSize: 13, color: '#8b949e' }}>
              Tier 3 (11)
            </Link>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6fc', marginBottom: 12 }}>
              Funding Tracks
            </div>
            <Link href="/investors" style={{ display: 'block', fontSize: 13, color: '#8b949e', marginBottom: 6 }}>
              Investors
            </Link>
            <Link href="/partners" style={{ display: 'block', fontSize: 13, color: '#8b949e', marginBottom: 6 }}>
              Strategic Partners
            </Link>
            <Link href="/grants" style={{ display: 'block', fontSize: 13, color: '#8b949e' }}>
              Grant Funding
            </Link>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6fc', marginBottom: 12 }}>Platform</div>
            <Link href="/clinical" style={{ display: 'block', fontSize: 13, color: '#8b949e', marginBottom: 6 }}>
              Clinical / FDA
            </Link>
            <Link href="/team" style={{ display: 'block', fontSize: 13, color: '#8b949e', marginBottom: 6 }}>
              Team
            </Link>
            <Link href="/demo" style={{ display: 'block', fontSize: 13, color: '#8b949e', marginBottom: 6 }}>
              Demo
            </Link>
            <Link href="/contact" style={{ display: 'block', fontSize: 13, color: '#8b949e' }}>
              Contact
            </Link>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid #21262d',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: '#6e7681' }}>
            &copy; {new Date().getFullYear()} Gentle Reminder. All rights reserved. Patents pending.
          </span>
          <span style={{ fontSize: 12, color: '#6e7681' }}>
            FDA SaMD pathway &middot; HIPAA-ready &middot; 10 languages
          </span>
        </div>
      </div>
    </footer>
  );
}
