'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  OUTREACH_CONTACTS,
  CATEGORY_LABELS,
  STAGE_LABELS,
  STAGE_COLORS,
  type ContactCategory,
  type ContactStage,
} from '../../../content/outreach-plan';

type SortMode = 'priority' | 'speed-cost' | 'category' | 'stage';
type CategoryFilter = 'all' | ContactCategory;

export default function OutreachQueue() {
  const [sortMode, setSortMode] = useState<SortMode>('speed-cost');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  let list = [...OUTREACH_CONTACTS];

  // Filter
  if (categoryFilter !== 'all') {
    list = list.filter((c) => c.category === categoryFilter);
  }

  // Sort
  if (sortMode === 'speed-cost') {
    list.sort((a, b) => {
      if (a.speed !== b.speed) return a.speed - b.speed;
      return a.cost - b.cost;
    });
  } else if (sortMode === 'priority') {
    list.sort((a, b) => a.priorityScore - b.priorityScore);
  } else if (sortMode === 'category') {
    list.sort((a, b) => a.category.localeCompare(b.category));
  } else if (sortMode === 'stage') {
    list.sort((a, b) => a.stage.localeCompare(b.stage));
  }

  const categoryCounts: Record<string, number> = { all: OUTREACH_CONTACTS.length };
  OUTREACH_CONTACTS.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  function renderDots(level: 1 | 2 | 3 | 4 | 5, total = 5) {
    const filled = total - level + 1;
    return '●'.repeat(filled) + '○'.repeat(total - filled);
  }

  function getSpeedLabel(s: 1 | 2 | 3 | 4 | 5) {
    return { 1: 'Days', 2: '1-2 weeks', 3: '2-4 weeks', 4: '1-3 months', 5: '3+ months' }[s];
  }

  function getCostLabel(c: 1 | 2 | 3 | 4 | 5) {
    return { 1: 'Free', 2: '< $1K', 3: '$1-10K', 4: '$10-50K', 5: '$50K+ / equity' }[c];
  }

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#f0f6fc', marginBottom: 8 }}>
          Outreach Queue
        </h1>
        <p style={{ fontSize: 14, color: '#8b949e', marginBottom: 24 }}>
          Prioritized list — click any contact to open detail view with templates and checklists.
        </p>

        {/* Controls */}
        <div style={{ marginBottom: 20, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#8b949e' }}>Sort:</span>
            {(['speed-cost', 'priority', 'category', 'stage'] as SortMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setSortMode(m)}
                style={{
                  padding: '6px 12px',
                  fontSize: 12,
                  borderRadius: 6,
                  border: sortMode === m ? '1px solid #58a6ff' : '1px solid #30363d',
                  background: sortMode === m ? 'rgba(88, 166, 255, 0.15)' : 'transparent',
                  color: sortMode === m ? '#58a6ff' : '#c9d1d9',
                  cursor: 'pointer',
                  fontWeight: sortMode === m ? 600 : 400,
                  textTransform: 'capitalize',
                }}
              >
                {m.replace('-', ' × ')}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#8b949e' }}>Category:</span>
          {(['all', ...(Object.keys(CATEGORY_LABELS) as ContactCategory[])] as CategoryFilter[]).map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              style={{
                padding: '4px 10px',
                fontSize: 11,
                borderRadius: 4,
                border: categoryFilter === c ? '1px solid #3fb950' : '1px solid #30363d',
                background: categoryFilter === c ? 'rgba(63, 185, 80, 0.15)' : 'transparent',
                color: categoryFilter === c ? '#3fb950' : '#c9d1d9',
                cursor: 'pointer',
              }}
            >
              {c === 'all' ? 'All' : CATEGORY_LABELS[c as ContactCategory]} ({categoryCounts[c] || 0})
            </button>
          ))}
        </div>

        {/* Table */}
        <div
          style={{
            background: '#161b22',
            border: '1px solid #21262d',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #21262d', background: '#0d1117' }}>
                {['#', 'Organization', 'Category', 'Speed', 'Cost', 'NDA', 'Stage', 'Action'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: '#8b949e',
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((c, idx) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #21262d' }}>
                  <td style={{ padding: '10px 14px', color: '#6e7681', fontFamily: 'monospace', fontSize: 11 }}>
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <Link
                      href={`/private/outreach/${c.id}`}
                      style={{ color: '#f0f6fc', fontWeight: 500, textDecoration: 'none' }}
                    >
                      {c.org}
                    </Link>
                    {c.contactName && (
                      <div style={{ fontSize: 11, color: '#8b949e', marginTop: 2 }}>{c.contactName}</div>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#c9d1d9' }}>
                    {CATEGORY_LABELS[c.category]}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ fontSize: 12, color: '#3fb950', fontFamily: 'monospace' }}>{renderDots(c.speed)}</div>
                    <div style={{ fontSize: 10, color: '#8b949e' }}>{getSpeedLabel(c.speed)}</div>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ fontSize: 12, color: '#d29922', fontFamily: 'monospace' }}>{renderDots(c.cost)}</div>
                    <div style={{ fontSize: 10, color: '#8b949e' }}>{getCostLabel(c.cost)}</div>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 11, color: '#8b949e' }}>
                    {c.ndaRequired === 'none' ? (
                      <span style={{ color: '#3fb950' }}>None</span>
                    ) : c.ndaRequired === 'before-contact' ? (
                      <span style={{ color: '#f85149' }}>Before contact</span>
                    ) : c.ndaRequired === 'before-ip-share' ? (
                      <span style={{ color: '#d29922' }}>Before IP share</span>
                    ) : (
                      <span style={{ color: '#a371f7' }}>After interest</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 10,
                        background: `${STAGE_COLORS[c.stage]}20`,
                        border: `1px solid ${STAGE_COLORS[c.stage]}40`,
                        color: STAGE_COLORS[c.stage],
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {STAGE_LABELS[c.stage]}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <Link
                      href={`/private/outreach/${c.id}`}
                      style={{ fontSize: 12, color: '#58a6ff', fontWeight: 600 }}
                    >
                      Open →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ fontSize: 12, color: '#6e7681', marginTop: 16 }}>
          Showing {list.length} of {OUTREACH_CONTACTS.length} contacts. Speed/cost dots: more filled = faster / cheaper.
        </div>
      </div>
    </div>
  );
}
