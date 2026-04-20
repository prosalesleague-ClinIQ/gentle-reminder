'use client';

import React, { useState } from 'react';
import { INVESTOR_FAQ, FAQ_CATEGORIES } from '../../../content/investor-faq';

type CategoryFilter = 'all' | string;

export default function InvestorFAQPage() {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandAll() {
    setExpandedIds(new Set(INVESTOR_FAQ.map((f) => f.id)));
  }

  function collapseAll() {
    setExpandedIds(new Set());
  }

  const filtered = filter === 'all' ? INVESTOR_FAQ : INVESTOR_FAQ.filter((f) => f.category === filter);

  const categoryCounts: Record<string, number> = { all: INVESTOR_FAQ.length };
  INVESTOR_FAQ.forEach((f) => {
    categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
  });

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#f0f6fc', marginBottom: 8 }}>Investor FAQ</h1>
        <p style={{ fontSize: 14, color: '#8b949e', marginBottom: 24 }}>
          {INVESTOR_FAQ.length} anticipated investor questions with pre-written short + detailed answers. Internalize
          the top 10 before any VC meeting.
        </p>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={expandAll}
              style={{
                padding: '6px 12px',
                background: 'rgba(88, 166, 255, 0.15)',
                border: '1px solid rgba(88, 166, 255, 0.4)',
                color: '#58a6ff',
                borderRadius: 4,
                fontSize: 12,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Expand all
            </button>
            <button
              onClick={collapseAll}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid #30363d',
                color: '#c9d1d9',
                borderRadius: 4,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Collapse all
            </button>
          </div>
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              borderRadius: 4,
              border: filter === 'all' ? '1px solid #3fb950' : '1px solid #30363d',
              background: filter === 'all' ? 'rgba(63, 185, 80, 0.15)' : 'transparent',
              color: filter === 'all' ? '#3fb950' : '#c9d1d9',
              cursor: 'pointer',
            }}
          >
            All ({categoryCounts.all})
          </button>
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '6px 12px',
                fontSize: 12,
                borderRadius: 4,
                border: filter === cat ? '1px solid #3fb950' : '1px solid #30363d',
                background: filter === cat ? 'rgba(63, 185, 80, 0.15)' : 'transparent',
                color: filter === cat ? '#3fb950' : '#c9d1d9',
                cursor: 'pointer',
              }}
            >
              {cat} ({categoryCounts[cat] || 0})
            </button>
          ))}
        </div>

        {/* Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((faq) => {
            const isExpanded = expandedIds.has(faq.id);
            return (
              <div
                key={faq.id}
                style={{
                  background: '#161b22',
                  border: '1px solid #21262d',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'transparent',
                    border: 'none',
                    color: '#f0f6fc',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 16,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#58a6ff', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {faq.category}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{faq.question}</div>
                  </div>
                  <div style={{ fontSize: 20, color: '#8b949e', flexShrink: 0, lineHeight: 1 }}>
                    {isExpanded ? '−' : '+'}
                  </div>
                </button>

                {isExpanded && (
                  <div style={{ padding: '0 18px 16px', borderTop: '1px solid #21262d' }}>
                    <div
                      style={{
                        padding: '14px 16px',
                        background: 'rgba(63, 185, 80, 0.06)',
                        border: '1px solid rgba(63, 185, 80, 0.2)',
                        borderRadius: 6,
                        margin: '14px 0',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color: '#3fb950',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          marginBottom: 6,
                        }}
                      >
                        30-SECOND ANSWER
                      </div>
                      <p style={{ fontSize: 13, color: '#f0f6fc', lineHeight: 1.6, margin: 0 }}>
                        {faq.shortAnswer}
                      </p>
                    </div>

                    {faq.detailedAnswer && (
                      <div
                        style={{
                          padding: '14px 16px',
                          background: 'rgba(88, 166, 255, 0.06)',
                          border: '1px solid rgba(88, 166, 255, 0.2)',
                          borderRadius: 6,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            color: '#58a6ff',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            marginBottom: 6,
                          }}
                        >
                          IF PRESSED (DETAILED)
                        </div>
                        <p style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.6, margin: 0 }}>
                          {faq.detailedAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 32,
            padding: 20,
            background: 'rgba(210, 153, 34, 0.08)',
            border: '1px solid rgba(210, 153, 34, 0.3)',
            borderRadius: 10,
          }}
        >
          <div style={{ fontSize: 12, color: '#d29922', fontWeight: 700, marginBottom: 8 }}>⚠ BEFORE ANY VC MEETING</div>
          <ul style={{ marginLeft: 20, color: '#c9d1d9', fontSize: 13, lineHeight: 1.7 }}>
            <li>Customize answers marked [FOUNDER TO CUSTOMIZE] with your specific story</li>
            <li>Rehearse the 30-second answer for each of the top 10 questions</li>
            <li>For detailed answers, know the supporting data points by memory</li>
            <li>If you don't know, say "I'll follow up" — don't guess</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
