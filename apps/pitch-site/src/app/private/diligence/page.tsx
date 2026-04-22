'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FORTRESS_REPORT,
  MOAT_REPORT,
  tierColor,
  severityColor,
  scoreBand,
  type FortressFinding,
  type FortressAxis,
  type FortressCap,
  type FortressRemediation,
  type FortressPhase,
} from '../../../content/diligence-scorecards';

type View = 'overview' | 'fortress' | 'moat';

export default function DiligencePage() {
  const [view, setView] = useState<View>('overview');

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: '#f0f6fc',
              marginBottom: 8,
              letterSpacing: '-0.02em',
            }}
          >
            Diligence Scorecards
          </h1>
          <p style={{ fontSize: 15, color: '#8b949e', marginBottom: 0 }}>
            Self-run evaluations of security posture and IP moat. Run before investor calls. Source reports in{' '}
            <code style={{ fontSize: 13, color: '#c9d1d9' }}>docs/security/</code> and{' '}
            <code style={{ fontSize: 13, color: '#c9d1d9' }}>docs/ip/</code>.
          </p>
        </div>

        {/* View selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['overview', 'fortress', 'moat'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: view === v ? '1px solid #388bfd' : '1px solid #21262d',
                background: view === v ? '#0d419d' : '#0d1117',
                color: view === v ? '#f0f6fc' : '#8b949e',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {v === 'overview' ? 'Overview' : v === 'fortress' ? 'Fortress Audit' : 'IP Moat Eval'}
            </button>
          ))}
        </div>

        {view === 'overview' && <Overview />}
        {view === 'fortress' && <FortressView />}
        {view === 'moat' && <MoatView />}
      </div>
    </div>
  );
}

// =============================================================================
// OVERVIEW
// =============================================================================

function Overview() {
  const fortress = FORTRESS_REPORT;
  const moat = MOAT_REPORT;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 20 }}>
      <ScorecardTile
        title="Fortress Audit"
        subtitle="Security, AI safety, breach readiness, supply chain"
        score={fortress.score}
        tier={fortress.tier}
        tierColorHex={tierColor(fortress.tier)}
        topBlocker={fortress.topBlocker}
        counts={fortress.counts}
        runDate={fortress.runDate}
        status={fortress.status}
        sourceFile={fortress.sourceFile}
      />
      <ScorecardTile
        title="IP Moat Eval"
        subtitle="Patent portfolio defensibility, prior art, filing plan"
        score={moat.score}
        tier={moat.tier}
        tierColorHex={tierColor(moat.tier)}
        topBlocker={moat.status === 'running' ? 'Evaluation in progress — check back shortly.' : moat.topGap}
        counts={
          moat.status === 'complete'
            ? { critical: 0, high: 0, medium: 0, low: 0 }
            : undefined
        }
        runDate={moat.runDate}
        status={moat.status}
        sourceFile={moat.sourceFile}
      />
    </div>
  );
}

function ScorecardTile({
  title,
  subtitle,
  score,
  tier,
  tierColorHex,
  topBlocker,
  counts,
  runDate,
  status,
  sourceFile,
}: {
  title: string;
  subtitle: string;
  score: number;
  tier: string;
  tierColorHex: string;
  topBlocker: string;
  counts?: Record<string, number>;
  runDate: string;
  status: string;
  sourceFile: string;
}) {
  const band = scoreBand(score);
  const running = status === 'running' || status === 'pending';

  return (
    <div
      style={{
        background: '#0d1117',
        border: '1px solid #21262d',
        borderRadius: 12,
        padding: 24,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#f0f6fc', marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 13, color: '#8b949e' }}>{subtitle}</div>
        </div>
        <div
          style={{
            fontSize: 10,
            padding: '4px 8px',
            borderRadius: 6,
            background: running ? '#6e3700' : '#0d419d',
            color: '#f0f6fc',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {running ? 'Running' : 'Complete'} · {runDate}
        </div>
      </div>

      {/* Score display */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
        <div style={{ fontSize: 64, fontWeight: 800, color: running ? '#8b949e' : band.color, lineHeight: 1 }}>
          {running ? '—' : score}
        </div>
        <div style={{ fontSize: 20, color: '#8b949e', fontWeight: 600 }}>/ 100</div>
      </div>
      <div
        style={{
          display: 'inline-block',
          padding: '4px 10px',
          borderRadius: 6,
          background: running ? '#21262d' : tierColorHex,
          color: '#f0f6fc',
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 16,
          letterSpacing: '0.02em',
        }}
      >
        {running ? 'PENDING' : tier.replace(/_/g, ' ')}
      </div>

      {/* Top blocker */}
      <div
        style={{
          padding: 12,
          background: '#161b22',
          border: '1px solid #21262d',
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: '#f85149', marginBottom: 6, textTransform: 'uppercase' }}>
          Top Blocker
        </div>
        <div style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.5 }}>{topBlocker}</div>
      </div>

      {/* Counts */}
      {counts && !running && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['critical', 'high', 'medium', 'low'] as const).map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                padding: '8px 4px',
                background: '#161b22',
                border: `1px solid ${severityColor(s as 'critical' | 'high' | 'medium' | 'low')}40`,
                borderRadius: 6,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: severityColor(s as 'critical' | 'high' | 'medium' | 'low'),
                }}
              >
                {counts[s]}
              </div>
              <div style={{ fontSize: 10, color: '#8b949e', textTransform: 'uppercase' }}>{s}</div>
            </div>
          ))}
        </div>
      )}

      {/* Source */}
      <div style={{ fontSize: 11, color: '#6e7681' }}>
        Source: <code style={{ fontSize: 11, color: '#8b949e' }}>{sourceFile}</code>
      </div>
    </div>
  );
}

