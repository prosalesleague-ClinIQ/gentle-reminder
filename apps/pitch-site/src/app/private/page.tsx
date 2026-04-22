import React from 'react';
import Link from 'next/link';
import { OUTREACH_CONTACTS, CATEGORY_LABELS, STAGE_LABELS, STAGE_COLORS, getContactsBySpeedAndCost } from '../../content/outreach-plan';

export default function PrivateDashboard() {
  const byStage: Record<string, number> = {};
  OUTREACH_CONTACTS.forEach((c) => {
    byStage[c.stage] = (byStage[c.stage] || 0) + 1;
  });

  const topPriority = getContactsBySpeedAndCost().slice(0, 5);

  const byCategory: Record<string, number> = {};
  OUTREACH_CONTACTS.forEach((c) => {
    byCategory[c.category] = (byCategory[c.category] || 0) + 1;
  });

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#f0f6fc', marginBottom: 8, letterSpacing: '-0.02em' }}>
          Outreach Command Center
        </h1>
        <p style={{ fontSize: 15, color: '#8b949e', marginBottom: 24 }}>
          {OUTREACH_CONTACTS.length} prioritized contacts across {Object.keys(byCategory).length} categories.
          Ordered by speed-to-value and cost.
        </p>

        {/* Launch Pad CTA */}
        <Link
          href="/private/send"
          style={{
            display: 'block',
            padding: 24,
            marginBottom: 16,
            background: 'linear-gradient(135deg, #58a6ff, #3fb950)',
            borderRadius: 12,
            textDecoration: 'none',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6, opacity: 0.9 }}>
                🚀 SEND OUTREACH TODAY
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Launch Pad</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>
                15 pre-drafted emails + contact-form messages ready. Click → review → send from gentlereminderapp@gmail.com
              </div>
            </div>
            <div style={{ fontSize: 32 }}>→</div>
          </div>
        </Link>

        {/* Execute Plan CTA */}
        <Link
          href="/private/execute"
          style={{
            display: 'block',
            padding: 24,
            marginBottom: 32,
            background: 'linear-gradient(135deg, #f85149, #d29922)',
            borderRadius: 12,
            textDecoration: 'none',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6, opacity: 0.9 }}>
                🔥 START HERE
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Execute Plan</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>
                Step-by-step action list from zero → patents filed → grants submitted → seed closed
              </div>
            </div>
            <div style={{ fontSize: 32 }}>→</div>
          </div>
        </Link>

        {/* This Week's Actions */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(248, 81, 73, 0.1), rgba(210, 153, 34, 0.06))',
            border: '1px solid rgba(248, 81, 73, 0.3)',
            borderRadius: 12,
            padding: 24,
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: 11, color: '#f85149', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 12 }}>
            🔥 THIS WEEK — HIGHEST PRIORITY
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f0f6fc', marginBottom: 16 }}>
            Top 5 contacts (fastest + lowest cost)
          </h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {topPriority.map((c, idx) => (
              <Link
                key={c.id}
                href={`/private/outreach/${c.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '12px 16px',
                  background: '#0d1117',
                  border: '1px solid #21262d',
                  borderRadius: 8,
                  textDecoration: 'none',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    background: 'rgba(248, 81, 73, 0.15)',
                    border: '1px solid rgba(248, 81, 73, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#f85149',
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f6fc' }}>{c.org}</div>
                  <div style={{ fontSize: 12, color: '#8b949e' }}>
                    {CATEGORY_LABELS[c.category]} · Speed: {'●'.repeat(6 - c.speed)}{'○'.repeat(c.speed - 1)} · Cost: {'●'.repeat(6 - c.cost)}{'○'.repeat(c.cost - 1)}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: '#58a6ff' }}>Open →</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Contacts', value: OUTREACH_CONTACTS.length, color: '#f0f6fc' },
            { label: 'Not Started', value: byStage['not-started'] || 0, color: '#6e7681' },
            { label: 'In Discussion', value: (byStage['first-contact'] || 0) + (byStage['responded'] || 0) + (byStage['in-discussion'] || 0), color: '#58a6ff' },
            { label: 'Post-NDA', value: (byStage['nda-signed'] || 0) + (byStage['deep-engagement'] || 0) + (byStage['term-sheet'] || 0), color: '#a371f7' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#161b22',
                border: '1px solid #21262d',
                borderRadius: 10,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 6 }}>{stat.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Category Breakdown */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f0f6fc', marginBottom: 16 }}>By Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {Object.entries(byCategory).map(([cat, count]) => (
              <div
                key={cat}
                style={{
                  background: '#161b22',
                  border: '1px solid #21262d',
                  borderRadius: 8,
                  padding: '12px 16px',
                }}
              >
                <div style={{ fontSize: 13, color: '#c9d1d9', marginBottom: 4 }}>
                  {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#58a6ff' }}>{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f0f6fc', marginBottom: 16 }}>Quick Access</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {[
              { label: 'Outreach Queue', href: '/private/outreach', desc: 'Prioritized contact list by speed × cost' },
              { label: 'Pipeline View', href: '/private/pipeline', desc: 'Kanban-style stages tracker' },
              { label: 'Email Templates', href: '/private/templates', desc: '11 outreach templates by audience' },
              { label: 'NDA Templates', href: '/private/nda', desc: 'Mutual, unilateral, and short-form NDAs' },
              { label: 'Pre-Contact Checklists', href: '/private/checklists', desc: 'What must be in place before contact / IP share' },
              { label: 'Diligence Scorecards', href: '/private/diligence', desc: 'Fortress Audit + IP Moat Eval — investor-ready' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'block',
                  padding: 20,
                  background: '#161b22',
                  border: '1px solid #21262d',
                  borderRadius: 10,
                  textDecoration: 'none',
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f6fc', marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#8b949e' }}>{item.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Safety Reminder */}
        <div
          style={{
            background: 'rgba(248, 81, 73, 0.08)',
            border: '1px solid rgba(248, 81, 73, 0.2)',
            borderRadius: 10,
            padding: 20,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f85149', marginBottom: 8 }}>
            ⚠️ BEFORE ANY IP DISCLOSURE
          </div>
          <ol style={{ marginLeft: 20, color: '#c9d1d9', fontSize: 13, lineHeight: 1.8 }}>
            <li>Run the <Link href="/private/checklists" style={{ color: '#58a6ff' }}>Universal Pre-Flight checklist</Link></li>
            <li>Ensure Tier 1 provisional patents are FILED (priority dates secured)</li>
            <li>Verify counterparty legitimacy (website, LinkedIn, business registration)</li>
            <li>Execute appropriate NDA (mutual or unilateral based on <Link href="/private/checklists" style={{ color: '#58a6ff' }}>checklist guidance</Link>)</li>
            <li>For success-fee arrangements: verify FINRA broker-dealer registration at <a href="https://www.finra.org/brokercheck" target="_blank" rel="noopener noreferrer" style={{ color: '#58a6ff' }}>finra.org/brokercheck</a></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
