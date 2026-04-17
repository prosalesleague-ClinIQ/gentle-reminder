import React from 'react';
import Link from 'next/link';
import Hero from '../components/Hero';
import IPCard from '../components/IPCard';
import { IP_PORTFOLIO, PORTFOLIO_STATS } from '../content/ip-portfolio';

export default function HomePage() {
  const featured = IP_PORTFOLIO.slice(0, 6);

  return (
    <>
      <Hero />

      {/* Problem / Solution */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div
                style={{
                  fontSize: 13,
                  color: '#f85149',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                The Problem
              </div>
              <h2
                style={{ fontSize: 36, fontWeight: 700, color: '#f0f6fc', marginBottom: 20, lineHeight: 1.2 }}
              >
                Dementia care is broken.
              </h2>
              <p style={{ fontSize: 17, color: '#c9d1d9', lineHeight: 1.7, marginBottom: 16 }}>
                55 million people live with dementia globally. 10 million new cases each year.
                Standard tools like the MMSE and MoCA produce pass/fail feedback that triggers
                anxiety, agitation, and session abandonment.
              </p>
              <p style={{ fontSize: 17, color: '#c9d1d9', lineHeight: 1.7 }}>
                Caregivers lack real-time visibility. Clinicians lack longitudinal digital
                biomarkers. Pharmaceutical trials lack scalable, reproducible digital endpoints.
                And patients lack tools designed for their actual cognitive state.
              </p>
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  color: '#3fb950',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                Our Solution
              </div>
              <h2 style={{ fontSize: 36, fontWeight: 700, color: '#f0f6fc', marginBottom: 20, lineHeight: 1.2 }}>
                A platform built from the algorithm up for dementia.
              </h2>
              <p style={{ fontSize: 17, color: '#c9d1d9', lineHeight: 1.7, marginBottom: 16 }}>
                Gentle Reminder is a complete clinical-grade platform with{' '}
                <strong style={{ color: '#58a6ff' }}>23 patentable innovations</strong> across
                cognitive assessment scoring, adaptive difficulty, multimodal state detection,
                digital biomarkers, AI-powered conversation, and FDA SaMD compliance.
              </p>
              <p style={{ fontSize: 17, color: '#c9d1d9', lineHeight: 1.7 }}>
                Every algorithm was designed specifically for neurodegenerative populations —
                not retrofitted from general-purpose tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio preview */}
      <section className="section" style={{ backgroundColor: 'rgba(22, 27, 34, 0.3)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div
              style={{
                fontSize: 13,
                color: '#58a6ff',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              IP Portfolio
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: '#f0f6fc', marginBottom: 12 }}>
              {PORTFOLIO_STATS.totalIPs} innovations, {PORTFOLIO_STATS.tier1Count} highest-priority
            </h2>
            <p style={{ fontSize: 17, color: '#c9d1d9', maxWidth: 640, margin: '0 auto' }}>
              From the three-state feedback system to dementia-tuned spaced repetition, each IP is
              filed as a USPTO provisional for a 12-month priority window.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 20,
              marginBottom: 32,
            }}
          >
            {featured.map((ip) => (
              <IPCard key={ip.id} ip={ip} />
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/ip" className="btn-primary">
              View all {PORTFOLIO_STATS.totalIPs} innovations
            </Link>
          </div>
        </div>
      </section>

      {/* Audience split */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: '#f0f6fc', marginBottom: 12 }}>
              Three paths forward
            </h2>
            <p style={{ fontSize: 17, color: '#c9d1d9' }}>Choose the track that fits your goals.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              {
                title: 'Investors',
                headline: '$5M Seed Round',
                description:
                  'Fund FDA 510(k) clearance, three pilot deployments, and clinical validation. 12-month runway to Series A.',
                href: '/investors',
                color: '#58a6ff',
              },
              {
                title: 'Strategic Partners',
                headline: 'Licensing & Co-Development',
                description:
                  'Pharma, MedTech, payers, and care operators. Field-of-use licenses, exclusive IP access, co-development.',
                href: '/partners',
                color: '#3fb950',
              },
              {
                title: 'Grant Funders',
                headline: 'NIH · NIA · SBIR',
                description:
                  'Non-dilutive research funding. SBIR Phase I/II, NIH R01, BrightFocus, Alzheimer\'s Association.',
                href: '/grants',
                color: '#d29922',
              },
            ].map((track) => (
              <Link key={track.title} href={track.href} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, color: track.color, fontWeight: 600, marginBottom: 12 }}>
                  {track.title}
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#f0f6fc', marginBottom: 12 }}>
                  {track.headline}
                </div>
                <p style={{ fontSize: 14, color: '#8b949e', lineHeight: 1.6, marginBottom: 20 }}>
                  {track.description}
                </p>
                <span style={{ fontSize: 13, color: track.color, fontWeight: 600 }}>Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Platform metrics */}
      <section className="section" style={{ backgroundColor: 'rgba(22, 27, 34, 0.3)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: '#f0f6fc', marginBottom: 12 }}>
              Production-ready, not a pitch deck
            </h2>
            <p style={{ fontSize: 17, color: '#c9d1d9' }}>
              Full platform deployed across 5 applications, 8 packages, and 2 services.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 24,
            }}
          >
            {[
              { value: '5', label: 'Apps (Mobile + 4 Web Dashboards)' },
              { value: '30+', label: 'API Routes' },
              { value: '10', label: 'Languages (with RTL)' },
              { value: '53K+', label: 'Lines of Code' },
              { value: '30+', label: 'Database Models' },
              { value: '60+', label: 'Test Files' },
              { value: '12', label: 'FDA SaMD Docs' },
              { value: 'FHIR R4', label: 'EHR Integration' },
            ].map((stat) => (
              <div key={stat.label} className="card" style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: '#f0f6fc',
                    marginBottom: 8,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: '#8b949e' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section">
        <div
          className="container"
          style={{
            textAlign: 'center',
            padding: '64px 32px',
            background: 'linear-gradient(135deg, rgba(88, 166, 255, 0.08), rgba(63, 185, 80, 0.06))',
            border: '1px solid #21262d',
            borderRadius: 16,
          }}
        >
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#f0f6fc', marginBottom: 16 }}>
            Ready to discuss?
          </h2>
          <p style={{ fontSize: 17, color: '#c9d1d9', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
            Whether you're an investor, strategic partner, grant program officer, or clinical
            collaborator — we'd love to hear from you.
          </p>
          <Link href="/contact" className="btn-primary">
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
