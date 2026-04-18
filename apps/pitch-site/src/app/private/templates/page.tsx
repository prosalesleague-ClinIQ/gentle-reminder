'use client';

import React, { useState } from 'react';
import { EMAIL_TEMPLATES, type EmailTemplate } from '../../../content/email-templates';

export default function TemplatesPage() {
  const [selected, setSelected] = useState<string>(EMAIL_TEMPLATES[0].id);
  const template = EMAIL_TEMPLATES.find((t) => t.id === selected)!;
  const [copied, setCopied] = useState(false);

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed', err);
    }
  }

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#f0f6fc', marginBottom: 8 }}>Email Templates</h1>
        <p style={{ fontSize: 14, color: '#8b949e', marginBottom: 24 }}>
          {EMAIL_TEMPLATES.length} outreach templates by audience. Substitute {'{{variables}}'} before sending.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
          {/* Sidebar */}
          <div
            style={{
              background: '#0d1117',
              border: '1px solid #21262d',
              borderRadius: 10,
              padding: 8,
              height: 'fit-content',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            {EMAIL_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  marginBottom: 4,
                  background: selected === t.id ? 'rgba(88, 166, 255, 0.15)' : 'transparent',
                  border: 'none',
                  borderLeft: selected === t.id ? '3px solid #58a6ff' : '3px solid transparent',
                  color: selected === t.id ? '#f0f6fc' : '#c9d1d9',
                  fontSize: 13,
                  cursor: 'pointer',
                  borderRadius: 4,
                  fontWeight: selected === t.id ? 600 : 400,
                }}
              >
                <div style={{ marginBottom: 2 }}>{t.label}</div>
                <div style={{ fontSize: 10, color: '#6e7681' }}>{t.audience}</div>
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, padding: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f0f6fc', marginBottom: 4 }}>{template.label}</h2>
            <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 20 }}>Audience: {template.audience}</div>

            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6,
                }}
              >
                <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Subject line
                </div>
                <button
                  onClick={() => copyToClipboard(template.subject)}
                  style={{
                    padding: '4px 10px',
                    background: 'transparent',
                    border: '1px solid #30363d',
                    color: '#58a6ff',
                    fontSize: 11,
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                >
                  Copy subject
                </button>
              </div>
              <div
                style={{
                  padding: 12,
                  background: '#0d1117',
                  border: '1px solid #21262d',
                  borderRadius: 6,
                  fontSize: 14,
                  color: '#f0f6fc',
                  fontFamily: 'monospace',
                }}
              >
                {template.subject}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6,
                }}
              >
                <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Body
                </div>
                <button
                  onClick={() => copyToClipboard(template.body)}
                  style={{
                    padding: '4px 10px',
                    background: copied ? 'rgba(63, 185, 80, 0.15)' : 'transparent',
                    border: copied ? '1px solid #3fb950' : '1px solid #30363d',
                    color: copied ? '#3fb950' : '#58a6ff',
                    fontSize: 11,
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                >
                  {copied ? '✓ Copied' : 'Copy body'}
                </button>
              </div>
              <pre
                style={{
                  padding: 16,
                  background: '#0d1117',
                  border: '1px solid #21262d',
                  borderRadius: 6,
                  fontSize: 13,
                  color: '#c9d1d9',
                  whiteSpace: 'pre-wrap',
                  fontFamily: '-apple-system, sans-serif',
                  lineHeight: 1.6,
                  margin: 0,
                  maxHeight: 500,
                  overflowY: 'auto',
                }}
              >
                {template.body}
              </pre>
            </div>

            {template.attachments.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  Attachments / linked items
                </div>
                <ul style={{ marginLeft: 20, color: '#c9d1d9', fontSize: 13, lineHeight: 1.7 }}>
                  {template.attachments.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Follow-up sequence
              </div>
              <ul style={{ marginLeft: 20, color: '#c9d1d9', fontSize: 13, lineHeight: 1.7 }}>
                {template.followupSequence.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            <div
              style={{
                padding: 14,
                background: 'rgba(210, 153, 34, 0.08)',
                border: '1px solid rgba(210, 153, 34, 0.2)',
                borderRadius: 6,
              }}
            >
              <div style={{ fontSize: 11, color: '#d29922', fontWeight: 700, marginBottom: 4 }}>⚠ NOTES</div>
              <div style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.6 }}>{template.notes}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
