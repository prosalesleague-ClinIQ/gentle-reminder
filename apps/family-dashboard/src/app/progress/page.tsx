'use client';

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { cognitiveScores, sessions } from '../../data/mock';

const domainAverages = [
  { domain: 'Orientation', score: Math.round(cognitiveScores.reduce((s, c) => s + c.orientation, 0) / cognitiveScores.length) },
  { domain: 'Memory', score: Math.round(cognitiveScores.reduce((s, c) => s + c.memory, 0) / cognitiveScores.length) },
  { domain: 'Attention', score: Math.round(cognitiveScores.reduce((s, c) => s + c.attention, 0) / cognitiveScores.length) },
  { domain: 'Language', score: Math.round(cognitiveScores.reduce((s, c) => s + c.language, 0) / cognitiveScores.length) },
  { domain: 'Visuospatial', score: Math.round(cognitiveScores.reduce((s, c) => s + c.visuospatial, 0) / cognitiveScores.length) },
];

function getTrend(scores: number[]): 'improving' | 'stable' | 'declining' {
  if (scores.length < 2) return 'stable';
  const recent = scores.slice(-7);
  const earlier = scores.slice(-14, -7);
  if (earlier.length === 0) return 'stable';
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
  const diff = recentAvg - earlierAvg;
  if (diff > 2) return 'improving';
  if (diff < -2) return 'declining';
  return 'stable';
}

const overallTrend = getTrend(cognitiveScores.map((s) => s.overall));

const trendBadgeStyles: Record<string, { bg: string; color: string; label: string }> = {
  improving: { bg: '#ECFDF5', color: '#059669', label: 'Improving' },
  stable: { bg: '#EFF6FF', color: '#2563EB', label: 'Stable' },
  declining: { bg: '#FEF2F2', color: '#DC2626', label: 'Declining' },
};

export default function ProgressPage() {
  const trend = trendBadgeStyles[overallTrend];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2937', margin: 0 }}>Progress Updates</h1>
          <p style={{ fontSize: 16, color: '#6B7280', marginTop: 4 }}>Track Margaret&apos;s cognitive health over time</p>
        </div>
        <span
          style={{
            padding: '8px 16px',
            borderRadius: 20,
            background: trend.bg,
            color: trend.color,
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Overall: {trend.label}
        </span>
      </div>

      {/* Cognitive Score Over Time */}
      <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 20px 0' }}>
          Cognitive Score Over Time (30 Days)
        </h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cognitiveScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickFormatter={(d) => {
                  const date = new Date(d);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis domain={[40, 100]} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="overall" name="Overall" stroke="#7C3AED" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="memory" name="Memory" stroke="#EF4444" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="orientation" name="Orientation" stroke="#3B82F6" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Domain Breakdown & Weekly Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Domain Breakdown */}
        <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 20px 0' }}>
            Domain Breakdown
          </h2>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainAverages} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis type="category" dataKey="domain" tick={{ fontSize: 13, fill: '#374151' }} width={90} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
                <Bar dataKey="score" fill="#7C3AED" radius={[0, 6, 6, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Summary */}
        <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 20px 0' }}>
            Weekly Summary
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.7, color: '#4B5563' }}>
            <p style={{ margin: '0 0 12px 0' }}>
              Margaret had a <strong>good week overall</strong>. She completed 5 out of 7 scheduled cognitive sessions, with an average score of 76%.
            </p>
            <p style={{ margin: '0 0 12px 0' }}>
              Her <strong>memory scores showed slight improvement</strong> (+3% from last week), particularly in the photo recognition exercises. Orientation remains consistent.
            </p>
            <p style={{ margin: 0 }}>
              She was most engaged during morning sessions and especially enjoyed activities involving family photos. The care team recommends continuing with the current exercise mix.
            </p>
          </div>

          {/* Trend badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
            {[
              { label: 'Memory', trend: 'improving' as const },
              { label: 'Orientation', trend: 'stable' as const },
              { label: 'Attention', trend: 'stable' as const },
              { label: 'Language', trend: 'stable' as const },
              { label: 'Visuospatial', trend: 'declining' as const },
            ].map((item) => {
              const style = trendBadgeStyles[item.trend];
              return (
                <span
                  key={item.label}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 12,
                    background: style.bg,
                    color: style.color,
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {item.label}: {style.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Session History Table */}
      <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 20px 0' }}>
          Session History
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6B7280', fontWeight: 600, fontSize: 13 }}>Date</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6B7280', fontWeight: 600, fontSize: 13 }}>Type</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6B7280', fontWeight: 600, fontSize: 13 }}>Duration</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6B7280', fontWeight: 600, fontSize: 13 }}>Score</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6B7280', fontWeight: 600, fontSize: 13 }}>Exercises</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '14px 16px', color: '#374151', fontWeight: 500 }}>
                  {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </td>
                <td style={{ padding: '14px 16px', color: '#6B7280' }}>{session.type}</td>
                <td style={{ padding: '14px 16px', color: '#6B7280' }}>{session.duration}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      fontWeight: 600,
                      color: session.score >= 75 ? '#059669' : session.score >= 60 ? '#D97706' : '#DC2626',
                    }}
                  >
                    {session.score}%
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#6B7280' }}>
                  {session.exercisesCompleted}/{session.exercisesTotal}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
