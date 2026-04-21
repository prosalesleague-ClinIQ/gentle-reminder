'use client';

import React, { useState } from 'react';
import {
  RESPONSE_TEMPLATES,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type ResponseCategory,
} from '../../../content/response-templates';

type CategoryFilter = 'all' | ResponseCategory;

export default function ResponsesPage() {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [selectedId, setSelectedId] = useState<string>(RESPONSE_TEMPLATES[0].id);
  const [copied, setCopied] = useState<string>('');

  async function copy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Clipboard copy failed', err);
    }
  }

  const filtered =
    filter === 'all' ? RESPONSE_TEMPLATES : RESPONSE_TEMPLATES.filter((r) => r.category === filter);

  const template = RESPONSE_TEMPLATES.find((r) => r.id === selectedId) || RESPONSE_TEMPLATES[0];

  const categoryCounts: Record<string, number> = { all: RESPONSE_TEMPLATES.length };
  RESPONSE_TEMPLATES.forEach((r) => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container" style={{ maxWidth: 1200 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#f0f6fc', marginBottom: 8 }}>📬 Response Templates</h1>
        <p style={{ fontSize: 14, color: '#c9d1d9', marginBottom: 8 }}>
          {RESPONSE_TEMPLATES.length} pre-drafted replies for common outreach responses. Copy → customize → send within 24 hours.
        </p>
        <p style={{ fontSize: 13, color: '#8b949e', marginBottom: 24 }}>
          Each template includes <strong style={{ color: '#d29922' }}>GHL (GoHighLevel)</strong> tag + pipeline stage to
          update after sending. Speed matters — outreach momentum dies if you take more than 48 hours to reply.
        </p>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              borderRadius: 4,
              border: filter === 'all' ? '1px solid #58a6ff' : '1px solid #30363d',
              background: filter === 'all' ? 'rgba(88, 166, 255, 0.15)' : 'transparent',
              color: filter === 'all' ? '#58a6ff' : '#c9d1d9',
              cursor: 'pointer',
              fontWeight: filter === 'all' ? 600 : 400,
            }}
          >
            All ({categoryCounts.all})
          </button>
          {(Object.keys(CATEGORY_LABELS) as ResponseCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '6px 12px',
                fontSize: 12,
                borderRadius: 4,
                border: filter === cat ? `1px solid ${CATEGORY_COLORS[cat]}` : '1px solid #30363d',
                background: filter === cat ? `${CATEGORY_COLORS[cat]}25` : 'transparent',
                color: filter === cat ? CATEGORY_COLORS[cat] : '#c9d1d9',
                cursor: 'pointer',
                fontWeight: filter === cat ? 600 : 400,
              }}
            >
              {CATEGORY_LABELS[cat]} ({categoryCounts[cat] || 0})
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
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
            {filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  marginBottom: 4,
                  background: selectedId === r.id ? `${CATEGORY_COLORS[r.category]}20` : 'transparent',
                  border: 'none',
                  borderLeft: selectedId === r.id ? `3px solid ${CATEGORY_COLORS[r.category]}` : '3px solid transparent',
                  color: selectedId === r.id ? '#f0f6fc' : '#c9d1d9',
                  fontSize: 13,
                  cursor: 'pointer',
                  borderRadius: 4,
                  fontWeight: selectedId === r.id ? 600 : 400,
                }}
              >
                <div style={{ fontSize: 10, color: CATEGORY_COLORS[r.category], marginBottom: 3, fontWeight: 700 }}>
                  {CATEGORY_LABELS[r.category]}
                </div>
                <div style={{ fontSize: 13, marginBottom: 2 }}>{r.label}</div>
                <div style={{ fontSize: 10, color: '#6e7681', lineHeight: 1.4 }}>{r.triggerSignal}</div>
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: CATEGORY_COLORS[template.category],
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    marginBottom: 4,
                  }}
                >
                  {CATEGORY_LABELS[template.category]}
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f0f6fc', marginBottom: 6 }}>{template.label}</h2>
                <div style={{ fontSize: 12, color: '#8b949e', fontStyle: 'italic' }}>
                  <strong>Trigger:</strong> {template.triggerSignal}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => copy(template.subject, `${template.id}-subject`)}
                  style={{
                    padding: '6px 12px',
                    background: copied === `${template.id}-subject` ? 'rgba(63, 185, 80, 0.15)' : 'transparent',
                    border: copied === `${template.id}-subject` ? '1px solid #3fb950' : '1px solid #30363d',
                    color: copied === `${template.id}-subject` ? '#3fb950' : '#c9d1d9',
                    fontSize: 11,
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {copied === `${template.id}-subject` ? '✓' : '📋'} Subject
                </button>
                <button
                  onClick={() => copy(template.body, `${template.id}-body`)}
                  style={{
                    padding: '6px 12px',
                    background: copied === `${template.id}-body` ? 'rgba(63, 185, 80, 0.15)' : 'rgba(88, 166, 255, 0.15)',
                    border: copied === `${template.id}-body` ? '1px solid #3fb950' : '1px solid rgba(88, 166, 255, 0.4)',
                    color: copied === `${template.id}-body` ? '#3fb950' : '#58a6ff',
                    fontSize: 11,
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {copied === `${template.id}-body` ? '✓' : '📋'} Body
                </button>
              </div>
            </div>

            {/* Subject */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: '#8b949e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Subject
              </div>
              <div
                style={{
                  padding: 10,
                  background: '#0d1117',
                  border: '1px solid #21262d',
                  borderRadius: 6,
                  fontSize: 13,
                  color: '#f0f6fc',
                  fontFamily: 'monospace',
                }}
              >
                {template.subject}
              </div>
            </div>

            {/* Body */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: '#8b949e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Body — customize {'{{placeholders}}'} before sending
              </div>
              <pre
                style={{
                  padding: 14,
                  background: '#0d1117',
                  border: '1px solid #21262d',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#c9d1d9',
                  whiteSpace: 'pre-wrap',
                  fontFamily: '-apple-system, sans-serif',
                  lineHeight: 1.6,
                  margin: 0,
                  maxHeight: 480,
                  overflowY: 'auto',
                }}
              >
                {template.body}
              </pre>
            </div>

            {/* GHL / Notes */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  padding: 12,
                  background: 'rgba(210, 153, 34, 0.08)',
                  border: '1px solid rgba(210, 153, 34, 0.3)',
                  borderRadius: 6,
                }}
              >
                <div style={{ fontSize: 10, color: '#d29922', fontWeight: 700, marginBottom: 4, letterSpacing: '0.05em' }}>
                  📊 GHL CRM UPDATE
                </div>
                <div style={{ fontSize: 11, color: '#c9d1d9', lineHeight: 1.5, marginBottom: 4 }}>
                  Tag: <code style={{ color: '#d29922' }}>{template.ghlTag}</code>
                </div>
                <div style={{ fontSize: 11, color: '#c9d1d9', lineHeight: 1.5 }}>
                  Move to stage: <strong style={{ color: '#d29922' }}>{template.ghlStage}</strong>
                </div>
              </div>
              <div
                style={{
                  padding: 12,
                  background: 'rgba(88, 166, 255, 0.06)',
                  border: '1px solid rgba(88, 166, 255, 0.2)',
                  borderRadius: 6,
                }}
              >
                <div style={{ fontSize: 10, color: '#58a6ff', fontWeight: 700, marginBottom: 4, letterSpacing: '0.05em' }}>
                  💡 NOTES
                </div>
                <div style={{ fontSize: 11, color: '#c9d1d9', lineHeight: 1.5 }}>{template.notes}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer reminder */}
        <div
          style={{
            marginTop: 32,
            padding: 18,
            background: 'linear-gradient(135deg, rgba(210, 153, 34, 0.08), rgba(88, 166, 255, 0.06))',
            border: '1px solid rgba(210, 153, 34, 0.3)',
            borderRadius: 10,
          }}
        >
          <div style={{ fontSize: 12, color: '#d29922', fontWeight: 700, marginBottom: 8, letterSpacing: '0.05em' }}>
            ⏱️ RESPONSE SPEED MATTERS
          </div>
          <ul style={{ marginLeft: 20, fontSize: 13, color: '#c9d1d9', lineHeight: 1.7 }}>
            <li>
              <strong>Target:</strong> reply within 4-24 hours during active fundraise
            </li>
            <li>
              <strong>After copy:</strong> always customize {'{{placeholders}}'}; generic replies kill momentum
            </li>
            <li>
              <strong>Always update GHL:</strong> Tag + pipeline stage noted above. Prevents losing track of 30+
              parallel conversations
            </li>
            <li>
              <strong>BCC yourself</strong> on every reply for a searchable sent record
            </li>
            <li>
              <strong>Calendar link ready:</strong> if you don't have Calendly/Cal.com set up, do it today (20-minute
              install)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
