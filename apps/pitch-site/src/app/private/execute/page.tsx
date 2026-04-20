'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EXECUTE_PHASES, type ViewLink } from '../../../content/execute-plan';

const LINK_KIND_COLOR: Record<string, { bg: string; border: string; fg: string }> = {
  review: { bg: 'rgba(63, 185, 80, 0.12)', border: 'rgba(63, 185, 80, 0.4)', fg: '#3fb950' },
  external: { bg: 'rgba(88, 166, 255, 0.12)', border: 'rgba(88, 166, 255, 0.4)', fg: '#58a6ff' },
  template: { bg: 'rgba(167, 113, 247, 0.12)', border: 'rgba(167, 113, 247, 0.4)', fg: '#a371f7' },
  run: { bg: 'rgba(248, 81, 73, 0.12)', border: 'rgba(248, 81, 73, 0.4)', fg: '#f85149' },
};

const LINK_KIND_LABEL: Record<string, string> = {
  review: '📄 Review',
  external: '🔗 Open',
  template: '📝 Template',
  run: '⚡ Run',
};

export default function ExecutePage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [viewed, setViewed] = useState<Record<string, Set<string>>>({});

  function toggle(id: string) {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function markViewed(actionId: string, linkHref: string) {
    setViewed((prev) => {
      const set = new Set(prev[actionId] || []);
      set.add(linkHref);
      return { ...prev, [actionId]: set };
    });
  }

  const allActions = EXECUTE_PHASES.flatMap((p) => p.actions);
  const completedCount = allActions.filter((a) => done[a.id]).length;
  const totalCount = allActions.length;

  function isBlocked(action: { blockedBy?: string[] }): boolean {
    if (!action.blockedBy || action.blockedBy.length === 0) return false;
    return action.blockedBy.some((id) => !done[id]);
  }

  function hasViewedAnyLink(actionId: string): boolean {
    const viewedSet = viewed[actionId];
    return viewedSet !== undefined && viewedSet.size > 0;
  }

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#f0f6fc', marginBottom: 8 }}>Execute Plan</h1>
        <p style={{ fontSize: 15, color: '#c9d1d9', marginBottom: 8 }}>
          Ordered action list from zero → outreach-ready → fundraise-close.
        </p>
        <p style={{ fontSize: 13, color: '#8b949e', marginBottom: 24 }}>
          <strong>How this works:</strong> Click a <span style={{ color: '#3fb950' }}>📄 Review</span> or{' '}
          <span style={{ color: '#58a6ff' }}>🔗 Open</span> button to view the material. Once viewed, the checkbox
          becomes enabled — check it to mark done. Checked items unlock dependent actions.
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
            Phases 0, 1, and 2 should all start <strong>today</strong>. Phase 3 (investors) starts once Phase 1 Tier 1
            patents are filed (week 2-3).
          </p>
        </div>

        {/* Phases */}
        {EXECUTE_PHASES.map((phase) => {
          const phaseCompleted = phase.actions.filter((a) => done[a.id]).length;
          return (
            <div key={phase.id} style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
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
                  const viewedLink = hasViewedAnyLink(action.id);
                  const canCheck = !blocked && viewedLink;
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
                              : viewedLink
                                ? 'rgba(88, 166, 255, 0.25)'
                                : '#21262d'
                        }`,
                        borderRadius: 8,
                        opacity: blocked && !isChecked ? 0.5 : 1,
                      }}
                    >
                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={!canCheck && !isChecked}
                          onChange={() => toggle(action.id)}
                          title={
                            blocked
                              ? 'Locked by prerequisites'
                              : !viewedLink
                                ? 'Open a view link first to enable'
                                : ''
                          }
                          style={{
                            width: 22,
                            height: 22,
                            accentColor: '#3fb950',
                            flexShrink: 0,
                            marginTop: 1,
                            cursor: canCheck || isChecked ? 'pointer' : 'not-allowed',
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
                          <p style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.6, marginBottom: 12 }}>
                            {action.description}
                          </p>

                          {/* Meta row */}
                          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
                            <div style={{ fontSize: 11, color: '#8b949e' }}>
                              👤{' '}
                              <span style={{ color: '#c9d1d9' }}>
                                {action.owner === 'you'
                                  ? 'You'
                                  : action.owner === 'attorney'
                                    ? 'Attorney'
                                    : action.owner === 'both'
                                      ? 'You + partner'
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

                          {/* View Links — prominent buttons */}
                          {action.viewLinks && action.viewLinks.length > 0 && (
                            <div style={{ marginBottom: 12 }}>
                              <div
                                style={{
                                  fontSize: 10,
                                  color: '#8b949e',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                  marginBottom: 6,
                                  fontWeight: 600,
                                }}
                              >
                                View / Open to enable checkbox:
                              </div>
                              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {action.viewLinks.map((link: ViewLink) => {
                                  const isLocal = link.href.startsWith('/');
                                  const linkColor = LINK_KIND_COLOR[link.kind] || LINK_KIND_COLOR.review;
                                  const hasBeenViewed = viewed[action.id]?.has(link.href);
                                  const commonStyle: React.CSSProperties = {
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '6px 12px',
                                    fontSize: 12,
                                    fontWeight: 600,
                                    borderRadius: 6,
                                    background: hasBeenViewed ? linkColor.bg : 'transparent',
                                    border: `1px solid ${linkColor.border}`,
                                    color: linkColor.fg,
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                  };
                                  if (isLocal) {
                                    return (
                                      <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => markViewed(action.id, link.href)}
                                        style={commonStyle}
                                      >
                                        {LINK_KIND_LABEL[link.kind] || '→'} {link.label}
                                        {hasBeenViewed && <span>✓</span>}
                                      </Link>
                                    );
                                  }
                                  return (
                                    <a
                                      key={link.href}
                                      href={link.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={() => markViewed(action.id, link.href)}
                                      style={commonStyle}
                                    >
                                      {LINK_KIND_LABEL[link.kind] || '→'} {link.label}
                                      {hasBeenViewed && <span>✓</span>}
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Deliverable */}
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

                          {/* Status indicator */}
                          {!isChecked && (
                            <div style={{ fontSize: 11, marginTop: 4 }}>
                              {blocked ? (
                                <span style={{ color: '#d29922' }}>
                                  ⚠ Blocked by:{' '}
                                  {action.blockedBy!
                                    .filter((id) => !done[id])
                                    .map((id) => {
                                      const blocker = allActions.find((a) => a.id === id);
                                      return blocker?.label || id;
                                    })
                                    .slice(0, 2)
                                    .join(', ')}
                                </span>
                              ) : !viewedLink ? (
                                <span style={{ color: '#58a6ff' }}>
                                  👆 Click a view link above to enable the checkbox
                                </span>
                              ) : (
                                <span style={{ color: '#3fb950' }}>
                                  ✓ Ready — check the box when you complete the action
                                </span>
                              )}
                            </div>
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
          State saved to browser only (checkboxes + viewed links). To track across devices, use a shared doc
          (Notion / Linear / Google Docs) as your master reference.
        </div>
      </div>
    </div>
  );
}
