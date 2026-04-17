import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIPBySlug, IP_PORTFOLIO } from '../../../content/ip-portfolio';

export function generateStaticParams() {
  return IP_PORTFOLIO.map((ip) => ({ slug: ip.slug }));
}

export default function IPDetailPage({ params }: { params: { slug: string } }) {
  const ip = getIPBySlug(params.slug);
  if (!ip) return notFound();

  const relatedIPs = ip.relatedIPs
    .map((id) => IP_PORTFOLIO.find((other) => other.id === id))
    .filter(Boolean) as typeof IP_PORTFOLIO;

  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <Link
          href="/ip"
          style={{ fontSize: 13, color: '#58a6ff', marginBottom: 24, display: 'inline-block' }}
        >
          ← Back to IP Portfolio
        </Link>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
          <span className={`chip tier-${ip.tier}`}>Tier {ip.tier}</span>
          <span
            className="chip"
            style={{ backgroundColor: 'rgba(88, 166, 255, 0.1)', color: '#58a6ff', border: '1px solid rgba(88, 166, 255, 0.3)' }}
          >
            {ip.category}
          </span>
          <span style={{ fontSize: 12, color: '#8b949e', fontFamily: 'monospace', marginLeft: 'auto' }}>
            Docket: {ip.filingDocket}
          </span>
        </div>

        <h1
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: '#f0f6fc',
            lineHeight: 1.1,
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}
        >
          {ip.title}
        </h1>

        <p style={{ fontSize: 20, color: '#c9d1d9', lineHeight: 1.6, marginBottom: 48 }}>
          {ip.headline}
        </p>

        <div className="card" style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 13,
              color: '#f85149',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            Problem Solved
          </div>
          <p style={{ fontSize: 16, color: '#c9d1d9', lineHeight: 1.7 }}>{ip.problemSolved}</p>
        </div>

        <div className="card" style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 13,
              color: '#3fb950',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            Novel Method
          </div>
          <p style={{ fontSize: 16, color: '#c9d1d9', lineHeight: 1.7 }}>{ip.novelMethod}</p>
        </div>

        <div className="card" style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 13,
              color: '#d29922',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            Prior Art Differentiation
          </div>
          <p style={{ fontSize: 16, color: '#c9d1d9', lineHeight: 1.7 }}>{ip.priorArtDiff}</p>
        </div>

        <div className="card" style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 13,
              color: '#a371f7',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            Commercial Applications
          </div>
          <ul style={{ paddingLeft: 20, color: '#c9d1d9', fontSize: 15, lineHeight: 1.8 }}>
            {ip.commercialApplications.map((app) => (
              <li key={app}>{app}</li>
            ))}
          </ul>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 48,
          }}
        >
          <div className="card">
            <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Filing Status
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f6fc', textTransform: 'capitalize' }}>
              {ip.filingStatus}
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Est. Valuation
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#3fb950' }}>{ip.estimatedValuation}</div>
          </div>
          <div className="card">
            <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Codebase Reference
            </div>
            <div style={{ fontSize: 12, color: '#58a6ff', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {ip.codeReference.function}
            </div>
          </div>
        </div>

        {relatedIPs.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: 20, color: '#f0f6fc', marginBottom: 16 }}>Related IPs</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
              {relatedIPs.map((related) => (
                <Link
                  key={related.id}
                  href={`/ip/${related.slug}`}
                  className="card"
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 4 }}>
                    Tier {related.tier} · #{related.id}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f6fc' }}>{related.shortTitle}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            padding: 32,
            background: 'linear-gradient(135deg, rgba(88, 166, 255, 0.08), rgba(63, 185, 80, 0.06))',
            border: '1px solid #21262d',
            borderRadius: 12,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: '#f0f6fc', marginBottom: 12 }}>
            Interested in this IP?
          </div>
          <p style={{ fontSize: 15, color: '#c9d1d9', marginBottom: 24 }}>
            Discuss licensing, co-development, or acquisition.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/partners" className="btn-primary">
              Licensing Discussion
            </Link>
            <Link href="/contact" className="btn-secondary">
              General Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
