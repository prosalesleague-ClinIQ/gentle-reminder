import React from 'react';
import Link from 'next/link';

const grants = [
  {
    program: 'NIA SBIR Phase I',
    amount: '$275,000',
    duration: '6 months',
    deadlines: 'Sep 5, Jan 5, Apr 5 (annually)',
    focus: 'Feasibility of commercial digital health innovation for Alzheimer\'s and related dementias.',
    fit: 'Perfect for pilot validation of gentle feedback scoring against MMSE in a small cohort.',
  },
  {
    program: 'NIA SBIR Phase II',
    amount: '$1,500,000',
    duration: '2 years',
    deadlines: 'Following successful Phase I',
    focus: 'Scale-up and commercialization preparation for proven Phase I concepts.',
    fit: 'Multi-site clinical validation, FDA pre-submission meeting support.',
  },
  {
    program: 'NIA SBIR Fast-Track',
    amount: '$1,800,000',
    duration: '2.5 years combined',
    deadlines: 'Sep 5, Jan 5, Apr 5',
    focus: 'Combined Phase I + Phase II for strong applications.',
    fit: 'Ideal path if early validation data is compelling.',
  },
  {
    program: 'NIH R01 (NINDS or NIA)',
    amount: '$500,000/year × 5 years = $2.5M',
    duration: '5 years',
    deadlines: 'Feb, Jun, Oct (annually)',
    focus: 'Investigator-initiated research projects. Requires academic PI collaboration.',
    fit: 'Partnership with academic medical center (e.g., UCSF Memory Clinic, Mass General, Emory).',
  },
  {
    program: 'BrightFocus Alzheimer\'s Research',
    amount: '$300,000',
    duration: '3 years',
    deadlines: 'Nov annually',
    focus: 'Novel Alzheimer\'s disease research and early-stage validation.',
    fit: 'Biomarker validation studies, patient-reported outcomes.',
  },
  {
    program: 'Alzheimer\'s Association Research Grants',
    amount: '$150K-$500K',
    duration: '1-3 years',
    deadlines: 'Multiple cycles annually',
    focus: 'Multiple programs including Research Grant Program (RGP) and Part the Cloud (therapy development).',
    fit: 'Therapeutic intervention studies, caregiver outcomes.',
  },
];

