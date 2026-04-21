'use client';

import React, { useState } from 'react';
import { SEND_PRIORITY_QUEUE, type SendItem, type LaunchTier } from '../../../content/send-priority';

function buildMailto(item: SendItem): string {
  if (!item.email) return '';
  const subject = encodeURIComponent(item.subject);
  const body = encodeURIComponent(item.body);
  return `mailto:${item.email}?subject=${subject}&body=${body}`;
}

type TierFilter = 'all' | LaunchTier;

export default function SendPage() {
  const [sent, setSent] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string>('');
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');
  const [expandedId, setExpandedId] = useState<string>('');

  function toggleSent(id: string) {
    setSent((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function copy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(''), 2000);
    } catch (err) {
      console.error('Clipboard copy failed', err);
    }
  }

  const filtered =
    tierFilter === 'all' ? SEND_PRIORITY_QUEUE : SEND_PRIORITY_QUEUE.filter((i) => i.tier === tierFilter);

  const sentCount = SEND_PRIORITY_QUEUE.filter((i) => sent[i.id]).length;
  const totalCount = SEND_PRIORITY_QUEUE.length;

  const tierCounts: Record<string, number> = { all: SEND_PRIORITY_QUEUE.length };
  SEND_PRIORITY_QUEUE.forEach((i) => {
    tierCounts[i.tier] = (tierCounts[i.tier] || 0) + 1;
  });

  const tierOptions: { key: TierFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'patent-attorney', label: '⚖️ Patent Attorneys' },
    { key: 'grant-specialist', label: '💰 Grant Specialists' },
    { key: 'fractional-cfo', label: '📊 Fractional CFOs' },
    { key: 'clinical-advisor', label: '🏥 Clinical Advisors' },
    { key: 'tech-advisor', label: '🤖 Tech / AI Advisors' },
  ];

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#f0f6fc', marginBottom: 8 }}>🚀 Outreach Launch Pad</h1>
        <p style={{ fontSize: 14, color: '#c9d1d9', marginBottom: 8 }}>
          {totalCount} pre-drafted emails + contact-form messages ready to launch. Click "Open" → review in your
          mail app → hit Send.
        </p>

        {/* Safety banner */}
        <div
          style={{
            padding: 16,
            background: 'linear-gradient(135deg, rgba(88, 166, 255, 0.08), rgba(63, 185, 80, 0.06))',
            border: '1px solid rgba(88, 166, 255, 0.3)',
            borderRadius: 10,
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 11, color: '#58a6ff', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>
            ⚠️ HOW THIS WORKS — READ BEFORE CLICKING
          </div>
          <ul style={{ marginLeft: 20, fontSize: 13, color: '#c9d1d9', lineHeight: 1.7 }}>
            <li>
              <strong>Nothing sends automatically.</strong> Clicking "Open in mail app" launches YOUR email client
              with the draft pre-filled. Review every draft, adjust placeholders if needed, then click Send
              yourself.
            </li>
            <li>
              Emails will appear to come from whatever is set as your default mail account — should be{' '}
              <code style={{ color: '#58a6ff' }}>mack@matrixadvancedsolutions.com</code>. Double-check the "From"
              line before sending.
            </li>
            <li>
              For contact-form recipients: click "Open contact form" → their form opens in a new tab → paste the
              copied subject + body.
            </li>
            <li>
              <strong>BCC yourself</strong> on every outreach to keep a record — browser checkboxes here don't sync
              across devices.
            </li>
            <li>
              <strong>Log every send in GHL (GoHighLevel):</strong> create a contact, tag with recipient type
              (patent-attorney / grant-specialist / fractional-cfo / clinical-advisor / tech-advisor), and advance
              the pipeline stage. Without this, 15+ parallel conversations become impossible to track.
            </li>
            <li>
              <strong>Personalize placeholders</strong> like{' '}
              <code style={{ color: '#f85149' }}>{'{{their_specific_research}}'}</code> in clinical/tech advisor
              emails before sending. A generic email to a top researcher is worse than no email.
            </li>
          </ul>
        </div>

        {/* Progress */}
        <div
          style={{
            padding: 16,
            background: '#161b22',
            border: '1px solid #21262d',
            borderRadius: 10,
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f6fc' }}>Sent today</span>
            <span style={{ fontSize: 13, color: '#58a6ff', fontWeight: 600 }}>
              {sentCount} / {totalCount}
            </span>
          </div>
          <div style={{ width: '100%', height: 6, background: '#0d1117', borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #58a6ff, #3fb950)',
                width: `${(sentCount / totalCount) * 100}%`,
                transition: 'width 0.3s',
              }}
            />
          </div>
        </div>

        {/* Tier filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
          {tierOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setTierFilter(opt.key)}
              style={{
                padding: '6px 12px',
                fontSize: 12,
                borderRadius: 4,
                border: tierFilter === opt.key ? '1px solid #58a6ff' : '1px solid #30363d',
                background: tierFilter === opt.key ? 'rgba(88, 166, 255, 0.15)' : 'transparent',
                color: tierFilter === opt.key ? '#58a6ff' : '#c9d1d9',
                cursor: 'pointer',
                fontWeight: tierFilter === opt.key ? 600 : 400,
              }}
            >
              {opt.label} ({tierCounts[opt.key] || 0})
            </button>
          ))}
        </div>

        {/* Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((item) => {
            const isSent = !!sent[item.id];
            const isExpanded = expandedId === item.id;
            const mailtoUrl = buildMailto(item);
            return (
              <div
                key={item.id}
                style={{
                  padding: 16,
                  background: isSent ? 'rgba(63, 185, 80, 0.06)' : '#161b22',
                  border: `1px solid ${isSent ? 'rgba(63, 185, 80, 0.3)' : item.priority === 'critical' ? 'rgba(248, 81, 73, 0.3)' : '#21262d'}`,
                  borderRadius: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <input
                    type="checkbox"
                    checked={isSent}
                    onChange={() => toggleSent(item.id)}
                    style={{
                      width: 20,
                      height: 20,
                      accentColor: '#3fb950',
                      flexShrink: 0,
                      marginTop: 2,
                      cursor: 'pointer',
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontSize: 10,
                              padding: '1px 6px',
                              background: `${item.tierColor}15`,
                              border: `1px solid ${item.tierColor}40`,
                              color: item.tierColor,
                              borderRadius: 3,
                              fontWeight: 700,
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                            }}
                          >
                            {item.tierLabel}
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              color: item.priority === 'critical' ? '#f85149' : item.priority === 'high' ? '#d29922' : '#58a6ff',
                              fontWeight: 600,
                            }}
                          >
                            {item.priority === 'critical' ? '🔥 CRITICAL' : item.priority === 'high' ? '⚠ HIGH' : '○ MEDIUM'}
                          </span>
                          <span style={{ fontSize: 11, color: '#6e7681' }}>#{item.order}</span>
                        </div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: isSent ? '#8b949e' : '#f0f6fc',
                            textDecoration: isSent ? 'line-through' : 'none',
                          }}
                        >
                          {item.recipient}
                        </div>
                        <div style={{ fontSize: 12, color: '#8b949e', marginTop: 2 }}>{item.org}</div>
                      </div>
                    </div>

                    {/* Subject preview */}
                    <div
                      style={{
                        padding: '8px 12px',
                        background: '#0d1117',
                        border: '1px solid #21262d',
                        borderRadius: 6,
                        fontSize: 12,
                        color: '#c9d1d9',
                        marginBottom: 10,
                        fontFamily: 'monospace',
                      }}
                    >
                      <strong style={{ color: '#8b949e' }}>Subject:</strong> {item.subject}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                      {item.channel === 'mailto' && mailtoUrl && (
                        <a
                          href={mailtoUrl}
                          style={{
                            padding: '8px 14px',
                            background: 'linear-gradient(135deg, #58a6ff, #3fb950)',
                            color: '#ffffff',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          📧 Open in mail app ({item.email})
                        </a>
                      )}
                      {item.channel === 'contact-form' && item.contactFormUrl && (
                        <a
                          href={item.contactFormUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '8px 14px',
                            background: 'rgba(210, 153, 34, 0.15)',
                            border: '1px solid rgba(210, 153, 34, 0.4)',
                            color: '#d29922',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          🌐 Open contact form
                        </a>
                      )}
                      {item.channel === 'linkedin-dm' && item.linkedinUrl && (
                        <a
                          href={item.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '8px 14px',
                            background: 'rgba(88, 166, 255, 0.15)',
                            border: '1px solid rgba(88, 166, 255, 0.4)',
                            color: '#58a6ff',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          💼 Open LinkedIn profile
                        </a>
                      )}
                      {item.channel === 'twitter-dm' && item.twitterUrl && (
                        <a
                          href={item.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '8px 14px',
                            background: 'rgba(88, 166, 255, 0.15)',
                            border: '1px solid rgba(88, 166, 255, 0.4)',
                            color: '#58a6ff',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          🐦 Open X/Twitter profile
                        </a>
                      )}

                      <button
                        onClick={() => copy(item.subject, `${item.id}-subject`)}
                        style={{
                          padding: '8px 12px',
                          background: copiedId === `${item.id}-subject` ? 'rgba(63, 185, 80, 0.15)' : 'transparent',
                          border: copiedId === `${item.id}-subject` ? '1px solid #3fb950' : '1px solid #30363d',
                          color: copiedId === `${item.id}-subject` ? '#3fb950' : '#c9d1d9',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        {copiedId === `${item.id}-subject` ? '✓ Copied' : '📋 Copy subject'}
                      </button>
                      <button
                        onClick={() => copy(item.body, `${item.id}-body`)}
                        style={{
                          padding: '8px 12px',
                          background: copiedId === `${item.id}-body` ? 'rgba(63, 185, 80, 0.15)' : 'transparent',
                          border: copiedId === `${item.id}-body` ? '1px solid #3fb950' : '1px solid #30363d',
                          color: copiedId === `${item.id}-body` ? '#3fb950' : '#c9d1d9',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        {copiedId === `${item.id}-body` ? '✓ Copied' : '📋 Copy body'}
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? '' : item.id)}
                        style={{
                          padding: '8px 12px',
                          background: 'transparent',
                          border: '1px solid #30363d',
                          color: '#8b949e',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        {isExpanded ? '▲ Hide preview' : '▼ Preview body'}
                      </button>
                    </div>

                    {/* Body preview */}
                    {isExpanded && (
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
                          maxHeight: 400,
                          overflowY: 'auto',
                        }}
                      >
                        {item.body}
                      </pre>
                    )}

                    {item.notes && (
                      <div
                        style={{
                          fontSize: 11,
                          color: '#8b949e',
                          fontStyle: 'italic',
                          marginTop: 8,
                          paddingTop: 8,
                          borderTop: '1px solid #21262d',
                        }}
                      >
                        💡 {item.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 32,
            padding: 16,
            background: '#0d1117',
            border: '1px solid #21262d',
            borderRadius: 10,
            textAlign: 'center',
            fontSize: 12,
            color: '#8b949e',
          }}
        >
          Checkbox state is browser-local. BCC yourself on every email for a real sent-record.
        </div>
      </div>
    </div>
  );
}
