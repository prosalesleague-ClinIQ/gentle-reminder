import React from 'react';
import Link from 'next/link';

export default function PartnersPage() {
  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <div
          style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: 20,
            background: 'rgba(63, 185, 80, 0.12)',
            border: '1px solid rgba(63, 185, 80, 0.3)',
            fontSize: 13,
            color: '#3fb950',
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          FOR STRATEGIC PARTNERS
        </div>

        <h1 style={{ fontSize: 52, fontWeight: 800, color: '#f0f6fc', lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em' }}>
          Licensing, co-development, acquisition
        </h1>

        <p style={{ fontSize: 20, color: '#c9d1d9', lineHeight: 1.6, marginBottom: 48, maxWidth: 800 }}>
          23 patentable innovations available for field-of-use licensing, co-development with
          pharma/MedTech/payers/care operators, or strategic acquisition of the full portfolio
          and platform.
        </p>

        {/* Partnership models */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#f0f6fc', marginBottom: 24 }}>Partnership Models</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              {
                title: 'Field-of-Use License',
                description:
                  'Exclusive or non-exclusive license in a defined therapeutic area, geography, or channel. Upfront + milestone + royalty structure.',
                exampleUse: 'Pharma companion app to anti-amyloid therapy',
              },
              {
                title: 'Co-Development',
                description:
                  'Joint development of a co-branded product. Shared IP, shared investment, shared revenue. Typical: pharma + platform co-commercialization.',
                exampleUse: 'MedTech device + digital endpoint bundle',
              },
              {
                title: 'Platform Acquisition',
                description:
                  'Full acquisition of IP portfolio, production platform, and team. Fastest path to market for a large strategic.',
                exampleUse: 'Biotech expanding into digital therapeutics',
              },
            ].map((model) => (
              <div key={model.title} className="card">
                <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f6fc', marginBottom: 12 }}>
                  {model.title}
                </div>
                <p style={{ fontSize: 14, color: '#c9d1d9', lineHeight: 1.6, marginBottom: 16 }}>
                  {model.description}
                </p>
                <div
                  style={{
                    fontSize: 12,
                    color: '#3fb950',
                    paddingTop: 12,
                    borderTop: '1px solid #21262d',
                  }}
                >
                  Example: {model.exampleUse}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Target partners */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#f0f6fc', marginBottom: 24 }}>Target Partners</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {[
              {
                category: 'Pharma — Anti-Amyloid Therapy',
                partners: ['Biogen (Leqembi, Aduhelm)', 'Eisai (Leqembi co-marketer)', 'Eli Lilly (Kisunla)', 'Novo Nordisk (dementia pipeline)'],
                use: 'Cognitive maintenance companion app. Real-world outcome tracking. Adherence support.',
              },
              {
                category: 'MedTech — Cognitive Monitoring',
                partners: ['Medtronic (neuromodulation)', 'Philips Healthcare (population health)', 'GE Healthcare (imaging + monitoring)', 'Apple Health (HealthKit integration)'],
                use: 'Digital biomarker integration. Wearable signal processing. Remote monitoring bundle.',
              },
              {
                category: 'Payers — Value-Based Care',
                partners: ['UnitedHealth Group / Optum', 'Humana (Medicare Advantage)', 'Kaiser Permanente', 'Aetna / CVS Health'],
                use: 'Risk stratification. Early intervention. Utilization reduction. Medicare Advantage differentiation.',
              },
              {
                category: 'Care Operators — Facility Networks',
                partners: ['Brookdale Senior Living', 'Sunrise Senior Living', 'Atria Senior Living', 'Belmont Village Senior Living'],
                use: 'Facility-wide deployment. Staff efficiency. Family engagement. Census retention.',
              },
            ].map((seg) => (
              <div key={seg.category} className="card">
                <div style={{ fontSize: 16, fontWeight: 700, color: '#58a6ff', marginBottom: 12 }}>
                  {seg.category}
                </div>
                <ul style={{ paddingLeft: 16, margin: '12px 0', color: '#c9d1d9', fontSize: 13 }}>
                  {seg.partners.map((p) => (
                    <li key={p} style={{ marginBottom: 4 }}>
                      {p}
                    </li>
                  ))}
                </ul>
                <div
                  style={{
                    fontSize: 12,
                    color: '#8b949e',
                    paddingTop: 12,
                    borderTop: '1px solid #21262d',
                    lineHeight: 1.6,
                  }}
                >
                  {seg.use}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* License term sheet */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#f0f6fc', marginBottom: 24 }}>
            Starting License Term Sheet
          </h2>
          <div className="card">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  ['Licensed IP', 'One or more of 23 IPs (selectable)'],
                  ['Field of Use', 'Defined therapeutic area (e.g., "Alzheimer\'s cognitive maintenance")'],
                  ['Geography', 'Worldwide, or specified jurisdictions'],
                  ['Exclusivity', 'Exclusive, co-exclusive, or non-exclusive'],
                  ['Upfront Fee', '$250K-$2M per IP (tier-dependent)'],
                  ['Milestone Payments', '$500K-$5M per milestone (FDA clearance, first commercial sale)'],
                  ['Royalty Rate', '4-12% of Net Sales (tier-dependent)'],
                  ['Minimum Annual Royalty', '$100K-$500K'],
                  ['Sublicensing', 'Permitted with 25-35% shareback'],
                  ['Term', 'Patent life + 5 years; terminable for material breach'],
                  ['Diligence', 'Commercial launch within 18 months of FDA clearance'],
                ].map(([key, value]) => (
                  <tr key={key} style={{ borderBottom: '1px solid #21262d' }}>
                    <td
                      style={{
                        padding: '12px 0',
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#8b949e',
                        width: '35%',
                      }}
                    >
                      {key}
                    </td>
                    <td style={{ padding: '12px 0', fontSize: 14, color: '#c9d1d9' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <div
          style={{
            padding: 40,
            background: 'linear-gradient(135deg, rgba(63, 185, 80, 0.1), rgba(88, 166, 255, 0.06))',
            border: '1px solid #21262d',
            borderRadius: 12,
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f0f6fc', marginBottom: 12 }}>
            Start a partnership conversation
          </h2>
          <p style={{ fontSize: 15, color: '#c9d1d9', marginBottom: 24, maxWidth: 640, margin: '0 auto 24px' }}>
            Under NDA, we share the full IP portfolio, clinical validation data, FDA SaMD
            documentation, and financial model.
          </p>
          <Link href="/contact" className="btn-primary">
            Request NDA & materials
          </Link>
        </div>
      </div>
    </div>
  );
}
