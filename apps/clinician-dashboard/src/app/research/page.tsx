import { cohortStats, deidentifiedData } from '../../data/mock';

export default function ResearchPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>
          Research Data
        </h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
          Cohort statistics, data exports, and de-identified research datasets
        </p>
      </div>

      {/* Cohort Statistics */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 10,
          padding: 24,
          border: '1px solid #E2E8F0',
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', margin: '0 0 20px' }}>
          Cohort Statistics
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {cohortStats.map((cohort) => (
            <div
              key={cohort.studyName}
              style={{
                padding: 20,
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                background: '#FAFBFC',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 14 }}>
                {cohort.studyName}
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px 16px',
                  fontSize: 13,
                }}
              >
                <div>
                  <div style={{ color: '#94A3B8', fontSize: 11, fontWeight: 500, marginBottom: 2, textTransform: 'uppercase' as const }}>
                    Enrolled
                  </div>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{cohort.enrolled}</div>
                </div>
                <div>
                  <div style={{ color: '#94A3B8', fontSize: 11, fontWeight: 500, marginBottom: 2, textTransform: 'uppercase' as const }}>
                    Active
                  </div>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{cohort.active}</div>
                </div>
                <div>
                  <div style={{ color: '#94A3B8', fontSize: 11, fontWeight: 500, marginBottom: 2, textTransform: 'uppercase' as const }}>
                    Completed
                  </div>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{cohort.completed}</div>
                </div>
                <div>
                  <div style={{ color: '#94A3B8', fontSize: 11, fontWeight: 500, marginBottom: 2, textTransform: 'uppercase' as const }}>
                    Dropouts
                  </div>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{cohort.dropouts}</div>
                </div>
              </div>

              {/* Completion bar */}
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B', marginBottom: 4 }}>
                  <span>Completion Rate</span>
                  <span style={{ fontWeight: 600 }}>{cohort.completionRate}%</span>
                </div>
                <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${cohort.completionRate}%`,
                      height: '100%',
                      background: cohort.completionRate >= 90 ? '#10B981' : '#F59E0B',
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 10 }}>
                Avg Age: {cohort.avgAge} years
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Export Options */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 10,
          padding: 24,
          border: '1px solid #E2E8F0',
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', margin: '0 0 16px' }}>
          Data Export
        </h2>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 20px' }}>
          Export de-identified research data in various formats for analysis and reporting.
        </p>
        <div style={{ display: 'flex', gap: 14 }}>
          {[
            { label: 'Export PDF Report', desc: 'Formatted clinical summary', icon: 'PDF', color: '#EF4444' },
            { label: 'Export CSV Data', desc: 'Raw data for statistical analysis', icon: 'CSV', color: '#10B981' },
            { label: 'EMR Integration', desc: 'HL7 FHIR compatible export', icon: 'EMR', color: '#3B82F6' },
          ].map((option) => (
            <button
              key={option.label}
              style={{
                flex: 1,
                padding: '18px 20px',
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                background: '#FAFBFC',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 8,
                  background: option.color + '12',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: option.color,
                  flexShrink: 0,
                }}
              >
                {option.icon}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>{option.label}</div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{option.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* De-identified Data Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 10,
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', margin: '0 0 4px' }}>
            De-identified Data Summary
          </h2>
          <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>
            All personally identifiable information has been removed per IRB protocol.
          </p>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              {['Subject ID', 'Age Range', 'Sex', 'Stage', 'Baseline MMSE', 'Current MMSE', 'Months', 'Group', 'Adherence'].map(
                (col) => (
                  <th
                    key={col}
                    style={{
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#64748B',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {deidentifiedData.map((row, idx) => {
              const mmseDelta = row.currentMMSE - row.baselineMMSE;
              const deltaColor = mmseDelta > 0 ? '#10B981' : mmseDelta < 0 ? '#EF4444' : '#94A3B8';
              return (
                <tr
                  key={row.subjectId}
                  style={{
                    borderBottom: idx < deidentifiedData.length - 1 ? '1px solid #F1F5F9' : 'none',
                  }}
                >
                  <td style={{ padding: '12px 14px', fontWeight: 500, color: '#334155', fontFamily: 'monospace' }}>
                    {row.subjectId}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{row.ageRange}</td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{row.sex}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background:
                          row.stage === 'Mild' ? '#D1FAE5' : row.stage === 'Moderate' ? '#FEF3C7' : '#FEE2E2',
                        color:
                          row.stage === 'Mild' ? '#065F46' : row.stage === 'Moderate' ? '#92400E' : '#991B1B',
                      }}
                    >
                      {row.stage}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{row.baselineMMSE}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ color: '#475569' }}>{row.currentMMSE}</span>
                    <span style={{ fontSize: 11, color: deltaColor, marginLeft: 6, fontWeight: 500 }}>
                      ({mmseDelta > 0 ? '+' : ''}{mmseDelta})
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{row.monthsEnrolled}</td>
                  <td style={{ padding: '12px 14px', color: '#475569', fontSize: 12 }}>{row.interventionGroup}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 50, height: 5, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${row.adherenceRate}%`,
                            height: '100%',
                            background: row.adherenceRate >= 80 ? '#10B981' : row.adherenceRate >= 60 ? '#F59E0B' : '#EF4444',
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 12, color: '#475569' }}>{row.adherenceRate}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
