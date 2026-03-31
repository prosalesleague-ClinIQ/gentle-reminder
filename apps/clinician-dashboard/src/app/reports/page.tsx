import { reports } from '../../data/mock';

const statusColors: Record<string, { bg: string; color: string }> = {
  'Complete': { bg: '#D1FAE5', color: '#065F46' },
  'Approved': { bg: '#DBEAFE', color: '#1E40AF' },
  'Pending Review': { bg: '#FEF3C7', color: '#92400E' },
  'Draft': { bg: '#F1F5F9', color: '#475569' },
};

const typeColors: Record<string, string> = {
  'Weekly Summary': '#6366F1',
  'Monthly Assessment': '#3B82F6',
  'Decline Report': '#EF4444',
  'Medication Review': '#F59E0B',
  'Caregiver Feedback': '#10B981',
};

export default function ReportsPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>
            Clinical Reports
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
            Generated reports and assessments
          </p>
        </div>
        <button
          style={{
            padding: '10px 20px',
            background: '#3B82F6',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="2" x2="8" y2="14" />
            <line x1="2" y1="8" x2="14" y2="8" />
          </svg>
          Generate Report
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 20,
          padding: '14px 18px',
          background: '#FFFFFF',
          borderRadius: 10,
          border: '1px solid #E2E8F0',
        }}
      >
        {['All Types', 'Weekly Summary', 'Monthly Assessment', 'Decline Report', 'Medication Review'].map(
          (filter, i) => (
            <button
              key={filter}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                background: i === 0 ? '#0F172A' : '#F1F5F9',
                color: i === 0 ? '#FFFFFF' : '#475569',
              }}
            >
              {filter}
            </button>
          )
        )}
      </div>

      {/* Reports Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 10,
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 13,
          }}
        >
          <thead>
            <tr
              style={{
                background: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
              }}
            >
              {['Patient', 'Report Type', 'Date', 'Score Summary', 'Status', 'Actions'].map(
                (col) => (
                  <th
                    key={col}
                    style={{
                      padding: '12px 16px',
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
            {reports.map((report, idx) => {
              const statusStyle = statusColors[report.status] || statusColors['Draft'];
              const typeColor = typeColors[report.reportType] || '#6366F1';
              return (
                <tr
                  key={report.id}
                  style={{
                    borderBottom: idx < reports.length - 1 ? '1px solid #F1F5F9' : 'none',
                  }}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 500, color: '#0F172A' }}>{report.patientName}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{report.id}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        padding: '3px 10px',
                        borderRadius: 4,
                        background: typeColor + '15',
                        color: typeColor,
                      }}
                    >
                      {report.reportType}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#475569' }}>{report.date}</td>
                  <td style={{ padding: '14px 16px', color: '#475569', maxWidth: 260 }}>
                    {report.scoreSummary}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: '3px 10px',
                        borderRadius: 12,
                        background: statusStyle.bg,
                        color: statusStyle.color,
                      }}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        style={{
                          padding: '5px 10px',
                          borderRadius: 5,
                          border: '1px solid #E2E8F0',
                          background: '#FFFFFF',
                          fontSize: 12,
                          color: '#475569',
                          cursor: 'pointer',
                        }}
                      >
                        View
                      </button>
                      <button
                        style={{
                          padding: '5px 10px',
                          borderRadius: 5,
                          border: '1px solid #E2E8F0',
                          background: '#FFFFFF',
                          fontSize: 12,
                          color: '#475569',
                          cursor: 'pointer',
                        }}
                      >
                        Export
                      </button>
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