// =============================================================================
// FORTRESS VIEW
// =============================================================================

function FortressView() {
  const r = FORTRESS_REPORT;
  const band = scoreBand(r.score);
  const [expandedFinding, setExpandedFinding] = useState<string>('');

  return (
    <div>
      {/* Summary bar */}
      <div
        style={{
          background: '#0d1117',
          border: '1px solid #21262d',
          borderRadius: 12,
          padding: 24,
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 64, fontWeight: 800, color: band.color, lineHeight: 1 }}>{r.score}</div>
            <div style={{ fontSize: 14, color: '#8b949e', marginTop: 4 }}>/ 100</div>
            <div
              style={{
                display: 'inline-block',
                marginTop: 8,
                padding: '4px 10px',
                borderRadius: 6,
                background: tierColor(r.tier),
                color: '#f0f6fc',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {r.tier.replace(/_/g, ' ')}
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f0f6fc', marginTop: 0, marginBottom: 8 }}>
              Fortress Audit — Executive Summary
            </h2>
            <p style={{ fontSize: 14, color: '#c9d1d9', lineHeight: 1.6, marginBottom: 0 }}>{r.summary}</p>
          </div>
        </div>
      </div>

      {/* Weighted axes */}
      <Section title="Weighted subtotals (100 pts)">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #21262d' }}>
              <Th>Axis</Th>
              <Th align="right">Weight</Th>
              <Th align="right">Score</Th>
              <Th align="right">Cap</Th>
              <Th>Note</Th>
            </tr>
          </thead>
          <tbody>
            {r.axes.map((a) => (
              <AxisRow key={a.name} a={a} />
            ))}
            <tr style={{ borderTop: '2px solid #388bfd', background: '#161b22' }}>
              <Td style={{ fontWeight: 700, color: '#f0f6fc' }}>Subtotal</Td>
              <Td align="right" style={{ fontWeight: 700, color: '#f0f6fc' }}>100</Td>
              <Td align="right" style={{ fontWeight: 700, color: band.color, fontSize: 16 }}>{r.score}</Td>
              <Td align="right" />
              <Td />
            </tr>
          </tbody>
        </table>
      </Section>

      {/* Caps */}
      <Section title="Hard caps evaluated">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12 }}>
          {r.caps.map((c) => (
            <CapCard key={c.name} c={c} />
          ))}
        </div>
      </Section>

      {/* Criticals */}
      <Section title={`Critical findings (${r.criticals.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {r.criticals.map((f) => (
            <FindingRow
              key={f.id}
              f={f}
              expanded={expandedFinding === f.id}
              onToggle={() => setExpandedFinding((prev) => (prev === f.id ? '' : f.id))}
            />
          ))}
        </div>
      </Section>

      {/* Top 10 fixes */}
      <Section title="Top 10 fixes (ranked by blast-radius ÷ effort)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {r.top10Fixes.map((f) => (
            <RemediationRow key={f.rank} f={f} />
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#8b949e', marginTop: 12 }}>
          Total effort for top 10: ~10 developer-days.
        </div>
      </Section>

      {/* 30/60/90 */}
      <Section title="30 / 60 / 90 day plan">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {r.phases.map((p) => (
            <PhaseCard key={p.horizon} p={p} />
          ))}
        </div>
      </Section>
    </div>
  );
}

// =============================================================================
// MOAT VIEW
// =============================================================================

function MoatView() {
  const m = MOAT_REPORT;
  const running = m.status !== 'complete';
  const band = scoreBand(m.score);

  if (running) {
    return (
      <div
        style={{
          background: '#0d1117',
          border: '1px solid #21262d',
          borderRadius: 12,
          padding: 48,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f0f6fc', marginTop: 0, marginBottom: 12 }}>
          IP Moat Evaluation — Running
        </h2>
        <p style={{ fontSize: 14, color: '#c9d1d9', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 16px' }}>
          {m.summary}
        </p>
        <div style={{ display: 'inline-flex', gap: 16, marginTop: 16 }}>
          <StatPill label="Patents" value={String(m.patentCount)} />
          <StatPill label="Tier 1" value={String(m.tierCounts.tier1)} color="#3D8158" />
          <StatPill label="Tier 2" value={String(m.tierCounts.tier2)} color="#92A53F" />
          <StatPill label="Tier 3" value={String(m.tierCounts.tier3)} color="#1F7AE0" />
        </div>
        <div style={{ fontSize: 12, color: '#6e7681', marginTop: 24 }}>
          Output file: <code style={{ fontSize: 12, color: '#8b949e' }}>{m.sourceFile}</code>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Summary bar */}
      <div
        style={{
          background: '#0d1117',
          border: '1px solid #21262d',
          borderRadius: 12,
          padding: 24,
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 64, fontWeight: 800, color: band.color, lineHeight: 1 }}>{m.score}</div>
            <div style={{ fontSize: 14, color: '#8b949e', marginTop: 4 }}>/ 100</div>
            <div
              style={{
                display: 'inline-block',
                marginTop: 8,
                padding: '4px 10px',
                borderRadius: 6,
                background: tierColor(m.tier),
                color: '#f0f6fc',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {m.tier}
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f0f6fc', marginTop: 0, marginBottom: 8 }}>
              IP Moat Evaluation — Executive Summary
            </h2>
            <p style={{ fontSize: 14, color: '#c9d1d9', lineHeight: 1.6, marginBottom: 0 }}>{m.summary}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <StatPill label="Patents" value={String(m.patentCount)} />
          <StatPill label="Tier 1" value={String(m.tierCounts.tier1)} color="#3D8158" />
          <StatPill label="Tier 2" value={String(m.tierCounts.tier2)} color="#92A53F" />
          <StatPill label="Tier 3" value={String(m.tierCounts.tier3)} color="#1F7AE0" />
        </div>
      </div>

      {/* Top asset + gap */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div
          style={{
            background: '#0d1117',
            border: '1px solid #3D815860',
            borderRadius: 10,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3D8158', marginBottom: 6, textTransform: 'uppercase' }}>
            Top IP Asset
          </div>
          <div style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.55 }}>{m.topAsset}</div>
        </div>
        <div
          style={{
            background: '#0d1117',
            border: '1px solid #f8514960',
            borderRadius: 10,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f85149', marginBottom: 6, textTransform: 'uppercase' }}>
            Top IP Gap
          </div>
          <div style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.55 }}>{m.topGap}</div>
        </div>
      </div>

      {/* 10-axis scorecard */}
      <Section title="10-axis scorecard">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #21262d' }}>
              <Th>Axis</Th>
              <Th align="right">Score</Th>
              <Th>Note</Th>
            </tr>
          </thead>
          <tbody>
            {m.axes.map((a) => {
              const pct = (a.score / a.max) * 100;
              const barColor = pct >= 70 ? '#3D8158' : pct >= 50 ? '#E5A300' : '#C0392B';
              return (
                <tr key={a.name} style={{ borderBottom: '1px solid #161b22' }}>
                  <Td>
                    <div style={{ fontWeight: 600, color: '#f0f6fc' }}>{a.name}</div>
                  </Td>
                  <Td align="right">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ fontWeight: 700, color: barColor }}>
                        {a.score}/{a.max}
                      </span>
                      <div style={{ width: 80, height: 4, background: '#21262d', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: barColor }} />
                      </div>
                    </div>
                  </Td>
                  <Td style={{ color: '#8b949e', fontSize: 12 }}>{a.note}</Td>
                </tr>
              );
            })}
            <tr style={{ borderTop: '2px solid #388bfd', background: '#161b22' }}>
              <Td style={{ fontWeight: 700, color: '#f0f6fc' }}>Total</Td>
              <Td align="right" style={{ fontWeight: 700, color: band.color, fontSize: 16 }}>
                {m.score} / 100
              </Td>
              <Td />
            </tr>
          </tbody>
        </table>
      </Section>

      {/* Strengths + weaknesses */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 12, marginBottom: 24 }}>
        <Section title={`Top 5 strengths (${m.topStrengths.length})`}>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            {m.topStrengths.map((s, idx) => (
              <li key={idx} style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.55, marginBottom: 10 }}>
                <strong style={{ color: '#f0f6fc' }}>{s.title}.</strong>{' '}
                <span style={{ color: '#8b949e' }}>{s.evidence}</span>
              </li>
            ))}
          </ol>
        </Section>
        <Section title={`Top 5 weaknesses (${m.topWeaknesses.length})`}>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            {m.topWeaknesses.map((w, idx) => (
              <li key={idx} style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.55, marginBottom: 12 }}>
                <strong style={{ color: '#f0f6fc' }}>{w.title}.</strong>{' '}
                <span style={{ color: '#8b949e' }}>{w.evidence}</span>
                <div style={{ marginTop: 4, fontSize: 12, color: '#3D8158' }}>
                  <strong>Fix:</strong> {w.fix}
                </div>
              </li>
            ))}
          </ol>
        </Section>
      </div>

      {/* Filing plan */}
      <Section title="30 / 60 / 90 filing plan">
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {m.filingPlan.map((item, idx) => (
            <li key={idx} style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.6, marginBottom: 8 }}>
              {item}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

// =============================================================================
// Shared sub-components
// =============================================================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: '#f0f6fc',
          marginTop: 0,
          marginBottom: 12,
          letterSpacing: '0.01em',
        }}
      >
        {title}
      </h3>
      <div
        style={{
          background: '#0d1117',
          border: '1px solid #21262d',
          borderRadius: 10,
          padding: 16,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Th({ children, align = 'left' as 'left' | 'right' }: { children?: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th
      style={{
        textAlign: align,
        padding: '8px 12px',
        fontSize: 11,
        fontWeight: 700,
        color: '#8b949e',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = 'left' as 'left' | 'right',
  style,
}: {
  children?: React.ReactNode;
  align?: 'left' | 'right';
  style?: React.CSSProperties;
}) {
  return (
    <td
      style={{
        textAlign: align,
        padding: '10px 12px',
        fontSize: 13,
        color: '#c9d1d9',
        ...style,
      }}
    >
      {children}
    </td>
  );
}

function AxisRow({ a }: { a: FortressAxis }) {
  const pct = (a.score / a.weight) * 100;
  const barColor = pct >= 70 ? '#3D8158' : pct >= 50 ? '#E5A300' : '#C0392B';
  return (
    <tr style={{ borderBottom: '1px solid #161b22' }}>
      <Td>
        <div style={{ fontWeight: 600, color: '#f0f6fc' }}>{a.name}</div>
      </Td>
      <Td align="right">{a.weight}</Td>
      <Td align="right">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span style={{ fontWeight: 700, color: barColor }}>{a.score}</span>
          <div style={{ width: 60, height: 4, background: '#21262d', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: barColor }} />
          </div>
        </div>
      </Td>
      <Td align="right">
        {a.capTriggered ? (
          <span style={{ fontSize: 11, color: '#E5A300' }} title={a.capName}>
            ⚠ {a.capThreshold}
          </span>
        ) : (
          <span style={{ fontSize: 11, color: '#6e7681' }}>—</span>
        )}
      </Td>
      <Td style={{ color: '#8b949e', fontSize: 12 }}>{a.note}</Td>
    </tr>
  );
}

function CapCard({ c }: { c: FortressCap }) {
  const color = c.triggered ? (c.binding ? '#C0392B' : '#E5A300') : '#3D8158';
  return (
    <div
      style={{
        background: '#161b22',
        border: `1px solid ${color}60`,
        borderRadius: 8,
        padding: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#f0f6fc' }}>{c.name}</div>
        <div
          style={{
            fontSize: 10,
            padding: '2px 6px',
            borderRadius: 4,
            background: color,
            color: '#f0f6fc',
            fontWeight: 700,
          }}
        >
          {c.triggered ? (c.binding ? 'BINDING' : 'TRIGGERED') : 'CLEAR'}
        </div>
      </div>
      <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 4 }}>{c.threshold}</div>
      <div style={{ fontSize: 11, color: '#c9d1d9' }}>{c.evidence}</div>
    </div>
  );
}

function FindingRow({
  f,
  expanded,
  onToggle,
}: {
  f: FortressFinding;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        background: '#161b22',
        border: `1px solid ${severityColor(f.severity)}40`,
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '10px 14px',
          background: 'transparent',
          border: 0,
          textAlign: 'left',
          cursor: 'pointer',
          display: 'grid',
          gridTemplateColumns: '40px 60px 1fr auto auto',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: '#8b949e' }}>{f.id}</span>
        <span
          style={{
            fontSize: 10,
            padding: '2px 6px',
            borderRadius: 4,
            background: severityColor(f.severity),
            color: '#f0f6fc',
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          {f.severity.toUpperCase()}
        </span>
        <span style={{ fontSize: 13, color: '#f0f6fc' }}>{f.title}</span>
        <span style={{ fontSize: 11, color: '#8b949e' }}>{f.effort}</span>
        <span
          style={{
            fontSize: 10,
            padding: '2px 6px',
            borderRadius: 4,
            background: f.active ? '#6e3700' : '#21262d',
            color: f.active ? '#f0f6fc' : '#8b949e',
            fontWeight: 600,
          }}
        >
          {f.active ? 'ACTIVE' : 'LATENT'}
        </span>
      </button>
      {expanded && (
        <div
          style={{
            borderTop: '1px solid #21262d',
            padding: 14,
            background: '#0d1117',
          }}
        >
          <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>Affected:</div>
          <code style={{ fontSize: 12, color: '#c9d1d9' }}>{f.file}</code>
        </div>
      )}
    </div>
  );
}

function RemediationRow({ f }: { f: FortressRemediation }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '32px 1fr 140px 100px',
        gap: 12,
        padding: '8px 12px',
        background: '#161b22',
        border: '1px solid #21262d',
        borderRadius: 6,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#388bfd',
          background: '#0d419d',
          borderRadius: 4,
          padding: '2px 6px',
          textAlign: 'center',
        }}
      >
        #{f.rank}
      </div>
      <div style={{ fontSize: 13, color: '#f0f6fc' }}>
        {f.title}{' '}
        <span style={{ fontSize: 11, color: '#8b949e' }}>({f.refFinding})</span>
      </div>
      <div style={{ fontSize: 11, color: '#8b949e' }}>{f.owner}</div>
      <div style={{ fontSize: 11, color: '#f0f6fc', fontWeight: 600, textAlign: 'right' }}>{f.effort}</div>
    </div>
  );
}

function PhaseCard({ p }: { p: FortressPhase }) {
  const band = scoreBand(p.targetScore);
  return (
    <div
      style={{
        background: '#161b22',
        border: '1px solid #21262d',
        borderRadius: 8,
        padding: 14,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f6fc' }}>{p.horizon}</div>
        <div
          style={{
            fontSize: 11,
            padding: '2px 8px',
            borderRadius: 4,
            background: band.color,
            color: '#f0f6fc',
            fontWeight: 700,
          }}
        >
          →{p.targetScore} / {p.targetTier}
        </div>
      </div>
      <ul style={{ paddingLeft: 16, margin: 0 }}>
        {p.items.map((i, idx) => (
          <li key={idx} style={{ fontSize: 12, color: '#c9d1d9', lineHeight: 1.6, marginBottom: 4 }}>
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatPill({ label, value, color = '#8b949e' }: { label: string; value: string; color?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8px 14px',
        background: '#0d1117',
        border: `1px solid ${color}40`,
        borderRadius: 6,
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 10, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
}
