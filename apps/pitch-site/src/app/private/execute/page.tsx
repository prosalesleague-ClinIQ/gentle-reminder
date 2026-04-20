'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EXECUTE_PHASES } from '../../../content/execute-plan';

export default function ExecutePage() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const allActions = EXECUTE_PHASES.flatMap((p) => p.actions);
  const completedCount = allActions.filter((a) => done[a.id]).length;
  const totalCount = allActions.length;

  function isBlocked(action: { blockedBy?: string[] }): boolean {
    if (!action.blockedBy || action.blockedBy.length === 0) return false;
    return action.blockedBy.some((id) => !done[id]);
  }

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#f0f6fc', marginBottom: 8 }}>
          Execute Plan
        </h1>
        <p style={{ fontSize: 15, color: '#c9d1d9', marginBottom: 8 }}>
          Ordered action list from zero → outreach-ready → fundraise-close.
        </p>
        <p style={{ fontSize: 13, color: '#8b949e', marginBottom: 24 }}>
          Check items as you complete them. Blocked items (greyed out) unlock when their prerequisites are done. State is browser-local.
        </p>

        {/* Overall progress */}
        <div
          style={{
            padding: 20,
            background: '#161b22',
            border: '1px solid #21262d',
            borderRadius: 10,
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#f0f6fc' }}>Overall Progress</span>
            <span style={{ fontSize: 14, color: '#58a6ff', fontWeight: 600 }}>
              {completedCount} / {totalCount} actions complete
            </span>
          </div>
          <div style={{ width: '100%', height: 8, background: '#0d1117', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #58a6ff, #3fb950)',
                width: `${(completedCount / totalCount) * 100}%`,
                transition: 'width 0.3s',
              }}
            />
          </div>
        </div>

        {/* Immediate parallel guidance */}
        <div
          style={{
            padding: 20,
            background: 'linear-gradient(135deg, rgba(248, 81, 73, 0.08), rgba(210, 153, 34, 0.06))',
            border: '1px solid rgba(248, 81, 73, 0.3)',
            borderRadius: 10,
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: 11, color: '#f85149', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10 }}>
            🔥 DO THESE IN PARALLEL — DO NOT SEQUENCE
          </div>
          <p style={{ fontSize: 14, color: '#f0f6fc', marginBottom: 14, lineHeight: 1.7 }}>
            Phases 0, 1, and 2 should all start <strong>today</strong>. Phase 3 (investors) starts once Phase 1
            Tier 1 patents are filed (week 2-3).
          </p>
          <ul style={{ marginLeft: 20, fontSize: 13, color: '#c9d1d9', lineHeight: 1.8 }}>
            <li>
              <strong>Phase 0</strong> actions can be done in a single morning (entity formation, bank, EIN).
              Your attorney or Stripe Atlas handles most of it.
            </li>
            <li>
              <strong>Phase 1</strong> (patent attorneys) — send 3 parallel inquiries TODAY while Phase 0 is
              processing.
            </li>
            <li>
              <strong>Phase 2</strong> (grant specialists on contingency) — send 3 parallel inquiries TODAY.
              The Sep 5 SBIR deadline requires 4+ weeks of prep.
            </li>
            <li>
              <strong>Phase 3</strong> begins after Phase 1 Tier 1 is filed (to protect IP before investor
              discussion).
            </li>
          </ul>
        </div>

        {/* Phases */}
        {EXECUTE_PHASES.map((phase) => {
          const phaseCompleted = phase.actions.filter((a) => done[a.id]).length;
          return (
            <div key={phase.id} style={{ marginBottom: 32 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    background: phase.blocking
                      ? 'linear-gradient(135deg, #f85149, #d29922)'
                      : 'linear-gradient(135deg, #58a6ff, #3fb950)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 800,
                    color: '#ffffff',
                    flexShrink: 0,
                  }}
                >
                  {phase.number}
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f0f6fc', marginBottom: 2 }}>
                    {phase.label}
                    {phase.blocking && (
                      <span
                        style={{
                          marginLeft: 10,
                          padding: '2px 8px',
                          background: 'rgba(248, 81, 73, 0.15)',
                          color: '#f85149',
                          fontSize: 10,
                          fontWeight: 700,
                          borderRadius: 4,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          verticalAlign: 'middle',
                        }}
                      >
                        Blocking
                      </span>
                    )}
                  </h2>
                  <p style={{ fontSize: 13, color: '#8b949e', marginBottom: 4 }}>{phase.goal}</p>
                  <div style={{ fontSize: 11, color: '#6e7681' }}>
                    {phaseCompleted} / {phase.actions.length} complete
                  </div>
                </div>
              </div>

              <div style={{ paddingLeft: 52, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {phase.actions.map((action) => {
                  const isChecked = !!done[action.id];
                  const blocked = isBlocked(action);
                  return (
                    <div
                      key={action.id}
                      style={{
                        padding: 16,
                        background: isChecked
                          ? 'rgba(63, 185, 80, 0.06)'
                          : blocked
                            ? 'rgba(110, 118, 129, 0.05)'
                            : '#0d1117',
                        border: `1px solid ${
                          isChecked
                            ? 'rgba(63, 185, 80, 0.3)'
                            : blocked
                              ? '#21262d'
                              : 'rgba(88, 166, 255, 0.2)'
                        }`,
                        borderRadius: 8,
                        opacity: blocked && !isChecked ? 0.5 : 1,
                      }}
                    >
                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={blocked && !isChecked}
                          onChange={() => toggle(action.id)}
                          style={{
                            width: 20,
                            height: 20,
                            accentColor: '#3fb950',
                            flexShrink: 0,
                            marginTop: 2,
                            cursor: blocked && !isChecked ? 'not-allowed' : 'pointer',
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 600,
                              color: isChecked ? '#8b949e' : '#f0f6fc',
                              textDecoration: isChecked ? 'line-through' : 'none',
                              marginBottom: 6,
                            }}
                          >
                            {action.label}
                          </div>
                          <p style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.6, marginBottom: 10 }}>
                            {action.description}
                          </p>

                          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
                            <div style={{ fontSize: 11, color: '#8b949e' }}>
                              👤 <span style={{ color: '#c9d1d9' }}>
                                {action.owner === 'you'
                                  ? 'You'
                                  : action.owner === 'attorney'
                                    ? 'Attorney'
                                    : action.owner === 'both'
                                      ? 'You + attorney/partner'
                                      : 'Me (Claude)'}
                              </span>
                            </div>
                            <div style={{ fontSize: 11, color: '#8b949e' }}>
                              ⏱ <span style={{ color: '#c9d1d9' }}>{action.duration}</span>
                            </div>
                            <div style={{ fontSize: 11, color: '#8b949e' }}>
                              💰 <span style={{ color: '#c9d1d9' }}>{action.cost}</span>
                            </div>
                          </div>

                          {action.deliverable && (
                            <div
                              style={{
                                fontSize: 12,
                                color: '#3fb950',
                                padding: '6px 10px',
                                background: 'rgba(63, 185, 80, 0.08)',
                                border: '1px solid rgba(63, 185, 80, 0.2)',
                                borderRadius: 4,
                                marginBottom: 8,
                              }}
                            >
                              ✓ Deliverable: {action.deliverable}
                            </div>
                          )}

                          {blocked && !isChecked && (
                            <div
                              style={{
                                fontSize: 11,
                                color: '#d29922',
                                marginTop: 4,
                              }}
                            >
                              ⚠ Blocked by:{' '}
                              {action.blockedBy!
                                .filter((id) => !done[id])
                                .map((id) => {
                                  const blocker = allActions.find((a) => a.id === id);
                                  return blocker?.label || id;
                                })
                                .join(', ')}
                            </div>
                          )}

                          {action.link && (
                            <Link
                              href={action.link.href}
                              style={{
                                display: 'inline-block',
                                fontSize: 12,
                                color: '#58a6ff',
                                marginTop: 6,
                                fontWeight: 600,
                              }}
                            >
                              → {action.link.label}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div
          style={{
            marginTop: 40,
            padding: 20,
            background: '#0d1117',
            border: '1px solid #21262d',
            borderRadius: 10,
            textAlign: 'center',
            fontSize: 13,
            color: '#8b949e',
          }}
        >
          State saved to browser only. To track across devices, use a shared doc (Notion / Linear / Google
          Docs) and keep this as your master visual reference.
        </div>
      </div>
    </div>
  );
}
