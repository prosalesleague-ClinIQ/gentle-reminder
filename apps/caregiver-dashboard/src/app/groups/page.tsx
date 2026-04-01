export default function GroupsPage() {
  const groups = [
    {
      id: 1,
      name: 'Morning Session Group',
      patients: [
        { initials: 'MW', name: 'Margaret Wilson', color: '#E91E63' },
        { initials: 'DH', name: 'Dorothy Harris', color: '#9C27B0' },
        { initials: 'HJ', name: 'Harold Jenkins', color: '#2196F3' },
        { initials: 'FB', name: 'Frank Bennett', color: '#FF9800' },
      ],
      schedule: 'Daily 9 AM',
      avgScore: 76,
      description: 'Core morning cognitive exercises and orientation check-ins',
    },
    {
      id: 2,
      name: 'Music Therapy Group',
      patients: [
        { initials: 'MW', name: 'Margaret Wilson', color: '#E91E63' },
        { initials: 'DH', name: 'Dorothy Harris', color: '#9C27B0' },
      ],
      schedule: 'Mon/Wed/Fri 2 PM',
      avgScore: 82,
      description: 'Musical memory stimulation and sing-along sessions',
    },
    {
      id: 3,
      name: 'High Risk Monitoring',
      patients: [
        { initials: 'HJ', name: 'Harold Jenkins', color: '#2196F3' },
        { initials: 'FB', name: 'Frank Bennett', color: '#FF9800' },
      ],
      schedule: null,
      alertLevel: 'High',
      lastReview: 'Mar 28',
      description: 'Patients requiring closer cognitive monitoring and alerts',
    },
  ];

  return (
    <div style={{ padding: '32px 40px', maxWidth: 960 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1E293B', margin: 0 }}>Patient Groups</h1>
          <p style={{ fontSize: 15, color: '#64748B', margin: '6px 0 0' }}>
            Manage patient cohorts and group activities
          </p>
        </div>
        <button
          style={{
            padding: '12px 28px',
            background: '#1A7BC4',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Create Group
        </button>
      </div>

      {/* Group Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {groups.map((group) => (
          <div
            key={group.id}
            style={{
              background: '#FFFFFF',
              borderRadius: 12,
              border: '1px solid #E2E8F0',
              padding: 24,
              transition: 'box-shadow 0.15s',
            }}
          >
            {/* Group Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1E293B', margin: 0 }}>{group.name}</h2>
                <p style={{ fontSize: 14, color: '#64748B', margin: '4px 0 0' }}>{group.description}</p>
              </div>
              {group.alertLevel && (
                <span
                  style={{
                    padding: '4px 14px',
                    background: '#FEF2F2',
                    color: '#DC2626',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Alert: {group.alertLevel}
                </span>
              )}
            </div>

            {/* Patient Avatars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              {group.patients.map((patient) => (
                <div
                  key={patient.initials + patient.name}
                  title={patient.name}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: patient.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {patient.initials}
                </div>
              ))}
              <span style={{ fontSize: 14, color: '#64748B', marginLeft: 8 }}>
                {group.patients.length} patient{group.patients.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'flex', gap: 32, fontSize: 14 }}>
              {group.schedule && (
                <div>
                  <span style={{ color: '#94A3B8', fontWeight: 500 }}>Schedule: </span>
                  <span style={{ color: '#1E293B', fontWeight: 600 }}>{group.schedule}</span>
                </div>
              )}
              {group.avgScore !== undefined && (
                <div>
                  <span style={{ color: '#94A3B8', fontWeight: 500 }}>Avg Score: </span>
                  <span
                    style={{
                      color: group.avgScore >= 75 ? '#16A34A' : group.avgScore >= 60 ? '#2563EB' : '#D97706',
                      fontWeight: 600,
                    }}
                  >
                    {group.avgScore}%
                  </span>
                </div>
              )}
              {group.lastReview && (
                <div>
                  <span style={{ color: '#94A3B8', fontWeight: 500 }}>Last Review: </span>
                  <span style={{ color: '#1E293B', fontWeight: 600 }}>{group.lastReview}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
