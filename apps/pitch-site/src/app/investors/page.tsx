import React from 'react';
import Link from 'next/link';

export default function InvestorsPage() {
  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <div
          style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: 20,
            background: 'rgba(88, 166, 255, 0.12)',
            border: '1px solid rgba(88, 166, 255, 0.3)',
            fontSize: 13,
            color: '#58a6ff',
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          FOR INVESTORS
        </div>

        <h1
          style={{ fontSize: 52, fontWeight: 800, color: '#f0f6fc', lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em' }}
        >
          $5M seed to unlock a $186B market
        </h1>

        <p style={{ fontSize: 20, color: '#c9d1d9', lineHeight: 1.6, marginBottom: 48, maxWidth: 800 }}>
          Fund FDA 510(k) clearance, three pilot deployments across assisted living networks, and
          clinical validation against MMSE/MoCA. 12-month runway to Series A with defensible IP
          moat and reimbursement pathway.
        </p>

        {/* Market sizing */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#f0f6fc', marginBottom: 24 }}>Market Sizing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            <div className="card">
              <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 8 }}>TAM — Global Dementia Care</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#58a6ff', marginBottom: 8 }}>$186B</div>
              <div style={{ fontSize: 12, color: '#8b949e' }}>
                55M people with dementia globally. Growing 10M/year. WHO forecast $286B by 2030.
              </div>
            </div>
            <div className="card">
              <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 8 }}>SAM — Digital Therapeutics</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#3fb950', marginBottom: 8 }}>$23B</div>
              <div style={{ fontSize: 12, color: '#8b949e' }}>
                Digital health addressable segment. 26% CAGR. Akili, Pear, Cognoa as reference points.
              </div>
            </div>
            <div className="card">
              <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 8 }}>SOM — 5-Year</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#d29922', marginBottom: 8 }}>$450M</div>
              <div style={{ fontSize: 12, color: '#8b949e' }}>
                US assisted living + memory care facilities. 30K+ facilities, avg 80 beds.
              </div>
            </div>
          </div>
        </section>

        {/* Business model */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#f0f6fc', marginBottom: 24 }}>Business Model</h2>
          <div className="card">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 32,
                marginBottom: 32,
              }}
            >
              <div>
                <div style={{ fontSize: 14, color: '#58a6ff', fontWeight: 600, marginBottom: 8 }}>
                  B2B2C — Facility SaaS
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#f0f6fc', marginBottom: 4 }}>
                  $6,000 / bed / year
                </div>
                <div style={{ fontSize: 13, color: '#8b949e' }}>
                  Sold to assisted living and memory care facility networks.
                </div>
              </div>
              <div>
                <div style={{ fontSize: 14, color: '#3fb950', fontWeight: 600, marginBottom: 8 }}>
                  Digital Therapeutic
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#f0f6fc', marginBottom: 4 }}>
                  $180 / patient / month
                </div>
                <div style={{ fontSize: 13, color: '#8b949e' }}>
                  Reimbursable DTx prescription. Post-510(k).
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #21262d', paddingTop: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f6fc', marginBottom: 12 }}>
                Unit economics
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 4 }}>CAC (Facility)</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#f0f6fc' }}>$3,000</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 4 }}>LTV (Facility)</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#3fb950' }}>$180,000</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 4 }}>LTV/CAC</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#3fb950' }}>60×</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 4 }}>Annual Churn</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#d29922' }}>8%</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Revenue projections */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#f0f6fc', marginBottom: 24 }}>
            Revenue Projections
          </h2>
          <div className="card">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #21262d' }}>
                  {['Year', 'Facilities', 'Patients', 'ARR', 'YoY Growth'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#8b949e',
                        textTransform: 'uppercase',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { year: 'Y1', facilities: 8, patients: 640, arr: '$500K', growth: '—' },
                  { year: 'Y2', facilities: 32, patients: 2560, arr: '$3.8M', growth: '660%' },
                  { year: 'Y3', facilities: 110, patients: 8800, arr: '$14M', growth: '268%' },
                  { year: 'Y4', facilities: 280, patients: 22400, arr: '$38M', growth: '171%' },
                  { year: 'Y5', facilities: 580, patients: 46400, arr: '$85M', growth: '124%' },
                ].map((row) => (
                  <tr key={row.year} style={{ borderBottom: '1px solid #21262d' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#f0f6fc' }}>{row.year}</td>
                    <td style={{ padding: '12px 16px', color: '#c9d1d9' }}>{row.facilities}</td>
                    <td style={{ padding: '12px 16px', color: '#c9d1d9' }}>{row.patients.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#3fb950' }}>{row.arr}</td>
                    <td style={{ padding: '12px 16px', color: '#8b949e' }}>{row.growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 11, color: '#8b949e', marginTop: 16, fontStyle: 'italic' }}>
              Projections assume 510(k) clearance by end of Y2 enabling reimbursable DTx pricing.
              Year 5 ARR excludes potential pharma licensing ($5M-$30M deal potential).
            </div>
          </div>
        </section>

        {/* Competitive moat */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#f0f6fc', marginBottom: 24 }}>Competitive Moat</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {[
              {
                title: 'IP Portfolio',
                text: '23 patentable innovations across 5 categories. USPTO provisionals in flight. Expected $22M-$56M portfolio value.',
              },
              {
                title: 'FDA SaMD Pathway',
                text: 'IEC 62304, ISO 14971 FMEA, QMS, STRIDE docs complete. 510(k) predicate identified. Clinical validation protocol drafted.',
              },
              {
                title: 'Platform Breadth',
                text: '5 apps (mobile + 4 dashboards), 30+ API routes, 10 languages with RTL, FHIR R4 integration, Apple Watch app.',
              },
              {
                title: 'Production-Ready Code',
                text: '53K+ lines, 60+ test files, CI/CD, Prometheus/Grafana monitoring, multi-tenant architecture, HIPAA-ready.',
              },
            ].map((m) => (
              <div key={m.title} className="card">
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f0f6fc', marginBottom: 8 }}>{m.title}</div>
                <p style={{ fontSize: 14, color: '#c9d1d9', lineHeight: 1.6 }}>{m.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The ask */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#f0f6fc', marginBottom: 24 }}>The Ask</h2>
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, rgba(88, 166, 255, 0.1), rgba(63, 185, 80, 0.08))',
              padding: 32,
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 800, color: '#f0f6fc', marginBottom: 8 }}>$5,000,000</div>
            <div style={{ fontSize: 16, color: '#c9d1d9', marginBottom: 24 }}>
              Seed round to secure 12-month runway to Series A
            </div>

            <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f6fc', marginBottom: 12 }}>Use of funds:</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {[
                { label: 'FDA 510(k) preparation + submission', amount: '$1.5M', pct: '30%' },
                { label: '3 pilot deployments + clinical validation', amount: '$1.5M', pct: '30%' },
                { label: 'Engineering (6 FTE)', amount: '$1.2M', pct: '24%' },
                { label: 'Non-provisional patent conversions (8)', amount: '$600K', pct: '12%' },
                { label: 'Sales & partnerships', amount: '$400K', pct: '8%' },
                { label: 'Legal, ops, reserves', amount: '$300K', pct: '6%' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: '#c9d1d9' }}>{item.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#3fb950' }}>
                    {item.amount} <span style={{ color: '#8b949e', fontWeight: 400 }}>({item.pct})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={{ textAlign: 'center' }}>
          <Link href="/contact" className="btn-primary" style={{ fontSize: 18, padding: '16px 40px' }}>
            Schedule investor meeting →
          </Link>
        </div>
      </div>
    </div>
  );
}
