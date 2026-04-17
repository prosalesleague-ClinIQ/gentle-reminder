import React from 'react';
import Link from 'next/link';
import type { IPEntry } from '../content/ip-portfolio';

export default function IPCard({ ip }: { ip: IPEntry }) {
  return (
    <Link href={`/ip/${ip.slug}`} className="card" style={{ display: 'block', textDecoration: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <span className={`chip tier-${ip.tier}`}>Tier {ip.tier}</span>
        <span style={{ fontSize: 11, color: '#6e7681', fontFamily: 'monospace' }}>#{ip.id}</span>
      </div>

      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#f0f6fc',
          lineHeight: 1.3,
          marginBottom: 12,
        }}
      >
        {ip.shortTitle}
      </h3>

      <p
        style={{
          fontSize: 13,
          color: '#c9d1d9',
          lineHeight: 1.5,
          marginBottom: 16,
          minHeight: 60,
        }}
      >
        {ip.headline}
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 12,
          borderTop: '1px solid #21262d',
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: '#8b949e',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 600,
          }}
        >
          {ip.category}
        </span>
        <span style={{ fontSize: 12, color: '#58a6ff', fontWeight: 500 }}>Learn more →</span>
      </div>
    </Link>
  );
}
