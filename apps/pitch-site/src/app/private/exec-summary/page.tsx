import React from 'react';

export const metadata = {
  title: 'Executive Summary — Gentle Reminder',
};

export default function ExecSummaryPage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body { background: white !important; color: black !important; }
          nav, .no-print, footer { display: none !important; }
          .page {
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 24px !important;
            font-size: 10pt !important;
          }
          .page h1 { color: #1a7bc4 !important; }
          .page h2 { color: #0e476e !important; }
          .page strong { color: #0e476e !important; }
          .chip-ip { background: #e8f4fd !important; color: #1a7bc4 !important; border-color: #88caf1 !important; }
          .chip-fda { background: #edf5f0 !important; color: #244b33 !important; border-color: #a3cbb2 !important; }
        }
        @page { size: letter; margin: 0.5in; }
      `,
        }}
      />

      <div
        className="no-print"
        style={{
          background: '#161b22',
          padding: '14px 20px',
          margin: '24px auto',
          maxWidth: 820,
          border: '1px solid #21262d',
          borderRadius: 8,
          fontSize: 13,
          color: '#c9d1d9',
        }}
      >
        <strong>🖨️ Print to PDF:</strong> Press <kbd style={{ background: '#0d1117', padding: '2px 6px', borderRadius: 3 }}>Cmd/Ctrl + P</kbd> → Save as PDF → Letter size → Portrait. Fits 1 page.
      </div>

      <div
        className="page"
        style={{
          maxWidth: 820,
          margin: '0 auto 40px',
          padding: 40,
          background: '#ffffff',
          color: '#1a1a2e',
          borderRadius: 8,
          fontFamily: '-apple-system, Segoe UI, Roboto, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ borderBottom: '3px solid #1a7bc4', paddingBottom: 14, marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a7bc4', margin: 0, letterSpacing: '-0.02em' }}>
              Gentle Reminder
            </h1>
            <span style={{ fontSize: 11, color: '#6b6b8d', fontWeight: 600, letterSpacing: '0.1em' }}>
              EXECUTIVE SUMMARY · SEED STAGE
            </span>
          </div>
          <div style={{ fontSize: 13, color: '#3a3a5c', marginTop: 6, fontStyle: 'italic' }}>
            The clinical-grade dementia care platform · 23 patented innovations · FDA SaMD pathway · $5M seed at $25M post-money
          </div>
        </div>

        {/* Problem */}
        <section style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: 12, fontWeight: 700, color: '#0e476e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Problem
          </h2>
          <p style={{ fontSize: 11, lineHeight: 1.5, margin: 0 }}>
            <strong>55M+ people live with dementia globally</strong>, projected to reach 139M by 2050. Standard cognitive
            tests (MMSE, MoCA, ADAS-Cog) produce pass/fail feedback that triggers documented anxiety, agitation, and
            session abandonment in dementia patients. Caregivers lack real-time digital biomarkers. Clinicians lack
            longitudinal decline-tracking tools. Pharma trials for anti-amyloid therapies (Leqembi, Kisunla) lack
            scalable digital endpoints. No dementia-safe alternative exists.
          </p>
        </section>

        {/* Solution */}
        <section style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: 12, fontWeight: 700, color: '#0e476e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Solution
          </h2>
          <p style={{ fontSize: 11, lineHeight: 1.5, margin: 0 }}>
            Gentle Reminder is a clinical-grade SaMD platform with <strong>23 novel algorithmic innovations</strong>.
            The core innovation — a <strong>three-state positive-only feedback system</strong> (CELEBRATED / GUIDED /
            SUPPORTED) — architecturally guarantees no negative feedback reaches the patient while preserving granular
            data for clinicians. Additional innovations: dementia-adapted spaced repetition, asymmetric adaptive
            difficulty, multimodal cognitive state classifier, 5-analyzer composite digital biomarker engine.
          </p>
        </section>

        {/* Traction + IP + FDA */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
          <section>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: '#0e476e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Traction
            </h2>
            <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10, lineHeight: 1.5 }}>
              <li>53,000+ LOC production</li>
              <li>5 deployed applications</li>
              <li>10 languages (RTL-aware)</li>
              <li>FHIR R4 EHR ready</li>
              <li>Apple Watch integrated</li>
              <li>4 grants drafted</li>
            </ul>
          </section>
          <section>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: '#0e476e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              IP Portfolio
            </h2>
            <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10, lineHeight: 1.5 }}>
              <li>23 USPTO provisionals</li>
              <li>5 Tier 1 (foundational)</li>
              <li>7 Tier 2 (strong claims)</li>
              <li>11 Tier 3 (system)</li>
              <li>$22M-$57M est. value</li>
              <li>Trade secrets retained</li>
            </ul>
          </section>
          <section>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: '#0e476e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              FDA Status
            </h2>
            <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10, lineHeight: 1.5 }}>
              <li>IEC 62304 ✓</li>
              <li>ISO 14971 FMEA ✓</li>
              <li>ISO 13485 QMS ✓</li>
              <li>21 CFR Part 11 ✓</li>
              <li>STRIDE cybersec ✓</li>
              <li>510(k) predicate: K201738</li>
            </ul>
          </section>
        </div>

        {/* Market */}
        <section style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: 12, fontWeight: 700, color: '#0e476e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Market Opportunity
          </h2>
          <div style={{ display: 'flex', gap: 20, fontSize: 11 }}>
            <div><strong>TAM:</strong> $186B (global dementia care)</div>
            <div><strong>SAM:</strong> $23B (US digital therapeutics)</div>
            <div><strong>SOM (5yr):</strong> $450M</div>
          </div>
        </section>

        {/* Business Model + Unit Economics */}
        <section style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: 12, fontWeight: 700, color: '#0e476e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Business Model
          </h2>
          <p style={{ fontSize: 11, lineHeight: 1.5, margin: '0 0 6px' }}>
            <strong>B2B Facility SaaS:</strong> $6,000/bed/year · <strong>B2B2C DTx (post-510k):</strong> $180/patient/month
            CPT-reimbursable · <strong>Pharma licensing:</strong> $2M-$10M/deal · <strong>Payer value-based:</strong> TBD.
          </p>
          <div style={{ fontSize: 11 }}>
            <strong>Unit economics (Facility):</strong> ACV $60K · CAC $3K · LTV $180K · <strong>LTV/CAC 60×</strong>
            · Gross margin 82% · Annual churn 8%
          </div>
        </section>

        {/* Revenue Projections */}
        <section style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: 12, fontWeight: 700, color: '#0e476e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Revenue Projections
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #6b6b8d' }}>
                <th style={{ padding: '4px 0', textAlign: 'left' }}>Year</th>
                <th style={{ padding: '4px 0', textAlign: 'right' }}>Facilities</th>
                <th style={{ padding: '4px 0', textAlign: 'right' }}>Patients</th>
                <th style={{ padding: '4px 0', textAlign: 'right' }}>ARR</th>
                <th style={{ padding: '4px 0', textAlign: 'left', paddingLeft: 12 }}>Key Milestone</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Y1', 8, '640', '$500K', 'Seed close; FDA submission'],
                ['Y2', 32, '2,560', '$3.8M', '510(k) clearance'],
                ['Y3', 110, '8,800', '$14M', 'Commercial launch + Series A'],
                ['Y4', 280, '22,400', '$38M', 'EBITDA positive'],
                ['Y5', 580, '46,400', '$85M', 'Strategic M&A or Series B'],
              ].map((r) => (
                <tr key={r[0] as string}>
                  <td style={{ padding: '3px 0' }}>{r[0]}</td>
                  <td style={{ padding: '3px 0', textAlign: 'right' }}>{r[1]}</td>
                  <td style={{ padding: '3px 0', textAlign: 'right' }}>{r[2]}</td>
                  <td style={{ padding: '3px 0', textAlign: 'right', fontWeight: 700, color: '#244b33' }}>{r[3]}</td>
                  <td style={{ padding: '3px 0', paddingLeft: 12, fontSize: 10 }}>{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Ask */}
        <section
          style={{
            marginBottom: 10,
            padding: 12,
            background: '#e8f4fd',
            border: '2px solid #1a7bc4',
            borderRadius: 6,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 12, fontWeight: 700, color: '#0e476e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                The Ask
              </h2>
              <p style={{ fontSize: 11, margin: 0, lineHeight: 1.4 }}>
                <strong>$5M seed</strong> at <strong>$25M post-money</strong>. 12-month runway to Series A.
                Uses: FDA 510(k) (25%), engineering (28%), pilots (12%), IP conversions (12%), sales (9%), ops (8%), clinical (5%).
              </p>
            </div>
          </div>
        </section>

        {/* Team + Contact */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 }}>
          <section>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: '#0e476e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Team
            </h2>
            <p style={{ fontSize: 10, lineHeight: 1.5, margin: 0 }}>
              <strong>Christo Mac</strong> · Founder, CEO/COO · <strong>Leo Kinsman</strong> · CTO ·{' '}
              <strong>Chris Hamel</strong> · CFO · <strong>Jayla Patzer</strong> · Nat. Dir., Clinic & Provider
              Partnerships. Recruiting clinical + tech advisory (UCSF, MGH, Mayo; Topol, Tullman, Slavitt targets).
            </p>
          </section>
          <section>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: '#0e476e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Contact
            </h2>
            <p style={{ fontSize: 10, lineHeight: 1.5, margin: 0 }}>
              <strong>mack@matrixadvancedsolutions.com</strong> · [phone]
              <br />
              <strong>gentle-reminder-pitch.vercel.app</strong> · Full data room under NDA
            </p>
          </section>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #cbd5e0', paddingTop: 8, fontSize: 8, color: '#6b6b8d', textAlign: 'center' }}>
          Confidential — Do not distribute without written consent. All figures illustrative pre-revenue projections.
          Patent applications filed or in flight; not yet issued. FDA clearance not guaranteed; 510(k) submission targeted
          within 12 months of seed close.
        </div>
      </div>
    </>
  );
}
