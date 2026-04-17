import React from 'react';
import Link from 'next/link';

export default function ClinicalPage() {
  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: '#f0f6fc', lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Clinical & FDA Regulatory Pathway
        </h1>
        <p style={{ fontSize: 18, color: '#c9d1d9', marginBottom: 48, maxWidth: 800 }}>
          FDA Software as a Medical Device (SaMD) Class II pathway with complete regulatory
          documentation, clinical validation protocol, and post-market surveillance framework.
        </p>

        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f0f6fc', marginBottom: 20 }}>
            Regulatory Compliance Status
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {[
              {
                title: 'IEC 62304 — Software Lifecycle',
                status: 'Complete',
                details:
                  'Software development plan, requirements specification, architecture design — all documented per Class B medical device software lifecycle.',
              },
              {
                title: 'ISO 14971 — Risk Management',
                status: 'Complete',
                details: 'Risk management plan with hazard analysis (FMEA), residual risk evaluation, risk-benefit determination.',
              },
              {
                title: 'ISO 13485 — QMS',
                status: 'Complete',
                details: 'Quality Management System framework with complaint handling, CAPA, document control, and design controls.',
              },
              {
                title: '21 CFR Part 11 — Electronic Records',
                status: 'Complete',
                details: 'SHA-256 hash-chain audit trail, electronic signatures with meaning fields, audit-ready data capture.',
              },
              {
                title: 'HIPAA Compliance',
                status: 'Ready',
                details: 'Multi-tenant data isolation, encryption at rest/transit, BAA-ready terms, access controls.',
              },
              {
                title: 'STRIDE Cybersecurity Assessment',
                status: 'Complete',
                details: 'Threat model covering Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation of Privilege.',
              },
              {
                title: 'Clinical Validation Protocol',
                status: 'Drafted',
                details: 'Study design with power calculations, concurrent MMSE/MoCA/ADAS-Cog validation, IRB-ready.',
              },
              {
                title: 'Algorithm Transparency',
                status: 'Complete',
                details: 'Integrated transparency module producing human-readable explanations for FDA algorithm review.',
              },
            ].map((item) => (
              <div key={item.title} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#f0f6fc' }}>{item.title}</div>
                  <span className="chip" style={{ background: 'rgba(63, 185, 80, 0.15)', color: '#3fb950', border: '1px solid rgba(63, 185, 80, 0.3)' }}>
                    {item.status}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.5 }}>{item.details}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f0f6fc', marginBottom: 20 }}>
            SaMD Classification & Predicate
          </h2>
          <div className="card">
            <p style={{ fontSize: 15, color: '#c9d1d9', lineHeight: 1.8, marginBottom: 16 }}>
              Under the IMDRF SaMD Framework, the platform operates in{' '}
              <strong style={{ color: '#58a6ff' }}>Category III.i</strong> (inform clinical
              management of serious conditions). This corresponds to FDA Class II medical device
              software, subject to 510(k) clearance.
            </p>

            <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f6fc', marginBottom: 8, marginTop: 20 }}>
              Candidate predicates:
            </div>
            <ul style={{ paddingLeft: 20, color: '#c9d1d9', fontSize: 14, lineHeight: 1.8 }}>
              <li>
                <strong>K201738 (Linus Health):</strong> Digital cognitive assessment cleared 2020
              </li>
              <li>
                <strong>K182554 (Cogstate):</strong> Brief computerized cognitive assessment
              </li>
              <li>
                <strong>K172872 (DigitalMD):</strong> Alzheimer\'s assessment support tool
              </li>
            </ul>

            <div style={{ fontSize: 13, color: '#8b949e', marginTop: 16, lineHeight: 1.6 }}>
              Our 510(k) submission will demonstrate substantial equivalence to a predicate while
              highlighting our novel safety improvements (gentle feedback system, adaptive
              difficulty preventing frustration).
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f0f6fc', marginBottom: 20 }}>
            Clinical Validation Study Design
          </h2>
          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
              <div>
                <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 8 }}>Study type</div>
                <div style={{ fontSize: 15, color: '#f0f6fc' }}>Prospective, controlled, multi-site</div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 8 }}>Sample size</div>
                <div style={{ fontSize: 15, color: '#f0f6fc' }}>300 patients across 5 sites</div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 8 }}>Primary endpoint</div>
                <div style={{ fontSize: 15, color: '#f0f6fc' }}>Correlation with MMSE, MoCA, ADAS-Cog</div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 8 }}>Secondary endpoints</div>
                <div style={{ fontSize: 15, color: '#f0f6fc' }}>Session completion, patient anxiety, caregiver burden</div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 8 }}>Duration</div>
                <div style={{ fontSize: 15, color: '#f0f6fc' }}>6 months per patient; 12 months total</div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 8 }}>Statistical methods</div>
                <div style={{ fontSize: 15, color: '#f0f6fc' }}>Paired t-test, Wilcoxon, Cohen\'s d</div>
              </div>
            </div>
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
            Regulatory consultant or reviewer?
          </h2>
          <Link href="/contact" className="btn-primary">
            Discuss regulatory strategy
          </Link>
        </div>
      </div>
    </div>
  );
}
