'use client';

const biomarkerSummary = [
  { label: 'Cognitive Response Delay', value: 0.38, unit: 'avg', trend: 'stable', trendLabel: 'Stable', color: '#3B82F6' },
  { label: 'Routine Disruption', value: 0.35, unit: 'avg', trend: 'up', trendLabel: '+3%', color: '#F59E0B' },
  { label: 'Sleep Irregularity', value: 0.42, unit: 'avg', trend: 'up', trendLabel: '+5%', color: '#8B5CF6' },
  { label: 'Medication Adherence', value: 0.78, unit: 'avg', trend: 'up', trendLabel: '+4%', color: '#10B981' },
  { label: 'Speech Hesitation', value: 0.29, unit: 'avg', trend: 'down', trendLabel: '-1%', color: '#EC4899' },
];

const patientBiomarkers = [
  {
    name: 'Margaret Thompson',
    cogDelay: { score: 0.32, trend: 'down' },
    routine: { score: 0.28, trend: 'stable' },
    sleep: { score: 0.35, trend: 'down' },
    medication: { score: 0.92, trend: 'up' },
    speech: { score: 0.25, trend: 'stable' },
  },
  {
    name: 'Harold Jenkins',
    cogDelay: { score: 0.45, trend: 'up' },
    routine: { score: 0.48, trend: 'up' },
    sleep: { score: 0.55, trend: 'up' },
    medication: { score: 0.58, trend: 'down' },
    speech: { score: 0.38, trend: 'up' },
  },
  {
    name: 'Dorothy Williams',
    cogDelay: { score: 0.28, trend: 'stable' },
    routine: { score: 0.22, trend: 'down' },
    sleep: { score: 0.30, trend: 'stable' },
    medication: { score: 0.96, trend: 'up' },
    speech: { score: 0.18, trend: 'down' },
  },
  {
    name: 'Frank Morrison',
    cogDelay: { score: 0.48, trend: 'up' },
    routine: { score: 0.42, trend: 'up' },
    sleep: { score: 0.50, trend: 'up' },
    medication: { score: 0.45, trend: 'down' },
    speech: { score: 0.35, trend: 'up' },
  },
];

const interpretations = [
  { biomarker: 'Cognitive Response Delay', description: 'Measures the average delay in response to cognitive prompts. Higher values indicate slower processing. Scores above 0.5 may warrant clinical review.' },
  { biomarker: 'Routine Disruption', description: 'Tracks deviations from established daily routines. Higher scores indicate more disruption. Sudden increases may signal cognitive decline.' },
  { biomarker: 'Sleep Irregularity', description: 'Monitors variations in sleep patterns including onset, duration, and waking episodes. Higher values correlate with poorer cognitive function.' },
  { biomarker: 'Medication Adherence', description: 'Percentage of prescribed medications taken on schedule. Higher is better. Scores below 0.7 require caregiver intervention.' },
  { biomarker: 'Speech Hesitation', description: 'Frequency and duration of pauses during verbal interactions. Higher scores indicate increased word-finding difficulty.' },
];

function trendIcon(trend: string) {
  if (trend === 'up') return '\u2191';
  if (trend === 'down') return '\u2193';
  return '\u2192';
}

function trendColor(trend: string, isAdherence = false) {
  if (isAdherence) {
    return trend === 'up' ? '#059669' : trend === 'down' ? '#DC2626' : '#64748B';
  }
  return trend === 'up' ? '#DC2626' : trend === 'down' ? '#059669' : '#64748B';
}

function scoreColor(score: number, isAdherence = false) {
  if (isAdherence) {
    return score >= 0.8 ? '#059669' : score >= 0.6 ? '#D97706' : '#DC2626';
  }
  return score <= 0.3 ? '#059669' : score <= 0.5 ? '#D97706' : '#DC2626';
}

export default function BiomarkersPage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
        Biomarker Analysis
      </h1>
      <p style={{ color: '#64748B', fontSize: 15, marginBottom: 32 }}>
        Population-level and per-patient digital biomarker trends.
      </p>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 36 }}>
        {biomarkerSummary.map((b) => (
          <div
            key={b.label}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              padding: 20,
              borderTop: `3px solid ${b.color}`,
            }}
          >
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500, marginBottom: 8 }}>
              {b.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
              {b.value.toFixed(2)}
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8 }}>{b.unit}</div>
            <div
              style={{
                display: 'inline-block',
                padding: '3px 8px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                background: b.trend === 'stable' ? '#F1F5F9' : b.trend === 'up' ? '#FEF3C7' : '#D1FAE5',
                color: b.trend === 'stable' ? '#64748B' : b.trend === 'up' ? '#92400E' : '#065F46',
              }}
            >
              {b.trendLabel}
            </div>
          </div>
        ))}
      </div>

      {/* Per-Patient Biomarker Table */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 36,
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', margin: 0 }}>
            Per-Patient Biomarkers
          </h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {['Patient', 'Cog. Delay', 'Routine Disr.', 'Sleep Irreg.', 'Med. Adherence', 'Speech Hes.'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #E2E8F0',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patientBiomarkers.map((p) => {
              const metrics = [
                { ...p.cogDelay, isAdherence: false },
                { ...p.routine, isAdherence: false },
                { ...p.sleep, isAdherence: false },
                { ...p.medication, isAdherence: true },
                { ...p.speech, isAdherence: false },
              ];
              return (
                <tr key={p.name} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 500, color: '#0F172A' }}>
                    {p.name}
                  </td>
                  {metrics.map((m, i) => (
                    <td key={i} style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: scoreColor(m.score, m.isAdherence) }}>
                        {m.score.toFixed(2)}
                      </span>
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: 13,
                          fontWeight: 600,
                          color: trendColor(m.trend, m.isAdherence),
                        }}
                      >
                        {trendIcon(m.trend)}
                      </span>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Interpretation Guide */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: 28,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', marginBottom: 20 }}>
          Interpretation Guide
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {interpretations.map((item) => (
            <div key={item.biomarker}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 4 }}>
                {item.biomarker}
              </div>
              <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
