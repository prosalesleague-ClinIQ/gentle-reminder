import React from 'react';
import Link from 'next/link';
import { CURRENT_TEAM, RECRUITING_ROLES } from '../../content/team';

export default function TeamPage() {
  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: '#f0f6fc', lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Team
        </h1>
        <p style={{ fontSize: 18, color: '#c9d1d9', marginBottom: 48, maxWidth: 800 }}>
          Founders, clinical advisors, and technical experts building the next generation of dementia care
          technology.
        </p>

        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f0f6fc', marginBottom: 24 }}>Founding Team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {CURRENT_TEAM.map((m) => (
              <div key={m.id} className="card">
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    background: m.gradient,
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                    fontWeight: 700,
                    color: '#ffffff',
                  }}
                >
                  {m.initials}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f6fc', marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontSize: 13, color: '#58a6ff', marginBottom: 12 }}>{m.role}</div>
                <p style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.6, marginBottom: 12 }}>{m.bio}</p>
                {m.linkedin && (
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 12,
                      color: '#58a6ff',
                      textDecoration: 'none',
                      borderBottom: '1px dotted #58a6ff',
                    }}
                  >
                    LinkedIn →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f0f6fc', marginBottom: 24 }}>
            Clinical Advisory Board (Recruiting)
          </h2>
          <p style={{ fontSize: 14, color: '#8b949e', marginBottom: 20, maxWidth: 700 }}>
            We are recruiting a board of 3-5 leading dementia researchers and clinicians to guide clinical
            validation, FDA strategy, and Phase II planning.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {[
              { role: 'Dementia Neurologist', institution: 'UCSF Memory and Aging Center / Mass General / Mayo Clinic' },
              { role: 'Geriatric Psychiatrist', institution: 'Johns Hopkins / Cleveland Clinic / Emory ADRC' },
              { role: 'Clinical Research Director', institution: 'NIH-funded memory center' },
              { role: 'FDA SaMD Regulatory Expert', institution: 'Former FDA CDRH reviewer (independent)' },
              { role: 'Digital Medicine Thought Leader', institution: 'Scripps / Stanford / MIT' },
              { role: 'Memory Care Facility Operator', institution: 'Brookdale / Sunrise / Atria (CMO/COO level)' },
            ].map((a, i) => (
              <div
                key={i}
                className="card"
                style={{ padding: 20 }}
              >
                <div style={{ fontSize: 12, color: '#58a6ff', fontWeight: 700, marginBottom: 4, letterSpacing: '0.05em' }}>
                  OPEN ROLE
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#f0f6fc', marginBottom: 6 }}>{a.role}</div>
                <div style={{ fontSize: 13, color: '#8b949e' }}>{a.institution}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f0f6fc', marginBottom: 20 }}>
            Key Hires Planned (Seed + Series A)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {RECRUITING_ROLES.map((r) => (
              <div
                key={r.id}
                className="card"
                style={{ padding: 20, display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'flex-start' }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#f0f6fc', marginBottom: 6 }}>{r.role}</div>
                  <div style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.6, marginBottom: 6 }}>{r.description}</div>
                  <div style={{ fontSize: 11, color: '#8b949e' }}>{r.compensation}</div>
                </div>
                <span
                  className="chip"
                  style={{
                    background: r.timing === 'now' ? 'rgba(248, 81, 73, 0.15)' : r.timing === 'seed-close' ? 'rgba(88, 166, 255, 0.15)' : 'rgba(167, 113, 247, 0.15)',
                    color: r.timing === 'now' ? '#f85149' : r.timing === 'seed-close' ? '#58a6ff' : '#a371f7',
                    border: `1px solid ${r.timing === 'now' ? 'rgba(248, 81, 73, 0.3)' : r.timing === 'seed-close' ? 'rgba(88, 166, 255, 0.3)' : 'rgba(167, 113, 247, 0.3)'}`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {r.timing === 'now' ? 'Now' : r.timing === 'seed-close' ? 'Seed close' : 'Series A'}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div
          style={{
            padding: 40,
            background: 'linear-gradient(135deg, rgba(88, 166, 255, 0.08), rgba(63, 185, 80, 0.06))',
            border: '1px solid #21262d',
            borderRadius: 12,
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f6fc', marginBottom: 12 }}>
            Join us in changing dementia care
          </h2>
          <p style={{ fontSize: 15, color: '#c9d1d9', marginBottom: 24 }}>
            Clinical advisors receive equity participation. Technical advisors engaged on specific projects.
            Open roles fill post-seed close.
          </p>
          <Link href="/contact" className="btn-primary">
            Express interest
          </Link>
        </div>
      </div>
    </div>
  );
}
