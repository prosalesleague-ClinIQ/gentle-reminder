'use client';

import React, { useState } from 'react';
import { NDA_TEMPLATES } from '../../../content/nda-templates';

export default function NDAPage() {
  const [selected, setSelected] = useState<string>(NDA_TEMPLATES[0].id);
  const nda = NDA_TEMPLATES.find((n) => n.id === selected)!;
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
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#f0f6fc', marginBottom: 8 }}>NDA Templates</h1>

        <div
          style={{
            padding: 14,
            background: 'rgba(248, 81, 73, 0.08)',
            border: '1px solid rgba(248, 81, 73, 0.3)',
            borderRadius: 8,
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 12, color: '#f85149', fontWeight: 700, marginBottom: 6 }}>⚠️ CRITICAL</div>
          <div style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.6 }}>
            These are STARTING templates. <strong>Have counsel review before first use.</strong> State-law
            variations may require modifications. Do NOT use these verbatim without attorney review.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
          <div
            style={{
              background: '#0d1117',
              border: '1px solid #21262d',
              borderRadius: 10,
              padding: 8,
              height: 'fit-content',
            }}
          >
            {NDA_TEMPLATES.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelected(n.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  marginBottom: 4,
                  background: selected === n.id ? 'rgba(167, 113, 247, 0.15)' : 'transparent',
                  border: 'none',
                  borderLeft: selected === n.id ? '3px solid #a371f7' : '3px solid transparent',
                  color: selected === n.id ? '#f0f6fc' : '#c9d1d9',
                  fontSize: 13,
                  cursor: 'pointer',
                  borderRadius: 4,
                  fontWeight: selected === n.id ? 600 : 400,
                }}
              >
                <div style={{ marginBottom: 2 }}>{n.label}</div>
                <div style={{ fontSize: 10, color: '#6e7681' }}>
                  {n.type === 'mutual' ? 'Mutual' : n.type === 'unilateral-disclosing' ? 'We disclose' : 'We receive'}
                </div>
              </button>
            ))}
          </div>

          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f0f6fc' }}>{nda.label}</h2>
              <button
                onClick={() => copyToClipboard(nda.body)}
                style={{
                  padding: '8px 16px',
                  background: copied ? 'rgba(63, 185, 80, 0.15)' : 'rgba(88, 166, 255, 0.15)',
                  border: copied ? '1px solid #3fb950' : '1px solid rgba(88, 166, 255, 0.3)',
                  color: copied ? '#3fb950' : '#58a6ff',
                  fontSize: 12,
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {copied ? '✓ Copied' : 'Copy NDA text'}
              </button>
            </div>

            <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 20 }}>
              <strong>Audience:</strong> {nda.audience}
              <br />
              <strong>Type:</strong>{' '}
              {nda.type === 'mutual'
                ? 'Mutual (both parties disclose)'
                : nda.type === 'unilateral-disclosing'
                  ? 'Unilateral — Gentle Reminder disclosing'
                  : 'Unilateral — Gentle Reminder receiving'}
              {nda.counselReviewRequired && (
                <>
                  <br />
                  <strong style={{ color: '#f85149' }}>⚠ Counsel review required before first use.</strong>
                </>
              )}
            </div>

            <pre
              style={{
                padding: 20,
                background: '#0d1117',
                border: '1px solid #21262d',
                borderRadius: 6,
                fontSize: 12,
                color: '#c9d1d9',
                whiteSpace: 'pre-wrap',
                fontFamily: '"SF Mono", Monaco, "Courier New", monospace',
                lineHeight: 1.6,
                margin: 0,
                maxHeight: 600,
                overflowY: 'auto',
              }}
            >
              {nda.body}
            </pre>

            <div
              style={{
                marginTop: 20,
                padding: 14,
                background: 'rgba(210, 153, 34, 0.08)',
                border: '1px solid rgba(210, 153, 34, 0.2)',
                borderRadius: 6,
              }}
            >
              <div style={{ fontSize: 11, color: '#d29922', fontWeight: 700, marginBottom: 4 }}>USAGE NOTES</div>
              <div style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.6 }}>{nda.notes}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
