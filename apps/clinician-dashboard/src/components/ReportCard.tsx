import { ClinicalReport } from '../data/mock';

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

interface ReportCardProps {
  report: ClinicalReport;
  compact?: boolean;
}

export default function ReportCard({ report, compact = false }: ReportCardProps) {
  const statusStyle = statusColors[report.status] || statusColors['Draft'];
  const typeColor = typeColors[report.reportType] || '#6366F1';

  if (compact) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 0',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <div
            style={{
              width: 4,
              height: 36,
              borderRadius: 2,
              background: typeColor,
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>
              {report.patientName}
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
              {report.reportType} &middot; {report.date}
            </div>
          </div>
        </div>
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
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 10,
        border: '1px solid #E2E8F0',
        padding: 20,
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 4,
                background: typeColor + '18',
                color: typeColor,
                letterSpacing: '0.02em',
              }}
            >
              {report.reportType}
            </span>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>{report.id}</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>
            {report.patientName}
          </div>
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            padding: '4px 12px',
            borderRadius: 12,
            background: statusStyle.bg,
            color: statusStyle.color,
          }}
        >
          {report.status}
        </span>
      </div>
      <p style={{ fontSize: 13, color: '#475569', margin: '0 0 12px', lineHeight: 1.5 }}>
        {report.scoreSummary}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: '#94A3B8' }}>
          {report.date} &middot; {report.generatedBy}
        </div>
        <button
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: '#3B82F6',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0',
          }}
        >
          View Full Report
        </button>
      </div>
    </div>
  );
}
