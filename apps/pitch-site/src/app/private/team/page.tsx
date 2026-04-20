'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CURRENT_TEAM, RECRUITING_ROLES } from '../../../content/team';
import { FRACTIONAL_CFO_OPTIONS } from '../../../content/fractional-cfo-options';
import { ADVISORY_TARGETS_EXPANDED, type AdvisoryCategory } from '../../../content/advisory-targets-expanded';
import { ADVISOR_OUTREACH_TEMPLATES, OUTREACH_CHANNEL_ICON } from '../../../content/advisor-outreach-templates';

type Tab = 'team' | 'advisors' | 'cfos' | 'templates';

const CATEGORY_LABELS: Record<AdvisoryCategory, string> = {
  'clinical-neuroscience': 'Clinical Neuroscience',
  'digital-health-ai': 'Digital Health / AI',
  'fda-regulatory': 'FDA / Regulatory',
  'commercial-healthcare': 'Commercial Healthcare',
  'pharma-strategic': 'Pharma Strategic',
  'payer-strategy': 'Payer Strategy',
  'operator-founder': 'Operator / Founder',
};

const CATEGORY_COLORS: Record<AdvisoryCategory, string> = {
  'clinical-neuroscience': '#3fb950',
  'digital-health-ai': '#58a6ff',
  'fda-regulatory': '#f85149',
  'commercial-healthcare': '#d29922',
  'pharma-strategic': '#a371f7',
  'payer-strategy': '#a371f7',
  'operator-founder': '#58a6ff',
};

