import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OUTREACH_CONTACTS, CATEGORY_LABELS, STAGE_LABELS, STAGE_COLORS } from '../../../../content/outreach-plan';
import { getTemplateById } from '../../../../content/email-templates';

export function generateStaticParams() {
  return OUTREACH_CONTACTS.map((c) => ({ contactId: c.id }));
}

export default function ContactDetailPage({ params }: { params: { contactId: string } }) {
  const contact = OUTREACH_CONTACTS.find((c) => c.id === params.contactId);
  if (!contact) return notFound();

  const template = getTemplateById(contact.templateId);

  function renderDots(level: number, total = 5) {
    const filled = total - level + 1;
    return '●'.repeat(filled) + '○'.repeat(total - filled);
  }

  function getSpeedLabel(s: number) {
    return { 1: 'Days', 2: '1-2 weeks', 3: '2-4 weeks', 4: '1-3 months', 5: '3+ months' }[s as 1];
  }

  function getCostLabel(c: number) {
    return { 1: 'Free / non-dilutive', 2: '< $1K', 3: '$1-10K', 4: '$10-50K', 5: '$50K+ / equity' }[c as 1];
  }

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <Link href="/private/outreach" style={{ fontSize: 13, color: '#58a6ff', marginBottom: 16, display: 'inline-block' }}>
          ← Back to Outreach Queue
        </Link>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 4 }}>{CATEGORY_LABELS[contact.category]}</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#f0f6fc', marginBottom: 8 }}>{contact.org}</h1>
          {contact.contactName && (
            <div style={{ fontSize: 16, color: '#c9d1d9' }}>
              {contact.contactName}
              {contact.title && <span style={{ color: '#8b949e' }}> — {contact.title}</span>}
            </div>
          )}
        </div>

        {/* Meta cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Speed
            </div>
            <div style={{ fontSize: 18, color: '#3fb950', fontFamily: 'monospace' }}>{renderDots(contact.speed)}</div>
            <div style={{ fontSize: 12, color: '#c9d1d9', marginTop: 4 }}>{getSpeedLabel(contact.speed)}</div>
          </div>
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cost
            </div>
            <div style={{ fontSize: 18, color: '#d29922', fontFamily: 'monospace' }}>{renderDots(contact.cost)}</div>
            <div style={{ fontSize: 12, color: '#c9d1d9', marginTop: 4 }}>{getCostLabel(contact.cost)}</div>
          </div>
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Stage
            </div>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: 12,
                background: `${STAGE_COLORS[contact.stage]}20`,
                border: `1px solid ${STAGE_COLORS[contact.stage]}40`,
                color: STAGE_COLORS[contact.stage],
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {STAGE_LABELS[contact.stage]}
            </span>
          </div>
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Priority
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#58a6ff' }}>#{contact.priorityScore}</div>
          </div>
        </div>

        {/* Why contact them */}
        <section style={{ marginBottom: 24 }}>
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 11, color: '#3fb950', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10 }}>
              WHY CONTACT THEM
            </div>
            <p style={{ fontSize: 15, color: '#f0f6fc', lineHeight: 1.7, marginBottom: 16 }}>{contact.why}</p>
            <div style={{ fontSize: 13, color: '#8b949e', lineHeight: 1.6 }}>{contact.notes}</div>
          </div>
        </section>

        {/* Links */}
        <section style={{ marginBottom: 24 }}>
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 11, color: '#8b949e', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 12 }}>
              CONTACT INFO
            </div>
            <div style={{ display: 'grid', gap: 8, fontSize: 13 }}>
              <div>
                <span style={{ color: '#8b949e' }}>Website: </span>
                <a href={contact.website} target="_blank" rel="noopener noreferrer" style={{ color: '#58a6ff' }}>
                  {contact.website}
                </a>
              </div>
              {contact.email && (
                <div>
                  <span style={{ color: '#8b949e' }}>Email: </span>
                  <a href={`mailto:${contact.email}`} style={{ color: '#58a6ff' }}>
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.location && (
                <div>
                  <span style={{ color: '#8b949e' }}>Location: </span>
                  <span style={{ color: '#c9d1d9' }}>{contact.location}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Compensation model */}
        <section style={{ marginBottom: 24 }}>
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 11, color: '#d29922', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10 }}>
              COMPENSATION MODEL
            </div>
            <p style={{ fontSize: 14, color: '#c9d1d9', lineHeight: 1.7 }}>{contact.compensationModel}</p>
          </div>
        </section>

        {/* NDA requirement */}
        <section style={{ marginBottom: 24 }}>
          <div
            style={{
              background: contact.ndaRequired === 'none' ? 'rgba(63, 185, 80, 0.08)' : 'rgba(248, 81, 73, 0.08)',
              border: `1px solid ${contact.ndaRequired === 'none' ? 'rgba(63, 185, 80, 0.3)' : 'rgba(248, 81, 73, 0.3)'}`,
              borderRadius: 10,
              padding: 20,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: contact.ndaRequired === 'none' ? '#3fb950' : '#f85149',
                fontWeight: 700,
                letterSpacing: '0.1em',
                marginBottom: 10,
              }}
            >
              NDA REQUIREMENT
            </div>
            <p style={{ fontSize: 14, color: '#f0f6fc', lineHeight: 1.7, marginBottom: 12 }}>
              {contact.ndaRequired === 'none' && '✓ No NDA required. Public-safe discussion only.'}
              {contact.ndaRequired === 'before-contact' && '⚠️ Execute NDA BEFORE first substantive contact.'}
              {contact.ndaRequired === 'before-ip-share' && '⚠️ Execute NDA BEFORE sharing IP docket, claims, or code.'}
              {contact.ndaRequired === 'after-interest' && '→ Execute NDA after mutual interest expressed, before deep-dive.'}
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Link
                href="/private/nda"
                style={{
                  padding: '6px 12px',
                  background: 'rgba(88, 166, 255, 0.15)',
                  border: '1px solid rgba(88, 166, 255, 0.3)',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#58a6ff',
                  fontWeight: 600,
                }}
              >
                View NDA templates →
              </Link>
              <Link
                href="/private/checklists"
                style={{
                  padding: '6px 12px',
                  background: 'rgba(248, 81, 73, 0.15)',
                  border: '1px solid rgba(248, 81, 73, 0.3)',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#f85149',
                  fontWeight: 600,
                }}
              >
                Pre-contact checklist →
              </Link>
            </div>
          </div>
        </section>

        {/* Email template */}
        {template && (
          <section style={{ marginBottom: 24 }}>
            <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 11, color: '#58a6ff', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 14 }}>
                EMAIL TEMPLATE: {template.label}
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 4 }}>Subject</div>
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

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 4 }}>Body (substitute {'{{variables}}'} before sending)</div>
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
                  }}
                >
                  {template.body}
                </pre>
              </div>

              <details style={{ marginBottom: 12 }}>
                <summary style={{ fontSize: 12, color: '#58a6ff', cursor: 'pointer', fontWeight: 600 }}>
                  Follow-up sequence
                </summary>
                <ul style={{ marginLeft: 20, marginTop: 8, color: '#c9d1d9', fontSize: 13, lineHeight: 1.8 }}>
                  {template.followupSequence.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </details>

              <div style={{ fontSize: 11, color: '#8b949e', fontStyle: 'italic' }}>{template.notes}</div>
            </div>
          </section>
        )}

        {/* Quick actions */}
        <section>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(88, 166, 255, 0.08), rgba(63, 185, 80, 0.06))',
              border: '1px solid #21262d',
              borderRadius: 10,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6fc', marginBottom: 12 }}>Before you send:</div>
            <ol style={{ marginLeft: 20, color: '#c9d1d9', fontSize: 13, lineHeight: 1.8 }}>
              <li>Verify recipient is still at organization (check LinkedIn)</li>
              <li>Substitute all {'{{variables}}'} in template body</li>
              <li>Run appropriate <Link href="/private/checklists" style={{ color: '#58a6ff' }}>pre-contact checklist</Link></li>
              <li>If sharing IP: have NDA ready to send as attachment (or prior to call)</li>
              <li>Log this contact in your CRM / tracking sheet</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
