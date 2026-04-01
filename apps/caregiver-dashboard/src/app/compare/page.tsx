'use client';

import React from 'react';

const patients = [
  {
    name: 'Margaret Thompson',
    age: 78,
    stage: 'Moderate',
    stageBadgeColor: '#F59E0B',
    cognitive: { orientation: 72, identity: 85, memory: 64 },
    sessions: { perWeek: 5, avgScore: 74, completionRate: 88 },
    medicationAdherence: 92,
    sleep: { avgHours: 6.8, quality: 71 },
    risk: { fall: 'Low', wandering: 'Moderate', cognitiveDecline: 'Stable' },
    trends: { orientation: 'stable', identity: 'improving', memory: 'declining', medication: 'improving', sleep: 'stable', fall: 'stable', wandering: 'declining', cognitiveDecline: 'stable' },
  },
  {
    name: 'Harold Jenkins',
    age: 82,
    stage: 'Mild',
    stageBadgeColor: '#10B981',
    cognitive: { orientation: 81, identity: 90, memory: 76 },
    sessions: { perWeek: 3, avgScore: 69, completionRate: 75 },
    medicationAdherence: 78,
    sleep: { avgHours: 7.2, quality: 65 },
    risk: { fall: 'Moderate', wandering: 'Low', cognitiveDecline: 'Improving' },
    trends: { orientation: 'improving', identity: 'stable', memory: 'stable', medication: 'declining', sleep: 'improving', fall: 'declining', wandering: 'stable', cognitiveDecline: 'improving' },
  },
];

function trendIcon(trend: string): string {
  if (trend === 'improving') return '\u2191';
  if (trend === 'declining') return '\u2193';
  return '\u2192';
}

function trendColor(trend: string): string {
  if (trend === 'improving') return '#10B981';
  if (trend === 'declining') return '#EF4444';
  return '#6B7280';
}

function riskColor(level: string): string {
  if (level === 'Low') return '#10B981';
  if (level === 'Moderate') return '#F59E0B';
  if (level === 'High') return '#EF4444';
  if (level === 'Improving') return '#10B981';
  if (level === 'Stable') return '#6B7280';
  if (level === 'Declining') return '#EF4444';
  return '#6B7280';
}

function PercentBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ width: '100%', height: 12, backgroundColor: '#E5E7EB', borderRadius: 6, overflow: 'hidden' }}>
      <div style={{ width: `${value}%`, height: '100%', backgroundColor: color, borderRadius: 6, transition: 'width 0.5s ease' }} />
    </div>
  );
}

function MetricRow({ label, value, trend, unit }: { label: string; value: string | number; trend?: string; unit?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
      <span style={{ fontSize: 14, color: '#6B7280' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>{value}{unit || ''}</span>
        {trend && (
          <span style={{ fontSize: 14, fontWeight: 600, color: trendColor(trend) }}>{trendIcon(trend)}</span>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <div style={{ padding: 32, maxWidth: 1400, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Patient Comparison</h1>
      <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 32 }}>Side-by-side view of patient metrics and trends</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {patients.map((p, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Header */}
            <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', backgroundColor: i === 0 ? '#DBEAFE' : '#FDE68A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 700, color: i === 0 ? '#1D4ED8' : '#92400E',
                }}>
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>{p.name}</div>
                  <div style={{ fontSize: 14, color: '#6B7280' }}>Age {p.age}</div>
                </div>
              </div>
              <span style={{
                display: 'inline-block', padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                backgroundColor: `${p.stageBadgeColor}20`, color: p.stageBadgeColor,
              }}>
                {p.stage} Stage
              </span>
            </div>

            {/* Cognitive Scores */}
            <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Cognitive Scores</h3>
              <MetricRow label="Orientation" value={p.cognitive.orientation} unit="%" trend={p.trends.orientation} />
              <MetricRow label="Identity" value={p.cognitive.identity} unit="%" trend={p.trends.identity} />
              <MetricRow label="Memory" value={p.cognitive.memory} unit="%" trend={p.trends.memory} />
            </div>

            {/* Session Stats */}
            <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Session Statistics</h3>
              <MetricRow label="Sessions / Week" value={p.sessions.perWeek} />
              <MetricRow label="Average Score" value={p.sessions.avgScore} unit="%" />
              <MetricRow label="Completion Rate" value={p.sessions.completionRate} unit="%" />
            </div>

            {/* Medication Adherence */}
            <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Medication Adherence</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: '#6B7280' }}>Adherence</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>{p.medicationAdherence}%</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: trendColor(p.trends.medication) }}>{trendIcon(p.trends.medication)}</span>
                </div>
              </div>
              <PercentBar value={p.medicationAdherence} color={p.medicationAdherence >= 85 ? '#10B981' : '#F59E0B'} />
            </div>

            {/* Sleep Quality */}
            <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Sleep Quality</h3>
              <MetricRow label="Avg Hours" value={p.sleep.avgHours} unit=" hrs" trend={p.trends.sleep} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, marginTop: 12 }}>
                <span style={{ fontSize: 14, color: '#6B7280' }}>Quality</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>{p.sleep.quality}%</span>
              </div>
              <PercentBar value={p.sleep.quality} color={p.sleep.quality >= 70 ? '#10B981' : '#F59E0B'} />
            </div>

            {/* Risk Scores */}
            <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Risk Assessment</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: 14, color: '#6B7280' }}>Fall Risk</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, padding: '3px 10px', borderRadius: 12, backgroundColor: `${riskColor(p.risk.fall)}15`, color: riskColor(p.risk.fall) }}>{p.risk.fall}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: trendColor(p.trends.fall) }}>{trendIcon(p.trends.fall)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: 14, color: '#6B7280' }}>Wandering Risk</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, padding: '3px 10px', borderRadius: 12, backgroundColor: `${riskColor(p.risk.wandering)}15`, color: riskColor(p.risk.wandering) }}>{p.risk.wandering}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: trendColor(p.trends.wandering) }}>{trendIcon(p.trends.wandering)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                <span style={{ fontSize: 14, color: '#6B7280' }}>Cognitive Decline</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, padding: '3px 10px', borderRadius: 12, backgroundColor: `${riskColor(p.risk.cognitiveDecline)}15`, color: riskColor(p.risk.cognitiveDecline) }}>{p.risk.cognitiveDecline}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: trendColor(p.trends.cognitiveDecline) }}>{trendIcon(p.trends.cognitiveDecline)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