export default function PrivateTeamPage() {
  const [tab, setTab] = useState<Tab>('team');
  const [selectedTemplate, setSelectedTemplate] = useState<string>(ADVISOR_OUTREACH_TEMPLATES[0].id);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | AdvisoryCategory>('all');

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed', err);
    }
  }

  const template = ADVISOR_OUTREACH_TEMPLATES.find((t) => t.id === selectedTemplate)!;

  const filteredAdvisors =
    selectedCategory === 'all'
      ? ADVISORY_TARGETS_EXPANDED
      : ADVISORY_TARGETS_EXPANDED.filter((a) => a.category === selectedCategory);

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#f0f6fc', marginBottom: 8 }}>Team & Advisors</h1>
        <p style={{ fontSize: 14, color: '#8b949e', marginBottom: 24 }}>
          Current team, advisory board recruiting targets, fractional CFO options, and outreach templates.
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid #21262d', paddingBottom: 0 }}>
          {[
            { key: 'team' as Tab, label: 'Team', count: CURRENT_TEAM.length },
            { key: 'advisors' as Tab, label: 'Advisor Targets', count: ADVISORY_TARGETS_EXPANDED.length },
            { key: 'cfos' as Tab, label: 'Fractional CFOs', count: FRACTIONAL_CFO_OPTIONS.length },
            { key: 'templates' as Tab, label: 'Outreach Templates', count: ADVISOR_OUTREACH_TEMPLATES.length },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: tab === t.key ? '2px solid #58a6ff' : '2px solid transparent',
                padding: '10px 16px',
                fontSize: 13,
                color: tab === t.key ? '#f0f6fc' : '#8b949e',
                cursor: 'pointer',
                fontWeight: tab === t.key ? 600 : 400,
                marginBottom: -1,
              }}
            >
              {t.label}{' '}
              <span
                style={{
                  fontSize: 11,
                  marginLeft: 6,
                  padding: '1px 7px',
                  borderRadius: 10,
                  background: tab === t.key ? '#58a6ff20' : '#21262d',
                  color: tab === t.key ? '#58a6ff' : '#8b949e',
                }}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* TEAM TAB */}
        {tab === 'team' && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f0f6fc', marginBottom: 16 }}>Current Team</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
              {CURRENT_TEAM.map((m) => (
                <div
                  key={m.id}
                  style={{
                    padding: 20,
                    background: '#161b22',
                    border: '1px solid #21262d',
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      background: m.gradient,
                      marginBottom: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      fontWeight: 800,
                      color: '#fff',
                    }}
                  >
                    {m.initials}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#f0f6fc', marginBottom: 2 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: '#58a6ff', marginBottom: 10 }}>{m.role}</div>
                  <p style={{ fontSize: 12, color: '#c9d1d9', lineHeight: 1.5, marginBottom: 10 }}>{m.bio}</p>
                  {m.linkedin && (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 11, color: '#58a6ff' }}
                    >
                      LinkedIn →
                    </a>
                  )}
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f0f6fc', marginBottom: 16 }}>Recruiting Roles</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {RECRUITING_ROLES.map((r) => (
                <div
                  key={r.id}
                  style={{
                    padding: 16,
                    background: '#0d1117',
                    border: '1px solid #21262d',
                    borderRadius: 8,
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 16,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f6fc', marginBottom: 4 }}>{r.role}</div>
                    <div style={{ fontSize: 12, color: '#c9d1d9', lineHeight: 1.5, marginBottom: 4 }}>
                      {r.description}
                    </div>
                    <div style={{ fontSize: 11, color: '#8b949e' }}>💰 {r.compensation}</div>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      padding: '3px 8px',
                      borderRadius: 4,
                      whiteSpace: 'nowrap',
                      background:
                        r.timing === 'now'
                          ? 'rgba(248, 81, 73, 0.15)'
                          : r.timing === 'seed-close'
                            ? 'rgba(88, 166, 255, 0.15)'
                            : 'rgba(167, 113, 247, 0.15)',
                      color: r.timing === 'now' ? '#f85149' : r.timing === 'seed-close' ? '#58a6ff' : '#a371f7',
                      border: '1px solid currentColor',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontWeight: 600,
                    }}
                  >
                    {r.timing}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADVISORS TAB */}
        {tab === 'advisors' && (
          <div>
            <div style={{ marginBottom: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedCategory('all')}
                style={{
                  padding: '4px 10px',
                  fontSize: 11,
                  borderRadius: 4,
                  border: selectedCategory === 'all' ? '1px solid #3fb950' : '1px solid #30363d',
                  background: selectedCategory === 'all' ? 'rgba(63, 185, 80, 0.15)' : 'transparent',
                  color: selectedCategory === 'all' ? '#3fb950' : '#c9d1d9',
                  cursor: 'pointer',
                }}
              >
                All ({ADVISORY_TARGETS_EXPANDED.length})
              </button>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
                const count = ADVISORY_TARGETS_EXPANDED.filter((a) => a.category === key).length;
                if (count === 0) return null;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key as AdvisoryCategory)}
                    style={{
                      padding: '4px 10px',
                      fontSize: 11,
                      borderRadius: 4,
                      border:
                        selectedCategory === key
                          ? `1px solid ${CATEGORY_COLORS[key as AdvisoryCategory]}`
                          : '1px solid #30363d',
                      background:
                        selectedCategory === key
                          ? `${CATEGORY_COLORS[key as AdvisoryCategory]}20`
                          : 'transparent',
                      color: selectedCategory === key ? CATEGORY_COLORS[key as AdvisoryCategory] : '#c9d1d9',
                      cursor: 'pointer',
                    }}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 12 }}>
              {filteredAdvisors.map((a) => {
                const catColor = CATEGORY_COLORS[a.category];
                return (
                  <div
                    key={a.id}
                    style={{
                      padding: 18,
                      background: '#161b22',
                      border: `1px solid ${a.priority === 'critical' ? '#f85149' : '#21262d'}`,
                      borderRadius: 10,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#f0f6fc' }}>{a.name}</div>
                        <div style={{ fontSize: 12, color: '#c9d1d9', marginTop: 2 }}>{a.title}</div>
                        <div style={{ fontSize: 11, color: '#8b949e', marginTop: 2 }}>
                          {a.institution} · {a.location}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 9,
                          padding: '2px 6px',
                          borderRadius: 3,
                          background: `${catColor}15`,
                          color: catColor,
                          border: `1px solid ${catColor}40`,
                          whiteSpace: 'nowrap',
                          fontWeight: 600,
                        }}
                      >
                        {CATEGORY_LABELS[a.category]}
                      </span>
                    </div>

                    <p style={{ fontSize: 12, color: '#c9d1d9', lineHeight: 1.5, marginBottom: 10 }}>{a.whyThem}</p>

                    <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 10 }}>
                      <strong>Channel:</strong> {a.outreachChannel} · <strong>Priority:</strong>{' '}
                      <span
                        style={{
                          color: a.priority === 'critical' ? '#f85149' : a.priority === 'high' ? '#d29922' : '#58a6ff',
                        }}
                      >
                        {a.priority}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {a.linkedin && (
                        <a
                          href={a.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '3px 8px',
                            fontSize: 10,
                            background: 'rgba(88, 166, 255, 0.15)',
                            border: '1px solid rgba(88, 166, 255, 0.4)',
                            color: '#58a6ff',
                            borderRadius: 3,
                            textDecoration: 'none',
                          }}
                        >
                          💼 LinkedIn
                        </a>
                      )}
                      {a.twitter && (
                        <a
                          href={a.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '3px 8px',
                            fontSize: 10,
                            background: 'rgba(88, 166, 255, 0.15)',
                            border: '1px solid rgba(88, 166, 255, 0.4)',
                            color: '#58a6ff',
                            borderRadius: 3,
                            textDecoration: 'none',
                          }}
                        >
                          🐦 X
                        </a>
                      )}
                      {a.publicProfile && (
                        <a
                          href={a.publicProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '3px 8px',
                            fontSize: 10,
                            background: 'rgba(63, 185, 80, 0.15)',
                            border: '1px solid rgba(63, 185, 80, 0.4)',
                            color: '#3fb950',
                            borderRadius: 3,
                            textDecoration: 'none',
                          }}
                        >
                          🏛 Profile
                        </a>
                      )}
                    </div>

                    <div style={{ fontSize: 10, color: '#6e7681', marginTop: 10, lineHeight: 1.5, fontStyle: 'italic' }}>
                      {a.compensationModel}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CFO TAB */}
        {tab === 'cfos' && (
          <div>
            <p style={{ fontSize: 13, color: '#8b949e', marginBottom: 20 }}>
              Ranked by fit for our pre-seed healthtech SaMD + DTx profile. Parallel outreach to top 3 recommended;
              choose based on retainer, healthcare/SaMD specialization, and team fit.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FRACTIONAL_CFO_OPTIONS.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: 20,
                    background: '#161b22',
                    border: `1px solid ${c.priority === 'top' ? '#3fb950' : '#21262d'}`,
                    borderRadius: 10,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 16 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span
                          style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color:
                              c.priority === 'top'
                                ? '#3fb950'
                                : c.priority === 'strong'
                                  ? '#58a6ff'
                                  : '#8b949e',
                          }}
                        >
                          #{c.rank}
                        </span>
                        <span style={{ fontSize: 18, fontWeight: 700, color: '#f0f6fc' }}>{c.firm}</span>
                        {c.priority === 'top' && (
                          <span
                            style={{
                              fontSize: 9,
                              padding: '2px 6px',
                              borderRadius: 3,
                              background: 'rgba(63, 185, 80, 0.15)',
                              color: '#3fb950',
                              border: '1px solid rgba(63, 185, 80, 0.4)',
                              fontWeight: 700,
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOP PICK
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: '#8b949e' }}>{c.location}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#d29922' }}>{c.pricingRange}</div>
                      <div style={{ fontSize: 11, color: '#8b949e' }}>{c.pricingModel}</div>
                    </div>
                  </div>

                  <p style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.6, marginBottom: 10 }}>
                    <strong style={{ color: '#3fb950' }}>Why fit:</strong> {c.whyFit}
                  </p>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                    {c.specialty.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: 10,
                          padding: '2px 8px',
                          background: 'rgba(88, 166, 255, 0.1)',
                          border: '1px solid rgba(88, 166, 255, 0.3)',
                          color: '#58a6ff',
                          borderRadius: 10,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 10, fontStyle: 'italic' }}>
                    {c.trackRecord}
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 12px',
                        fontSize: 12,
                        background: 'rgba(88, 166, 255, 0.15)',
                        border: '1px solid rgba(88, 166, 255, 0.4)',
                        color: '#58a6ff',
                        borderRadius: 4,
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Visit website →
                    </a>
                  </div>

                  <div style={{ fontSize: 11, color: '#6e7681', marginTop: 8, lineHeight: 1.5 }}>
                    <strong>Contact path:</strong> {c.contactPath}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 24,
                padding: 16,
                background: 'rgba(210, 153, 34, 0.08)',
                border: '1px solid rgba(210, 153, 34, 0.3)',
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#d29922', marginBottom: 8 }}>
                💡 RECOMMENDED APPROACH
              </div>
              <p style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.7, margin: 0 }}>
                Send the <strong>Fractional CFO Outreach Template</strong> to the top 3 simultaneously (The Healthcare
                CFO, Burkland, CFO Advisors). Compare proposals within 2 weeks on: (1) monthly retainer range, (2)
                healthcare/SaMD experience, (3) team bench depth, (4) 2-3 client references in similar stage/sector.
                Choose based on fit — not price alone.
              </p>
            </div>
          </div>
        )}

        {/* TEMPLATES TAB */}
        {tab === 'templates' && (
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
            <div style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 10, padding: 8, height: 'fit-content' }}>
              {ADVISOR_OUTREACH_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    marginBottom: 4,
                    background: selectedTemplate === t.id ? 'rgba(88, 166, 255, 0.15)' : 'transparent',
                    border: 'none',
                    borderLeft: selectedTemplate === t.id ? '3px solid #58a6ff' : '3px solid transparent',
                    color: selectedTemplate === t.id ? '#f0f6fc' : '#c9d1d9',
                    fontSize: 12,
                    cursor: 'pointer',
                    borderRadius: 4,
                  }}
                >
                  <div style={{ fontSize: 14, marginBottom: 2 }}>
                    {OUTREACH_CHANNEL_ICON[t.channel]} {t.label}
                  </div>
                  <div style={{ fontSize: 10, color: '#6e7681' }}>{t.audience}</div>
                </button>
              ))}
            </div>

            <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f0f6fc' }}>{template.label}</h2>
                <button
                  onClick={() => copyToClipboard(template.body)}
                  style={{
                    padding: '6px 12px',
                    background: copied ? 'rgba(63, 185, 80, 0.15)' : 'rgba(88, 166, 255, 0.15)',
                    border: copied ? '1px solid #3fb950' : '1px solid rgba(88, 166, 255, 0.4)',
                    color: copied ? '#3fb950' : '#58a6ff',
                    fontSize: 11,
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {copied ? '✓ Copied' : '📋 Copy body'}
                </button>
              </div>

              <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 12 }}>
                <strong>Channel:</strong> {OUTREACH_CHANNEL_ICON[template.channel]} {template.channel} ·{' '}
                <strong>Characters:</strong> {template.characterCount} · <strong>Audience:</strong>{' '}
                {template.audience}
              </div>

              {template.subject && (
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
              )}

              <div style={{ fontSize: 10, color: '#8b949e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Body
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
                  maxHeight: 440,
                  overflowY: 'auto',
                }}
              >
                {template.body}
              </pre>

              {template.followup && (
                <div style={{ marginTop: 12, padding: 10, background: 'rgba(88, 166, 255, 0.08)', borderRadius: 4 }}>
                  <div style={{ fontSize: 10, color: '#58a6ff', fontWeight: 700, marginBottom: 4 }}>FOLLOW-UP</div>
                  <div style={{ fontSize: 12, color: '#c9d1d9' }}>{template.followup}</div>
                </div>
              )}

              <div style={{ marginTop: 12, padding: 10, background: 'rgba(210, 153, 34, 0.08)', border: '1px solid rgba(210, 153, 34, 0.2)', borderRadius: 4 }}>
                <div style={{ fontSize: 10, color: '#d29922', fontWeight: 700, marginBottom: 4 }}>NOTES</div>
                <div style={{ fontSize: 12, color: '#c9d1d9', lineHeight: 1.5 }}>{template.notes}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
