import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section
      className="hero-gradient"
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
      }}
    >
      <div className="container" style={{ textAlign: 'center', maxWidth: 900 }}>
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
            marginBottom: 32,
          }}
        >
          23 PATENTABLE INNOVATIONS · FDA SaMD PATHWAY · 10 LANGUAGES
        </div>

        <h1
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.1,
            color: '#f0f6fc',
            marginBottom: 24,
            letterSpacing: '-0.03em',
          }}
        >
          The{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #58a6ff, #3fb950)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            clinical-grade
          </span>
          <br />
          dementia care platform
        </h1>

        <p
          style={{
            fontSize: 20,
            color: '#c9d1d9',
            lineHeight: 1.6,
            marginBottom: 40,
            maxWidth: 720,
            margin: '0 auto 40px',
          }}
        >
          A platform with 23 novel algorithms, systems, and clinical methods protecting
          dementia patients, supporting caregivers, and enabling clinicians. Seeking seed
          investment, strategic partnerships, and research grants.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/ip" className="btn-primary">
            View IP Portfolio
          </Link>
          <Link href="/demo" className="btn-secondary">
            Request Demo
          </Link>
        </div>

        {/* Quick stats */}
        <div
          style={{
            marginTop: 80,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 24,
            maxWidth: 900,
            margin: '80px auto 0',
          }}
        >
          {[
            { value: '55M+', label: 'People with dementia globally' },
            { value: '$186B', label: 'Global dementia care market' },
            { value: '23', label: 'Novel IPs in portfolio' },
            { value: '53K+', label: 'Lines of production code' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #58a6ff, #3fb950)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
