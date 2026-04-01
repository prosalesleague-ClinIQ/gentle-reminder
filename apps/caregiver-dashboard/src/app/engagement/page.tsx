const ENGAGEMENT_STATS = [
  { label: 'Sessions This Week', value: '32', subtitle: 'Across all patients', color: '#1A7BC4' },
  { label: 'Avg Duration', value: '5.2 min', subtitle: 'Per session', color: '#3D8158' },
  { label: 'Active Streaks', value: '4', subtitle: 'Patients on streak', color: '#E5A300' },
];

const PATIENT_ENGAGEMENT = [
  { name: 'Margaret Thompson', sessions: 5, streak: 7, adherence: 92, lastActive: 'Today' },
  { name: 'Harold Jenkins', sessions: 2, streak: 0, adherence: 45, lastActive: '3 days ago' },
  { name: 'Dorothy Williams', sessions: 6, streak: 12, adherence: 98, lastActive: 'Today' },
  { name: 'Frank Anderson', sessions: 1, streak: 0, adherence: 28, lastActive: '5 days ago' },
];

function getAdherenceColor(rate: number): string {
  if (rate >= 80) return '#10B981';
  if (rate >= 50) return '#F59E0B';
  return '#EF4444';
}

export default function EngagementPage() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', margin: '0 0 4px' }}>
          Patient Engagement
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
          Track patient participation and session adherence
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        {ENGAGEMENT_STATS.map((stat) => (
          <div key={stat.label} style={{
            background: '#fff', borderRadius: 10, padding: '22px 24px',
            border: '1px solid #E2E8F0', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: stat.color }} />
            <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase' as const, letterSpacing: '0.03em', marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#0F172A' }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>{stat.subtitle}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', marginBottom: 32, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #F0F0F0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Individual Patient Engagement</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, padding: 20 }}>
          {PATIENT_ENGAGEMENT.map((patient) => (
            <div key={patient.name} style={{
              border: '1px solid #E2E8F0', borderRadius: 10, padding: 20,
            }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>{patient.name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#1A7BC4' }}>{patient.sessions}</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Sessions/Week</div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: patient.streak > 0 ? '#E5A300' : '#94A3B8' }}>
                    {patient.streak > 0 ? `${patient.streak} days` : 'None'}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Streak</div>
                </div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: '#334155' }}>Adherence</span>
                  <span style={{ fontWeight: 600, color: getAdherenceColor(patient.adherence) }}>{patient.adherence}%</span>
                </div>
                <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${patient.adherence}%`, height: '100%', background: getAdherenceColor(patient.adherence), borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>Last active: {patient.lastActive}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: '#F0F9FF', borderRadius: 12, padding: 24,
        border: '1px solid #BAE6FD',
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#0C4A6E', marginBottom: 8 }}>
          📊 Engagement Insight
        </div>
        <div style={{ fontSize: 14, color: '#0369A1', lineHeight: 1.6 }}>
          Patients who complete 3+ sessions per week show 23% slower cognitive decline over 6 months.
          Consider reaching out to Harold and Frank to encourage more frequent engagement.
        </div>
      </div>
    </div>
  );
}
