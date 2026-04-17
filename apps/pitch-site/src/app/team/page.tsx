import React from 'react';
import Link from 'next/link';

export default function TeamPage() {
  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: '#f0f6fc', lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Team & Advisors
        </h1>
        <p style={{ fontSize: 18, color: '#c9d1d9', marginBottom: 48, maxWidth: 800 }}>
          Founders, clinical advisors, and technical experts building the next generation of
          dementia care technology.
        </p>

        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f0f6fc', marginBottom: 24 }}>Founders</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            <div className="card">
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  background: 'linear-gradient(135deg, #58a6ff, #3fb950)',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                F1
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f6fc', marginBottom: 4 }}>[Founder Name]</div>
              <div style={{ fontSize: 13, color: '#58a6ff', marginBottom: 12 }}>Founder &amp; CEO</div>
              <p style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.6 }}>
                [Founder bio to be populated. Background in healthtech, clinical operations, or
                relevant field.]
              </p>
            </div>
            <div className="card">
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  background: 'linear-gradient(135deg, #3fb950, #58a6ff)',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                F2
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f6fc', marginBottom: 4 }}>[Founder Name]</div>
              <div style={{ fontSize: 13, color: '#3fb950', marginBottom: 12 }}>Founder &amp; CTO</div>
              <p style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.6 }}>
                [Founder bio to be populated. Background in ML/AI, software architecture, or
                relevant field.]
              </p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f0f6fc', marginBottom: 24 }}>
            Clinical Advisory Board (Recruiting)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { role: 'Dementia Neurologist', institution: 'Academic medical center' },
              { role: 'Geriatric Psychiatrist', institution: 'Memory disorders clinic' },
              { role: 'Clinical Research Director', institution: 'NIH-funded center' },
              { role: 'Caregiver Program Director', institution: 'Assisted living network' },
              { role: 'Regulatory Affairs Expert', institution: 'Former FDA reviewer' },
              { role: 'Bioethics Researcher', institution: 'Academic bioethics program' },
            ].map((advisor) => (
              <div key={advisor.role} className="card">
                <div style={{ fontSize: 14, fontWeight: 600, color: '#58a6ff', marginBottom: 4 }}>Open role</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#f0f6fc', marginBottom: 8 }}>{advisor.role}</div>
                <div style={{ fontSize: 13, color: '#8b949e' }}>{advisor.institution}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, fontSize: 13, color: '#8b949e', textAlign: 'center' }}>
            Interested clinicians and researchers — please{' '}
            <Link href="/contact" style={{ color: '#58a6ff' }}>
              get in touch
            </Link>
            .
          </div>
        </section>

        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f0f6fc', marginBottom: 24 }}>Technical Advisors (Recruiting)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              'ML / Digital Biomarkers',
              'FDA SaMD Regulatory Strategy',
              'Clinical Informatics / FHIR',
              'Voice AI / Speech Processing',
              'Enterprise Healthcare Sales',
              'Pharma Business Development',
            ].map((area) => (
              <div key={area} className="card" style={{ fontSize: 14, color: '#c9d1d9', padding: 20 }}>
                {area}
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
            Join our advisory team
          </h2>
          <p style={{ fontSize: 15, color: '#c9d1d9', marginBottom: 24 }}>
            Clinical advisors receive equity participation and quarterly stipends. Technical
            advisors engaged on specific projects.
          </p>
          <Link href="/contact" className="btn-primary">
            Express interest
          </Link>
        </div>
      </div>
    </div>
  );
}
