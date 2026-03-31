import Link from 'next/link';
import { patients, alerts } from '../../../data/mock';
import AlertBadge from '../../../components/AlertBadge';
import CognitiveChart from '../../../components/CognitiveChart';

const stageColors: Record<string, { bg: string; color: string }> = {
  Mild: { bg: '#EBF5EC', color: '#3D8158' },
  Moderate: { bg: '#FEF7E0', color: '#B58200' },
  Severe: { bg: '#FDECEC', color: '#C0392B' },
};

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 75 ? '#3D8158' : score >= 50 ? '#E5A300' : '#C0392B';
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 14, color: '#4B5563', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color }}>{score}%</span>
      </div>
      <div style={{ height: 8, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${score}%`,
            background: color,
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
}

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = patients.find((p) => p.id === id);

  if (!patient) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2 style={{ color: '#6B7280' }}>Patient not found</h2>
        <Link href="/patients" style={{ color: '#1A7BC4' }}>
          Back to patients
        </Link>
      </div>
    );
  }

  const patientAlerts = alerts.filter((a) => a.patientId === patient.id);
  const stage = stageColors[patient.stage];
  const trendLabel = patient.trend === 'up' ? 'Improving' : patient.trend === 'down' ? 'Declining' : 'Stable';
  const trendColor = patient.trend === 'up' ? '#3D8158' : patient.trend === 'down' ? '#C0392B' : '#6B7280';

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 20, fontSize: 13, color: '#9CA3AF' }}>
        <Link href="/patients" style={{ color: '#1A7BC4', textDecoration: 'none' }}>
          Patients
        </Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: '#6B7280' }}>{patient.name}</span>
      </div>

      {/* Patient info card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          padding: 28,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 20,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: '#1A7BC4',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {patient.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{patient.name}</h1>
              <div style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>
                {patient.age} years old &middot; {patient.city}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                background: stage.bg,
                color: stage.color,
              }}
            >
              {patient.stage} Stage
            </span>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                background: patient.trend === 'up' ? '#EBF5EC' : patient.trend === 'down' ? '#FDECEC' : '#F3F4F6',
                color: trendColor,
              }}
            >
              {trendLabel}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>Overall Score</div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: patient.overallScore >= 75 ? '#3D8158' : patient.overallScore >= 50 ? '#B58200' : '#C0392B',
              lineHeight: 1,
            }}
          >
            {patient.overallScore}%
          </div>
        </div>
      </div>

      {/* Alerts for this patient */}
      {patientAlerts.length > 0 && (
        <div
          style={{
            background: '#FFF8F0',
            borderRadius: 12,
            padding: '16px 24px',
            marginBottom: 24,
            border: '1px solid #FDECD0',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: '#92400E', marginBottom: 10 }}>
            Active Alerts ({patientAlerts.length})
          </div>
          {patientAlerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 0',
                borderBottom: '1px solid #FDE8D0',
                fontSize: 14,
                color: '#374151',
              }}
            >
              <AlertBadge severity={alert.severity} />
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Cognitive Score Breakdown */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          <h2 style={{ fontSize: 17, fontWeight: 600, margin: '0 0 20px' }}>Cognitive Breakdown</h2>
          <ScoreBar label="Orientation" score={patient.orientation} />
          <ScoreBar label="Identity Recognition" score={patient.identity} />
          <ScoreBar label="Memory Recall" score={patient.memory} />
        </div>

        {/* Quick Stats */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          <h2 style={{ fontSize: 17, fontWeight: 600, margin: '0 0 20px' }}>Quick Stats</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Total Sessions', value: patient.sessions.length },
              { label: 'Completed', value: patient.sessions.filter((s) => s.completed).length },
              { label: 'Avg Duration', value: Math.round(patient.sessions.reduce((sum, s) => sum + parseInt(s.duration), 0) / patient.sessions.length) + ' min' },
              { label: 'Last Session', value: new Date(patient.lastSession).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: 14,
                  background: '#F9FAFB',
                  borderRadius: 8,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 700, color: '#1A7BC4' }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cognitive Trends Chart */}
      <div style={{ marginBottom: 24 }}>
        <CognitiveChart title={`${patient.name} \u2014 Cognitive Trends`} days={30} />
      </div>

      {/* Recent Sessions */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0F0F0' }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>Recent Sessions</h2>
        </div>

        {/* Table header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 0.8fr 0.8fr 0.8fr',
            padding: '12px 24px',
            background: '#F9FAFB',
            fontSize: 12,
            fontWeight: 600,
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          <span>Type</span>
          <span>Date</span>
          <span>Score</span>
          <span>Duration</span>
          <span>Status</span>
        </div>

        {patient.sessions.map((session) => {
          const scoreColor = session.score >= 75 ? '#3D8158' : session.score >= 50 ? '#B58200' : '#C0392B';
          return (
            <div
              key={session.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr 0.8fr 0.8fr 0.8fr',
                padding: '14px 24px',
                borderBottom: '1px solid #F8F8F8',
                fontSize: 14,
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: 500, color: '#1F2937' }}>{session.type}</span>
              <span style={{ color: '#6B7280' }}>
                {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span style={{ fontWeight: 600, color: scoreColor }}>{session.score}%</span>
              <span style={{ color: '#6B7280' }}>{session.duration}</span>
              <span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 500,
                    background: session.completed ? '#EBF5EC' : '#FEF7E0',
                    color: session.completed ? '#3D8158' : '#B58200',
                  }}
                >
                  {session.completed ? 'Completed' : 'Incomplete'}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
