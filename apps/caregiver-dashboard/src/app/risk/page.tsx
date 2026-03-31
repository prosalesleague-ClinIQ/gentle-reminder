import Sidebar from '../../components/Sidebar';

const RISK_DATA = [
  {
    id: 'p1',
    name: 'Margaret Thompson',
    cognitiveDecline: 0.62,
    fallRisk: 0.28,
    wanderingRisk: 0.15,
    medicationRisk: 0.35,
    overallRisk: 0.45,
    trend: 'increasing',
    lastUpdated: 'Mar 31, 2026',
  },
  {
    id: 'p2',
    name: 'Harold Jenkins',
    cognitiveDecline: 0.78,
    fallRisk: 0.55,
    wanderingRisk: 0.42,
    medicationRisk: 0.60,
    overallRisk: 0.68,
    trend: 'increasing',
    lastUpdated: 'Mar 30, 2026',
  },
  {
    id: 'p3',
    name: 'Dorothy Williams',
    cognitiveDecline: 0.22,
    fallRisk: 0.12,
    wanderingRisk: 0.08,
    medicationRisk: 0.15,
    overallRisk: 0.18,
    trend: 'stable',
    lastUpdated: 'Mar 31, 2026',
  },
  {
    id: 'p4',
    name: 'Frank Anderson',
    cognitiveDecline: 0.88,
    fallRisk: 0.72,
    wanderingRisk: 0.65,
    medicationRisk: 0.80,
    overallRisk: 0.82,
    trend: 'increasing',
    lastUpdated: 'Mar 29, 2026',
  },
];

const BIOMARKER_TRENDS = [
  { label: 'Routine Disruption', population: 0.35, change: '+3%', status: 'warning' },
  { label: 'Sleep Irregularity', population: 0.42, change: '+5%', status: 'warning' },
  { label: 'Response Delay', population: 0.38, change: '+2%', status: 'stable' },
  { label: 'Speech Hesitation', population: 0.29, change: '-1%', status: 'improving' },
  { label: 'Medication Adherence', population: 0.78, change: '+4%', status: 'improving' },
];

function getRiskColor(risk: number): string {
  if (risk >= 0.7) return '#EF4444';
  if (risk >= 0.4) return '#F59E0B';
  return '#10B981';
}

function getRiskLabel(risk: number): string {
  if (risk >= 0.7) return 'High';
  if (risk >= 0.4) return 'Moderate';
  return 'Low';
}

function getStatusColor(status: string): string {
  if (status === 'warning') return '#F59E0B';
  if (status === 'improving') return '#10B981';
  return '#64748B';
}

export default function RiskDashboard() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', margin: '0 0 4px' }}>
          Risk Predictions
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
          AI-powered risk assessment across all patients
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'High Risk', count: RISK_DATA.filter(p => p.overallRisk >= 0.7).length, color: '#EF4444' },
          { label: 'Moderate Risk', count: RISK_DATA.filter(p => p.overallRisk >= 0.4 && p.overallRisk < 0.7).length, color: '#F59E0B' },
          { label: 'Low Risk', count: RISK_DATA.filter(p => p.overallRisk < 0.4).length, color: '#10B981' },
          { label: 'Trending Up', count: RISK_DATA.filter(p => p.trend === 'increasing').length, color: '#EF4444' },
        ].map(card => (
          <div key={card.label} style={{
            background: '#fff', borderRadius: 10, padding: '20px 24px',
            border: '1px solid #E2E8F0', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: card.color }} />
            <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase' as const, letterSpacing: '0.03em', marginBottom: 6 }}>{card.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#0F172A' }}>{card.count}</div>
          </div>
        ))}
      </div>

      {/* Patient Risk Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', marginBottom: 32, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #F0F0F0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Patient Risk Assessment</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #F0F0F0' }}>
              {['Patient', 'Overall', 'Cognitive', 'Fall', 'Wandering', 'Medication', 'Trend'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' as const }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RISK_DATA.map(patient => (
              <tr key={patient.id} style={{ borderBottom: '1px solid #F8F8F8' }}>
                <td style={{ padding: '14px 16px', fontWeight: 500, fontSize: 14 }}>{patient.name}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    display: 'inline-block', padding: '4px 12px', borderRadius: 20,
                    fontSize: 13, fontWeight: 600, color: '#fff',
                    background: getRiskColor(patient.overallRisk),
                  }}>
                    {getRiskLabel(patient.overallRisk)} ({Math.round(patient.overallRisk * 100)}%)
                  </span>
                </td>
                {[patient.cognitiveDecline, patient.fallRisk, patient.wanderingRisk, patient.medicationRisk].map((risk, i) => (
                  <td key={i} style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${risk * 100}%`, height: '100%', background: getRiskColor(risk), borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 13, color: '#374151' }}>{Math.round(risk * 100)}%</span>
                    </div>
                  </td>
                ))}
                <td style={{ padding: '14px 16px', fontSize: 13, color: patient.trend === 'increasing' ? '#EF4444' : '#64748B' }}>
                  {patient.trend === 'increasing' ? '↑ Rising' : '→ Stable'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Biomarker Population Trends */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #F0F0F0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Population Biomarker Trends</h2>
        </div>
        <div style={{ padding: 24 }}>
          {BIOMARKER_TRENDS.map(bio => (
            <div key={bio.label} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F8F8F8' }}>
              <div style={{ width: 180, fontSize: 14, fontWeight: 500, color: '#334155' }}>{bio.label}</div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${bio.population * 100}%`, height: '100%', background: '#1A7BC4', borderRadius: 4 }} />
                </div>
                <span style={{ fontSize: 13, color: '#374151', width: 40 }}>{Math.round(bio.population * 100)}%</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: getStatusColor(bio.status), width: 60, textAlign: 'right' as const }}>{bio.change}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
