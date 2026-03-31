import CognitiveChart from '../../components/CognitiveChart';
import SessionChart from '../../components/SessionChart';
import EngagementChart from '../../components/EngagementChart';

const summaryStats = [
  { label: 'Active Patients', value: '12', change: '+2 this month', positive: true },
  { label: 'Total Sessions (30d)', value: '284', change: '+18% vs prior', positive: true },
  { label: 'Avg Completion Rate', value: '87%', change: '+3% vs prior', positive: true },
  { label: 'Avg Cognitive Score', value: '68%', change: '-2% vs prior', positive: false },
  { label: 'Alerts Triggered (30d)', value: '9', change: '-4 vs prior', positive: true },
  { label: 'Avg Session Duration', value: '8.2 min', change: '+0.5 min', positive: true },
];

export default function AnalyticsPage() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: '#1F2937' }}>
          Analytics &amp; Trends
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280', margin: '6px 0 0' }}>
          Aggregated insights across all patients
        </p>
      </div>

      {/* Full-width cognitive chart */}
      <div style={{ marginBottom: 24 }}>
        <CognitiveChart title="Overall Cognitive Score Trends" days={30} />
      </div>

      {/* Two charts side by side */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          marginBottom: 24,
        }}
      >
        <SessionChart />
        <EngagementChart />
      </div>

      {/* Summary stats */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <h2 style={{ fontSize: 17, fontWeight: 600, margin: '0 0 20px', color: '#1F2937' }}>
          Summary
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          {summaryStats.map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: 18,
                background: '#F9FAFB',
                borderRadius: 10,
              }}
            >
              <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 6 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#1F2937', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  marginTop: 6,
                  color: stat.positive ? '#3D8158' : '#C0392B',
                }}
              >
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