export default function GrantsPage() {
  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <div
          style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: 20,
            background: 'rgba(210, 153, 34, 0.12)',
            border: '1px solid rgba(210, 153, 34, 0.3)',
            fontSize: 13,
            color: '#d29922',
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          FOR GRANT FUNDERS & PROGRAM OFFICERS
        </div>

        <h1 style={{ fontSize: 52, fontWeight: 800, color: '#f0f6fc', lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em' }}>
          Non-dilutive funding for clinical validation
        </h1>

        <p style={{ fontSize: 20, color: '#c9d1d9', lineHeight: 1.6, marginBottom: 48, maxWidth: 800 }}>
          NIH, NIA, SBIR, and foundation grants to validate novel digital biomarkers and cognitive
          assessment methods in dementia populations. Multiple specific aims aligned with our 23
          IPs and the NIA strategic plan.
        </p>

        {/* Grant programs */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#f0f6fc', marginBottom: 24 }}>Target Programs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {grants.map((grant) => (
              <div key={grant.program} className="card">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 12,
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#f0f6fc' }}>{grant.program}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#3fb950' }}>{grant.amount}</div>
                </div>
                <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 12 }}>
                  <strong>Duration:</strong> {grant.duration} &middot; <strong>Deadlines:</strong>{' '}
                  {grant.deadlines}
                </div>
                <p style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.5, marginBottom: 12 }}>
                  {grant.focus}
                </p>
                <div
                  style={{
                    fontSize: 12,
                    color: '#d29922',
                    paddingTop: 12,
                    borderTop: '1px solid #21262d',
                    lineHeight: 1.6,
                  }}
                >
                  <strong>Our fit:</strong> {grant.fit}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Scientific rigor */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#f0f6fc', marginBottom: 24 }}>Scientific Rigor</h2>
          <div className="card">
            <p style={{ fontSize: 15, color: '#c9d1d9', lineHeight: 1.8, marginBottom: 16 }}>
              Our clinical validation protocol (available at <code style={{ color: '#58a6ff' }}>docs/clinical-validation/</code>) includes:
            </p>
            <ul style={{ paddingLeft: 20, color: '#c9d1d9', fontSize: 15, lineHeight: 1.8 }}>
              <li>Prospective, controlled study design with power calculations</li>
              <li>Concurrent MMSE, MoCA, and ADAS-Cog validation</li>
              <li>IRB-approved protocol with informed consent framework</li>
              <li>Statistical analysis plan (paired t-test, Wilcoxon, Cohen\'s d)</li>
              <li>Pre-registered specific aims and outcome measures</li>
              <li>21 CFR Part 11-compliant electronic data capture</li>
              <li>Real-world evidence collection framework</li>
              <li>Algorithm transparency documentation for FDA SaMD</li>
            </ul>
          </div>
        </section>

        {/* Specific aims */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#f0f6fc', marginBottom: 24 }}>
            Specific Aims (SBIR Phase I example)
          </h2>
          <div className="card">
            <div style={{ fontSize: 13, color: '#d29922', fontWeight: 600, marginBottom: 12 }}>
              AIM 1 — Validate the Gentle Feedback Scoring System
            </div>
            <p style={{ fontSize: 14, color: '#c9d1d9', marginBottom: 24, lineHeight: 1.6 }}>
              Compare three-state positive-only feedback against standard MMSE/MoCA in a 60-patient
              cohort (30 mild, 30 moderate Alzheimer\'s) across session completion rates, patient-
              reported anxiety, and clinician-rated validity.
            </p>

            <div style={{ fontSize: 13, color: '#d29922', fontWeight: 600, marginBottom: 12 }}>
              AIM 2 — Validate Digital Biomarkers Against Clinical Decline
            </div>
            <p style={{ fontSize: 14, color: '#c9d1d9', marginBottom: 24, lineHeight: 1.6 }}>
              Correlate composite digital biomarker scores (speech, response time, sleep, routine)
              with 6-month clinical decline trajectory measured by standard tools. Target: Pearson
              r ≥ 0.65.
            </p>

            <div style={{ fontSize: 13, color: '#d29922', fontWeight: 600, marginBottom: 12 }}>
              AIM 3 — Demonstrate Family/Caregiver Benefit
            </div>
            <p style={{ fontSize: 14, color: '#c9d1d9', lineHeight: 1.6 }}>
              Measure caregiver burden (Zarit Burden Interview) at baseline and 3 months with and
              without platform use. Target: 20% reduction in ZBI score.
            </p>
          </div>
        </section>

        {/* Collaborators */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#f0f6fc', marginBottom: 24 }}>
            Collaborating Institutions (Seeking)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              'UCSF Memory and Aging Center',
              'Mass General Hospital Memory Disorders Unit',
              'Emory Alzheimer\'s Disease Research Center',
              'Johns Hopkins Memory and Alzheimer\'s Treatment Center',
              'Cleveland Clinic Lou Ruvo Center',
              'Mayo Clinic Alzheimer\'s Disease Research Center',
            ].map((institution) => (
              <div
                key={institution}
                className="card"
                style={{ fontSize: 13, color: '#c9d1d9', textAlign: 'center', padding: 16 }}
              >
                {institution}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: '#8b949e', marginTop: 16, textAlign: 'center' }}>
            We are recruiting academic clinical co-investigators. Letters of support provided upon inquiry.
          </div>
        </section>

        {/* CTA */}
        <div
          style={{
            padding: 40,
            background: 'linear-gradient(135deg, rgba(210, 153, 34, 0.1), rgba(88, 166, 255, 0.06))',
            border: '1px solid #21262d',
            borderRadius: 12,
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f0f6fc', marginBottom: 12 }}>
            Discuss a grant collaboration
          </h2>
          <p style={{ fontSize: 15, color: '#c9d1d9', marginBottom: 24, maxWidth: 640, margin: '0 auto 24px' }}>
            Program officers, academic PIs, and research administrators welcome.
          </p>
          <Link href="/contact" className="btn-primary">
            Start grant discussion
          </Link>
        </div>
      </div>
    </div>
  );
}
