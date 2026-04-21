'use client';

import React, { useState } from 'react';
import { PRE_CONTACT_CHECKLISTS } from '../../../content/pre-contact-checklists';

// Pre-populate items that are verifiably complete based on the repo state
// (NDA clauses, deployed PDFs, IRB package, etc.) — user can still uncheck.
const DEFAULT_CHECKED: Record<string, boolean> = PRE_CONTACT_CHECKLISTS.reduce(
  (acc, list) => {
    list.items.forEach((item) => {
      if (item.defaultDone) acc[item.id] = true;
    });
    return acc;
  },
  {} as Record<string, boolean>,
);

export default function ChecklistsPage() {
  const [selected, setSelected] = useState<string>(PRE_CONTACT_CHECKLISTS[0].id);
  const list = PRE_CONTACT_CHECKLISTS.find((c) => c.id === selected)!;
  const [checked, setChecked] = useState<Record<string, boolean>>(DEFAULT_CHECKED);

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const total = list.items.length;
  const criticalTotal = list.items.filter((i) => i.critical).length;
  const completed = list.items.filter((i) => checked[i.id]).length;
  const criticalCompleted = list.items.filter((i) => i.critical && checked[i.id]).length;

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#f0f6fc', marginBottom: 8 }}>
          Pre-Contact Checklists
        </h1>
        <p style={{ fontSize: 14, color: '#8b949e', marginBottom: 24 }}>
          What MUST be in place before contact or IP is shared. Check items are local to your browser — nothing is
          saved to the server.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
          <div
            style={{
              background: '#0d1117',
              border: '1px solid #21262d',
              borderRadius: 10,
              padding: 8,
              height: 'fit-content',
            }}
          >
            {PRE_CONTACT_CHECKLISTS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 14px',
                  marginBottom: 4,
                  background: selected === c.id ? 'rgba(63, 185, 80, 0.12)' : 'transparent',
                  border: 'none',
                  borderLeft: selected === c.id ? '3px solid #3fb950' : '3px solid transparent',
                  color: selected === c.id ? '#f0f6fc' : '#c9d1d9',
                  fontSize: 13,
                  cursor: 'pointer',
                  borderRadius: 4,
                  fontWeight: selected === c.id ? 600 : 400,
                }}
              >
                <div style={{ marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: '#6e7681', lineHeight: 1.4 }}>{c.when}</div>
              </button>
            ))}
          </div>

          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, padding: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f0f6fc', marginBottom: 6 }}>{list.label}</h2>
            <p style={{ fontSize: 13, color: '#8b949e', marginBottom: 4 }}>{list.description}</p>
            <p style={{ fontSize: 12, color: '#6e7681', fontStyle: 'italic', marginBottom: 20 }}>
              When: {list.when}
            </p>

            {/* Progress bar */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: '#c9d1d9' }}>
                  Overall: {completed} / {total}
                </span>
                <span style={{ color: criticalCompleted === criticalTotal ? '#3fb950' : '#f85149', fontWeight: 600 }}>
                  Critical: {criticalCompleted} / {criticalTotal}{' '}
                  {criticalCompleted === criticalTotal ? '✓' : ''}
                </span>
              </div>
              <div style={{ width: '100%', height: 6, background: '#0d1117', borderRadius: 3, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: criticalCompleted === criticalTotal ? '#3fb950' : '#58a6ff',
                    width: `${(completed / total) * 100}%`,
                    transition: 'width 0.2s',
                  }}
                />
              </div>
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {list.items.map((item) => {
                const isChecked = !!checked[item.id];
                return (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: 12,
                      padding: 14,
                      background: isChecked ? 'rgba(63, 185, 80, 0.06)' : '#0d1117',
                      border: `1px solid ${
                        isChecked ? 'rgba(63, 185, 80, 0.3)' : item.critical ? 'rgba(248, 81, 73, 0.2)' : '#21262d'
                      }`,
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(item.id)}
                      style={{
                        width: 20,
                        height: 20,
                        accentColor: '#3fb950',
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: item.rationale ? 4 : 0 }}>
                        <span
                          style={{
                            fontSize: 14,
                            color: isChecked ? '#8b949e' : '#f0f6fc',
                            textDecoration: isChecked ? 'line-through' : 'none',
                            fontWeight: item.critical ? 600 : 400,
                          }}
                        >
                          {item.text}
                        </span>
                        {item.critical && (
                          <span
                            style={{
                              padding: '1px 6px',
                              background: 'rgba(248, 81, 73, 0.15)',
                              border: '1px solid rgba(248, 81, 73, 0.3)',
                              color: '#f85149',
                              fontSize: 10,
                              fontWeight: 700,
                              borderRadius: 3,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            Critical
                          </span>
                        )}
                      </div>
                      {item.rationale && (
                        <div style={{ fontSize: 12, color: '#8b949e', lineHeight: 1.5 }}>{item.rationale}</div>
                      )}
                      {item.evidence && (
                        <div
                          style={{
                            fontSize: 11,
                            color: '#3fb950',
                            marginTop: 6,
                            padding: '4px 8px',
                            background: 'rgba(63, 185, 80, 0.08)',
                            border: '1px solid rgba(63, 185, 80, 0.25)',
                            borderRadius: 4,
                            fontFamily:
                              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            lineHeight: 1.5,
                          }}
                        >
                          ✓ Evidence: {item.evidence}
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            {criticalCompleted < criticalTotal && (
              <div
                style={{
                  marginTop: 20,
                  padding: 14,
                  background: 'rgba(248, 81, 73, 0.08)',
                  border: '1px solid rgba(248, 81, 73, 0.3)',
                  borderRadius: 6,
                }}
              >
                <div style={{ fontSize: 12, color: '#f85149', fontWeight: 700, marginBottom: 4 }}>
                  ⚠ DO NOT PROCEED
                </div>
                <div style={{ fontSize: 13, color: '#c9d1d9' }}>
                  {criticalTotal - criticalCompleted} critical item(s) remain. Complete all critical items
                  before proceeding.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
