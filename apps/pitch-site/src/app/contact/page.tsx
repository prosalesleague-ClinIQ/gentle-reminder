'use client';

import React, { useState } from 'react';

type Audience = 'general' | 'investor' | 'partner' | 'grant';

export default function ContactPage() {
  const [audience, setAudience] = useState<Audience>('general');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // In production: POST to contact endpoint with audience tag
    setSubmitted(true);
  }

  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: '#f0f6fc', lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Get in Touch
        </h1>
        <p style={{ fontSize: 18, color: '#c9d1d9', marginBottom: 48 }}>
          Select your audience and we'll route your inquiry to the right team member.
        </p>

        {submitted ? (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                background: 'rgba(63, 185, 80, 0.15)',
                border: '2px solid #3fb950',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 32,
              }}
            >
              ✓
            </div>
            <h2 style={{ fontSize: 24, color: '#f0f6fc', marginBottom: 12 }}>Message received</h2>
            <p style={{ fontSize: 15, color: '#c9d1d9' }}>
              We'll respond within 2 business days. For urgent matters, note "URGENT" in the subject.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card" style={{ padding: 32 }}>
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#f0f6fc',
                  marginBottom: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                I'm interested in:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[
                  { key: 'general', label: 'General' },
                  { key: 'investor', label: 'Investing' },
                  { key: 'partner', label: 'Partnership' },
                  { key: 'grant', label: 'Grants' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setAudience(opt.key as Audience)}
                    style={{
                      padding: '12px 8px',
                      borderRadius: 6,
                      border: audience === opt.key ? '1px solid #58a6ff' : '1px solid #30363d',
                      background: audience === opt.key ? 'rgba(88, 166, 255, 0.15)' : 'transparent',
                      color: audience === opt.key ? '#58a6ff' : '#c9d1d9',
                      fontSize: 13,
                      fontWeight: audience === opt.key ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#8b949e', marginBottom: 6 }}>Name</label>
              <input
                required
                type="text"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#0a0e1a',
                  border: '1px solid #30363d',
                  borderRadius: 6,
                  color: '#f0f6fc',
                  fontSize: 14,
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#8b949e', marginBottom: 6 }}>Email</label>
              <input
                required
                type="email"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#0a0e1a',
                  border: '1px solid #30363d',
                  borderRadius: 6,
                  color: '#f0f6fc',
                  fontSize: 14,
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#8b949e', marginBottom: 6 }}>
                Organization
              </label>
              <input
                type="text"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#0a0e1a',
                  border: '1px solid #30363d',
                  borderRadius: 6,
                  color: '#f0f6fc',
                  fontSize: 14,
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#8b949e', marginBottom: 6 }}>
                Message
              </label>
              <textarea
                required
                rows={6}
                placeholder={
                  audience === 'investor'
                    ? "Tell us about your fund, check size, and thesis alignment."
                    : audience === 'partner'
                      ? "What partnership model are you exploring? Which IPs interest you most?"
                      : audience === 'grant'
                        ? "Which grant program and what's your institutional affiliation?"
                        : "How can we help?"
                }
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#0a0e1a',
                  border: '1px solid #30363d',
                  borderRadius: 6,
                  color: '#f0f6fc',
                  fontSize: 14,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Send message
            </button>

            <div style={{ fontSize: 12, color: '#8b949e', marginTop: 16, textAlign: 'center' }}>
              We respond within 2 business days. By submitting, you consent to our retention of
              your contact information for follow-up purposes only.
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
