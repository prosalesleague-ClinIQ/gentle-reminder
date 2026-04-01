const SLEEP_STATS = [
  { label: 'Avg Sleep', value: '6.8h', subtitle: 'Across all patients', color: '#6366F1' },
  { label: 'Avg Quality', value: '74%', subtitle: 'Sleep quality score', color: '#3D8158' },
  { label: 'Patients < 6h', value: '2', subtitle: 'Below recommended', color: '#EF4444' },
  { label: 'Disrupted Nights', value: '8', subtitle: 'Past 7 days', color: '#F59E0B' },
];

const PATIENTS = [
  { name: 'Margaret Thompson', avgHours: 7.2, quality: 82, wakeUps: 1, trend: 'Improving', lastNight: 'Good' },
  { name: 'Harold Jenkins', avgHours: 5.4, quality: 58, wakeUps: 4, trend: 'Declining', lastNight: 'Poor' },
  { name: 'Dorothy Williams', avgHours: 7.8, quality: 89, wakeUps: 0, trend: 'Stable', lastNight: 'Excellent' },
  { name: 'Frank Anderson', avgHours: 5.9, quality: 64, wakeUps: 3, trend: 'Declining', lastNight: 'Fair' },
];

function getQualityColor(quality: number): string {
  if (quality >= 80) return '#10B981';
  if (quality >= 60) return '#F59E0B';
  return '#EF4444';
}

function getTrendColor(trend: string): string {
  if (trend === 'Improving') return '#10B981';
  if (trend === 'Stable') return '#3B82F6';
  return '#EF4444';
}

function getLastNightColor(rating: string): string {
  if (rating === 'Excellent') return '#10B981';
  if (rating === 'Good') return '#3B82F6';
  if (rating === 'Fair') return '#F59E0B';
  return '#EF4444';
}

export default function SleepPage() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', margin: '0 0 4px' }}>
          Sleep Analysis
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
          Population sleep patterns and individual trends
        </p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        {SLEEP_STATS.map((stat) => (
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

      {/* Per-Patient Sleep Table */}
      <div style={{
        background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', marginBottom: 32, overflow: 'hidden',
      }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #F0F0F0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Individual Sleep Data</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Patient', 'Avg Hours', 'Quality', 'Wake-ups/Night', 'Trend', 'Last Night'].map((h) => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontWeight: 600,
                    color: '#475569', fontSize: 11, textTransform: 'uppercase' as const,
                    letterSpacing: '0.04em', borderBottom: '1px solid #E2E8F0',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PATIENTS.map((p, i) => (
                <tr key={p.name} style={{ borderBottom: i < PATIENTS.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0F172A' }}>{p.name}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: p.avgHours < 6 ? '#EF4444' : '#0F172A' }}>
                    {p.avgHours}h
                  </td>
                  <td style={{ padding: '14px 16px', minWidth: 140 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{
                          width: `${p.quality}%`, height: '100%',
                          background: getQualityColor(p.quality), borderRadius: 4,
                        }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: getQualityColor(p.quality), minWidth: 32 }}>
                        {p.quality}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: p.wakeUps >= 3 ? '#EF4444' : '#334155' }}>
                    {p.wakeUps}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: 12,
                      fontSize: 12, fontWeight: 600, color: getTrendColor(p.trend),
                      background: getTrendColor(p.trend) + '18',
                    }}>
                      {p.trend}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: 12,
                      fontSize: 12, fontWeight: 600, color: getLastNightColor(p.lastNight),
                      background: getLastNightColor(p.lastNight) + '18',
                    }}>
                      {p.lastNight}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sleep Hygiene Recommendations */}
      <div style={{
        background: '#F0F9FF', borderRadius: 12, padding: 24,
        border: '1px solid #BAE6FD',
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#0C4A6E', marginBottom: 12 }}>
          Sleep Hygiene Recommendations
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ color: '#1A7BC4', fontWeight: 700, flexShrink: 0 }}>{'\u2022'}</span>
            <span style={{ fontSize: 14, color: '#0369A1', lineHeight: 1.6 }}>
              Patients averaging less than 6 hours may benefit from adjusted evening routines
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ color: '#1A7BC4', fontWeight: 700, flexShrink: 0 }}>{'\u2022'}</span>
            <span style={{ fontSize: 14, color: '#0369A1', lineHeight: 1.6 }}>
              Consider reducing evening stimulation for patients with 3+ wake-ups
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
