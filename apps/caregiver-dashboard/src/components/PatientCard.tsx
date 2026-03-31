import Link from 'next/link';
import type { Patient } from '../data/mock';

const stageColors: Record<string, { bg: string; color: string }> = {
  Mild: { bg: '#EBF5EC', color: '#3D8158' },
  Moderate: { bg: '#FEF7E0', color: '#B58200' },
  Severe: { bg: '#FDECEC', color: '#C0392B' },
};

const trendSymbols: Record<string, { symbol: string; color: string }> = {
  up: { symbol: '\u2191', color: '#3D8158' },
  down: { symbol: '\u2193', color: '#C0392B' },
  stable: { symbol: '\u2192', color: '#6B7280' },
};

interface PatientCardProps {
  patient: Patient;
}

export default function PatientCard({ patient }: PatientCardProps) {
  const stage = stageColors[patient.stage];
  const trend = trendSymbols[patient.trend];

  const scoreColor =
    patient.overallScore >= 75 ? '#3D8158' : patient.overallScore >= 50 ? '#B58200' : '#C0392B';

  return (
    <Link
      href={`/patients/${patient.id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          transition: 'box-shadow 0.15s, transform 0.15s',
          cursor: 'pointer',
          border: '1px solid #F0F0F0',
        }}
      >
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: '#1F2937' }}>{patient.name}</div>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
              {patient.age} years old &middot; {patient.city}
            </div>
          </div>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              background: stage.bg,
              color: stage.color,
            }}
          >
            {patient.stage}
          </span>
        </div>

        {/* Score bar */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: '#6B7280' }}>Overall Score</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: scoreColor }}>
              {patient.overallScore}%
              <span style={{ fontSize: 16, marginLeft: 4, color: trend.color }}>{trend.symbol}</span>
            </span>
          </div>
          <div style={{ height: 6, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${patient.overallScore}%`,
                background: scoreColor,
                borderRadius: 3,
                transition: 'width 0.3s',
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>
            Last session: {new Date(patient.lastSession).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <span style={{ fontSize: 12, color: '#1A7BC4', fontWeight: 500 }}>View Details &rarr;</span>
        </div>
      </div>
    </Link>
  );
}
