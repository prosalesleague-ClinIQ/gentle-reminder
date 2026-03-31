export default function SettingsPage() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>
          Settings
        </h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
          Clinical portal configuration and preferences
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Notification Preferences */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 10,
            padding: 24,
            border: '1px solid #E2E8F0',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', margin: '0 0 20px' }}>
            Notification Preferences
          </h2>
          {[
            { label: 'Decline alerts', desc: 'Notify when significant cognitive decline detected', enabled: true },
            { label: 'Report ready', desc: 'Notify when automated reports are generated', enabled: true },
            { label: 'Medication reminders', desc: 'Alerts for upcoming medication reviews', enabled: false },
            { label: 'Study milestones', desc: 'Research cohort enrollment and completion events', enabled: true },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: '1px solid #F1F5F9',
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{item.desc}</div>
              </div>
              <div
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 11,
                  background: item.enabled ? '#3B82F6' : '#CBD5E1',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    position: 'absolute',
                    top: 2,
                    left: item.enabled ? 20 : 2,
                    transition: 'left 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Thresholds */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 10,
            padding: 24,
            border: '1px solid #E2E8F0',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', margin: '0 0 20px' }}>
            Clinical Thresholds
          </h2>
          {[
            { label: 'Decline Alert Threshold', value: '5% drop over 7 days' },
            { label: 'Report Generation Frequency', value: 'Weekly (automated)' },
            { label: 'MMSE Correlation Sensitivity', value: 'High' },
            { label: 'Data Retention Period', value: '24 months' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: '1px solid #F1F5F9',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>{item.label}</div>
              <div
                style={{
                  fontSize: 13,
                  color: '#475569',
                  padding: '4px 12px',
                  background: '#F8FAFC',
                  borderRadius: 6,
                  border: '1px solid #E2E8F0',
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
