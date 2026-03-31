import { overviewStats, cognitiveDistribution, recentReports } from '../data/mock';
import ReportCard from '../components/ReportCard';

const statCards = [
  { label: 'Total Patients', value: overviewStats.totalPatients, color: '#3B82F6' },
  { label: 'Active Studies', value: overviewStats.activeStudies, color: '#8B5CF6' },
  { label: 'Reports Generated', value: overviewStats.reportsGenerated, color: '#10B981' },
  { label: 'Avg Cognitive Score', value: `${overviewStats.avgCognitiveScore}%`, color: '#F59E0B' },
];

const distributionBars = [
  { label: 'Mild', ...cognitiveDistribution.mild, color: '#10B981' },
  { label: 'Moderate', ...cognitiveDistribution.moderate, color: '#F59E0B' },
  { label: 'Severe', ...cognitiveDistribution.severe, color: '#EF4444' },
];

export default function ClinicalOverview() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>
          Clinical Overview
        </h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
          Population health summary and recent activity
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
          marginBottom: 32,
        }}
      >
        {statCards.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: '#FFFFFF',
              borderRadius: 10,
              padding: '22px 24px',
              border: '1px solid #E2E8F0',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: stat.color,
              }}
            />
            <div style={{ fontSize: 12, fontWeight: 500, color: '#64748B', marginBottom: 8, letterSpacing: '0.03em', textTransform: 'uppercase' as const }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#0F172A' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Two-column section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Cognitive Distribution */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 10,
            padding: 24,
            border: '1px solid #E2E8F0',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', margin: '0 0 20px' }}>
            Population Cognitive Distribution
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {distributionBars.map((item) => (
              <div key={item.label}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                    fontSize: 13,
                  }}
                >
                  <span style={{ fontWeight: 500, color: '#334155' }}>{item.label}</span>
                  <span style={{ color: '#64748B' }}>
                    {item.count} patients ({item.percentage}%)
                  </span>
                </div>
                <div
                  style={{
                    height: 10,
                    background: '#F1F5F9',
                    borderRadius: 5,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      background: item.color,
                      borderRadius: 5,
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            style={{
              marginTop: 24,
              padding: '14px 16px',
              background: '#F8FAFC',
              borderRadius: 8,
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>
              Population Summary
            </div>
            <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>
              46% of patients classified as mild stage, 35% moderate, 19% severe.
              Average MMSE estimate across cohort: 19.8.
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 10,
            padding: 24,
            border: '1px solid #E2E8F0',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', margin: 0 }}>
              Recent Clinical Reports
            </h2>
            <a
              href="/reports"
              style={{
                fontSize: 13,
                color: '#3B82F6',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              View All
            </a>
          </div>
          <div>
            {recentReports.map((report) => (
              <ReportCard key={report.id} report={report} compact />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
