import React from 'react';
import Link from 'next/link';
import { OUTREACH_CONTACTS, STAGE_LABELS, STAGE_COLORS, CATEGORY_LABELS, type ContactStage } from '../../../content/outreach-plan';

const STAGE_ORDER: ContactStage[] = [
  'not-started',
  'researching',
  'first-contact',
  'responded',
  'in-discussion',
  'nda-sent',
  'nda-signed',
  'deep-engagement',
  'term-sheet',
  'closed-won',
  'closed-lost',
  'paused',
];

export default function PipelinePage() {
  const byStage: Record<ContactStage, typeof OUTREACH_CONTACTS> = {} as any;
  STAGE_ORDER.forEach((s) => (byStage[s] = []));
  OUTREACH_CONTACTS.forEach((c) => byStage[c.stage].push(c));

  const activeStages = STAGE_ORDER.filter((s) => byStage[s].length > 0);

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#f0f6fc', marginBottom: 8 }}>Pipeline</h1>
        <p style={{ fontSize: 14, color: '#8b949e', marginBottom: 24 }}>
          Contacts grouped by stage. Update stages by editing <code style={{ color: '#58a6ff' }}>src/content/outreach-plan.ts</code>.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${activeStages.length}, 280px)`,
            gap: 16,
            overflowX: 'auto',
            paddingBottom: 20,
          }}
        >
          {activeStages.map((stage) => (
            <div
              key={stage}
              style={{
                background: '#0d1117',
                border: '1px solid #21262d',
                borderRadius: 10,
                minHeight: 400,
              }}
            >
              <div
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid #21262d',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: STAGE_COLORS[stage] }}>
                  {STAGE_LABELS[stage]}
                </span>
                <span
                  style={{
                    background: `${STAGE_COLORS[stage]}20`,
                    color: STAGE_COLORS[stage],
                    padding: '2px 8px',
                    borderRadius: 10,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {byStage[stage].length}
                </span>
              </div>

              <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {byStage[stage].map((c) => (
                  <Link
                    key={c.id}
                    href={`/private/outreach/${c.id}`}
                    style={{
                      display: 'block',
                      padding: 12,
                      background: '#161b22',
                      border: '1px solid #21262d',
                      borderRadius: 6,
                      textDecoration: 'none',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6fc', marginBottom: 4 }}>
                      {c.org}
                    </div>
                    <div style={{ fontSize: 11, color: '#8b949e' }}>{CATEGORY_LABELS[c.category]}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
