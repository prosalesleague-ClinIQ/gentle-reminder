'use client';

const carePlans = [
  {
    id: 1,
    patientName: 'Margaret Thompson',
    planName: 'Cognitive Maintenance Plan',
    startDate: 'March 1, 2026',
    nextReview: 'April 7, 2026',
    goals: [
      { text: 'Maintain orientation scores above 75%', status: 'On Track', color: '#16A34A' },
      { text: 'Complete 5 sessions per week', status: 'On Track', color: '#16A34A' },
      { text: 'Improve memory recall to 70%', status: 'At Risk', color: '#D97706' },
    ],
    interventions: [
      { name: 'Daily morning orientation', frequency: 'Daily', compliance: 95 },
      { name: 'Family photo review', frequency: '3x/week', compliance: 80 },
      { name: 'Music therapy sessions', frequency: '2x/week', compliance: 60 },
      { name: 'Evening calming routine', frequency: 'Daily', compliance: 90 },
    ],
  },
  {
    id: 2,
    patientName: 'Harold Jenkins',
    planName: 'Medication Adherence Focus',
    startDate: 'March 15, 2026',
    nextReview: undefined,
    goals: [
      { text: 'Achieve 90% medication adherence', status: 'Behind', color: '#DC2626' },
      { text: 'Reduce agitation episodes', status: 'On Track', color: '#16A34A' },
    ],
    interventions: [
      { name: 'Medication reminders with voice', frequency: 'Daily', compliance: 65 },
      { name: 'Structured daily routine', frequency: 'Daily', compliance: 72 },
    ],
  },
];

function ComplianceBar({ value }: { value: number }) {
  const barColor = value >= 85 ? '#16A34A' : value >= 70 ? '#D97706' : '#DC2626';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 8,
          background: '#E2E8F0',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            background: barColor,
            borderRadius: 4,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: barColor, minWidth: 36, textAlign: 'right' }}>
        {value}%
      </span>
    </div>
  );
}

function StatusBadge({ status, color }: { status: string; color: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        color: color,
        background: `${color}18`,
        border: `1px solid ${color}30`,
      }}
    >
      {status}
    </span>
  );
}

export default function CarePlansPage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 960 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', margin: 0 }}>Care Plans</h1>
        <p style={{ fontSize: 15, color: '#64748B', marginTop: 6 }}>
          Personalized care strategies for each patient
        </p>
      </div>

      {carePlans.map((plan) => (
        <div
          key={plan.id}
          style={{
            background: '#FFFFFF',
            borderRadius: 12,
            border: '1px solid #E2E8F0',
            padding: 28,
            marginBottom: 24,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: 0 }}>{plan.patientName}</h2>
              <p style={{ fontSize: 14, color: '#64748B', marginTop: 4, marginBottom: 0 }}>{plan.planName}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>Started</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>{plan.startDate}</div>
            </div>
          </div>

          {/* Goals */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#334155', marginBottom: 12, marginTop: 0 }}>Goals</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {plan.goals.map((goal, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: '#F8FAFC',
                    borderRadius: 8,
                    border: '1px solid #F1F5F9',
                  }}
                >
                  <span style={{ fontSize: 14, color: '#334155' }}>{goal.text}</span>
                  <StatusBadge status={goal.status} color={goal.color} />
                </div>
              ))}
            </div>
          </div>

          {/* Interventions */}
          <div style={{ marginBottom: plan.nextReview ? 20 : 0 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#334155', marginBottom: 12, marginTop: 0 }}>Interventions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {plan.interventions.map((intervention, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, color: '#334155' }}>{intervention.name}</span>
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>{intervention.frequency}</span>
                  </div>
                  <ComplianceBar value={intervention.compliance} />
                </div>
              ))}
            </div>
          </div>

          {/* Next review */}
          {plan.nextReview && (
            <div
              style={{
                padding: '12px 16px',
                background: '#EFF6FF',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 16 }}>{'\u{1F4C5}'}</span>
              <span style={{ fontSize: 13, color: '#1E40AF', fontWeight: 500 }}>
                Next review: {plan.nextReview}
              </span>
            </div>
          )}
        </div>
      ))}

      {/* Create New Plan Button */}
      <button
        style={{
          width: '100%',
          padding: '14px 24px',
          background: '#1A7BC4',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: 10,
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: 8,
        }}
      >
        + Create New Plan
      </button>
    </div>
  );
}
