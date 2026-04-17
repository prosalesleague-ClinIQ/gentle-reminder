'use client';

import React, { useState } from 'react';
import IPCard from '../../components/IPCard';
import { IP_PORTFOLIO, PORTFOLIO_STATS, type IPTier, type IPCategory } from '../../content/ip-portfolio';

type TierFilter = 'all' | IPTier;
type CategoryFilter = 'all' | IPCategory;

export default function IPPortfolioPage() {
  const [tier, setTier] = useState<TierFilter>('all');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const filtered = IP_PORTFOLIO.filter((ip) => {
    if (tier !== 'all' && ip.tier !== tier) return false;
    if (category !== 'all' && ip.category !== category) return false;
    return true;
  });

  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container">
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: '#f0f6fc', marginBottom: 16, letterSpacing: '-0.02em' }}>
            IP Portfolio
          </h1>
          <p style={{ fontSize: 18, color: '#c9d1d9', maxWidth: 720, margin: '0 auto' }}>
            {PORTFOLIO_STATS.totalIPs} patentable innovations across cognitive assessment, digital
            biomarkers, multimodal AI, therapeutic UX, and FDA SaMD compliance.
          </p>
        </div>

        {/* Summary bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginBottom: 48,
          }}
        >
          {[
            { label: 'Total IPs', value: PORTFOLIO_STATS.totalIPs, color: '#f0f6fc' },
            { label: 'Tier 1 (file first)', value: PORTFOLIO_STATS.tier1Count, color: '#ff6b6b' },
            { label: 'Tier 2 (strong)', value: PORTFOLIO_STATS.tier2Count, color: '#f1c232' },
            { label: 'Tier 3 (portfolio)', value: PORTFOLIO_STATS.tier3Count, color: '#58a6ff' },
            { label: 'Est. valuation', value: `${PORTFOLIO_STATS.estimatedPortfolioValueLow}–${PORTFOLIO_STATS.estimatedPortfolioValueHigh}`, color: '#3fb950' },
          ].map((s) => (
            <div key={s.label} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#8b949e', marginRight: 12 }}>Filter by tier:</span>
          {(['all', 1, 2, 3] as TierFilter[]).map((t) => (
            <button
              key={String(t)}
              onClick={() => setTier(t)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: tier === t ? '1px solid #58a6ff' : '1px solid #30363d',
                background: tier === t ? 'rgba(88, 166, 255, 0.15)' : 'transparent',
                color: tier === t ? '#58a6ff' : '#c9d1d9',
                fontSize: 13,
                cursor: 'pointer',
                fontWeight: tier === t ? 600 : 400,
              }}
            >
              {t === 'all' ? 'All Tiers' : `Tier ${t}`}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 48, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#8b949e', marginRight: 12 }}>Filter by category:</span>
          {(['all', 'algorithm', 'system', 'ux', 'clinical', 'compliance'] as CategoryFilter[]).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: category === c ? '1px solid #3fb950' : '1px solid #30363d',
                background: category === c ? 'rgba(63, 185, 80, 0.15)' : 'transparent',
                color: category === c ? '#3fb950' : '#c9d1d9',
                fontSize: 13,
                cursor: 'pointer',
                fontWeight: category === c ? 600 : 400,
                textTransform: 'capitalize',
              }}
            >
              {c === 'all' ? 'All Categories' : c}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 24 }}>
          Showing {filtered.length} of {IP_PORTFOLIO.length} innovations
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
          }}
        >
          {filtered.map((ip) => (
            <IPCard key={ip.id} ip={ip} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 64, color: '#8b949e' }}>
            No innovations match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
