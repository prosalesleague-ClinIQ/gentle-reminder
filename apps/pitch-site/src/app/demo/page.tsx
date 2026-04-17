import React from 'react';
import Link from 'next/link';

export default function DemoPage() {
  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: '#f0f6fc', lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Platform Demo
        </h1>
        <p style={{ fontSize: 18, color: '#c9d1d9', marginBottom: 48, maxWidth: 800 }}>
          Explore the live platform. Five applications deployed and operational.
        </p>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f6fc', marginBottom: 20 }}>Live Deployments</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {[
              {
                title: 'Caregiver Dashboard',
                description:
                  '20 pages — patient overview, care tasks, alerts, analytics, sleep, risk, handoff, engagement, messaging.',
                url: 'https://gentle-reminder-dashboard.vercel.app',
                color: '#58a6ff',
              },
              {
                title: 'Clinician Dashboard',
                description:
                  '7 pages — biomarker viewer, patient timeline, medication review, clinical reports, research data.',
                url: 'https://gentle-reminder-clinical.vercel.app',
                color: '#3fb950',
              },
              {
                title: 'Admin Portal',
                description:
                  '9 pages — user management, facilities, billing, compliance, audit log, tenants, system health.',
                url: '#',
                color: '#d29922',
              },
              {
                title: 'Family Dashboard',
                description:
                  '8 pages — photos, messages, progress, medications, billing, settings for family engagement.',
                url: '#',
                color: '#a371f7',
              },
            ].map((deployment) => (
              <div key={deployment.title} className="card">
                <div style={{ fontSize: 16, fontWeight: 700, color: deployment.color, marginBottom: 8 }}>
                  {deployment.title}
                </div>
                <p style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.6, marginBottom: 16 }}>
                  {deployment.description}
                </p>
                {deployment.url !== '#' ? (
                  <a
                    href={deployment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 14, color: deployment.color, fontWeight: 600 }}
                  >
                    Open live app →
                  </a>
                ) : (
                  <span style={{ fontSize: 13, color: '#8b949e' }}>Deployment link on request</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f6fc', marginBottom: 20 }}>Mobile Apps</h2>
          <div className="card">
            <div style={{ fontSize: 15, color: '#c9d1d9', lineHeight: 1.8 }}>
              <strong style={{ color: '#f0f6fc' }}>iPad / iPhone (Expo React Native):</strong> 48
              screens including cognitive exercises (orientation, memory, clock drawing, pattern
              recognition), morning routine, mood check, SOS, music therapy, photo gallery, voice
              companion, and family messaging.
              <br />
              <br />
              <strong style={{ color: '#f0f6fc' }}>Apple Watch (SwiftUI):</strong> HealthKit
              integration, medication reminders, breathing exercises, fall detection with 60s
              countdown, complications.
              <br />
              <br />
              Mobile demos available via TestFlight on request.
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f6fc', marginBottom: 20 }}>
            Demo Accounts
          </h2>
          <div className="card">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #21262d' }}>
                  {['Role', 'Email', 'Password'].map((h) => (
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
                  { role: 'Patient', email: 'margaret@example.com', pw: 'demo123456' },
                  { role: 'Caregiver', email: 'nurse.sarah@example.com', pw: 'demo123456' },
                  { role: 'Family', email: 'lisa.thompson@example.com', pw: 'demo123456' },
                  { role: 'Clinician', email: 'dr.chen@example.com', pw: 'demo123456' },
                ].map((acct) => (
                  <tr key={acct.role} style={{ borderBottom: '1px solid #21262d' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#f0f6fc' }}>{acct.role}</td>
                    <td style={{ padding: '12px 16px', color: '#58a6ff', fontFamily: 'monospace', fontSize: 13 }}>
                      {acct.email}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#c9d1d9', fontFamily: 'monospace', fontSize: 13 }}>
                      {acct.pw}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            Want a guided walkthrough?
          </h2>
          <p style={{ fontSize: 15, color: '#c9d1d9', marginBottom: 24 }}>
            Request a 30-minute personalized demo with the founders.
          </p>
          <Link href="/contact" className="btn-primary">
            Schedule walkthrough
          </Link>
        </div>
      </div>
    </div>
  );
}
