const PATIENTS = [
  {
    name: 'Margaret Thompson',
    cognitive: 'Stable',
    cognitiveColor: '#10B981',
    medication: 'All taken',
    medicationColor: '#10B981',
    mood: 'Calm',
    lastScore: 72,
    notes: 'Confused about date this morning, oriented after breakfast',
  },
  {
    name: 'Harold Jenkins',
    cognitive: 'Declining',
    cognitiveColor: '#EF4444',
    medication: '1 missed',
    medicationColor: '#F59E0B',
    mood: 'Agitated',
    lastScore: 54,
    notes: 'Refused 12pm medication, increased restlessness after lunch',
  },
  {
    name: 'Dorothy Williams',
    cognitive: 'Improved',
    cognitiveColor: '#3B82F6',
    medication: 'All taken',
    medicationColor: '#10B981',
    mood: 'Happy',
    lastScore: 88,
    notes: 'Excellent session today, highest score this week',
  },
  {
    name: 'Frank Anderson',
    cognitive: 'Stable',
    cognitiveColor: '#10B981',
    medication: 'All taken',
    medicationColor: '#10B981',
    mood: 'Withdrawn',
    lastScore: 61,
    notes: 'Quiet today, ate well at lunch',
  },
];

const KEY_OBSERVATIONS = [
  'Margaret was confused about the date this morning but oriented well after breakfast',
  'Harold refused his 12pm medication - documented in log',
  'Dorothy had an excellent session - highest score this week (88%)',
];

const PRIORITY_ALERTS = [
  "Monitor Harold's medication compliance",
  "Margaret's daughter Lisa visiting at 4pm",
];

export default function HandoffPage() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', margin: '0 0 4px' }}>
          Shift Handoff
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
          End of Shift Report
        </p>
      </div>

      {/* Current Shift Info */}
      <div style={{
        background: '#fff', borderRadius: 12, padding: '20px 24px',
        border: '1px solid #E2E8F0', marginBottom: 24, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#1A7BC4' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', background: '#1A7BC4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 600, color: '#FFF',
          }}>
            SM
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>Sarah Mitchell</div>
            <div style={{ fontSize: 13, color: '#64748B' }}>Day Shift (7:00 AM - 3:00 PM)</div>
          </div>
          <div style={{ marginLeft: 'auto', padding: '6px 14px', background: '#ECFDF5', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#059669' }}>
            Active
          </div>
        </div>
      </div>

      {/* Patient Status Summary */}
      <div style={{
        background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', marginBottom: 24, overflow: 'hidden',
      }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #F0F0F0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Patient Status Summary</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Patient', 'Cognitive Status', 'Medication', 'Mood', 'Last Score', 'Notes'].map((h) => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontWeight: 600,
                    color: '#475569', fontSize: 11, textTransform: 'uppercase' as const,
                    letterSpacing: '0.04em', borderBottom: '1px solid #E2E8F0',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PATIENTS.map((p, i) => (
                <tr key={p.name} style={{ borderBottom: i < PATIENTS.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0F172A' }}>{p.name}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: 12,
                      fontSize: 12, fontWeight: 600, color: p.cognitiveColor,
                      background: p.cognitiveColor + '18',
                    }}>
                      {p.cognitive}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: 12,
                      fontSize: 12, fontWeight: 600, color: p.medicationColor,
                      background: p.medicationColor + '18',
                    }}>
                      {p.medication}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#334155' }}>{p.mood}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: p.lastScore >= 80 ? '#10B981' : p.lastScore >= 60 ? '#F59E0B' : '#EF4444' }}>
                    {p.lastScore}%
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748B', maxWidth: 220 }}>{p.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Observations */}
      <div style={{
        background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', marginBottom: 24, overflow: 'hidden',
      }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #F0F0F0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Key Observations</h2>
        </div>
        <div style={{ padding: '16px 24px' }}>
          {KEY_OBSERVATIONS.map((note, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0',
              borderBottom: i < KEY_OBSERVATIONS.length - 1 ? '1px solid #F1F5F9' : 'none',
            }}>
              <span style={{
                flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: '#F0F9FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600, color: '#1A7BC4',
              }}>
                {i + 1}
              </span>
              <span style={{ fontSize: 14, color: '#334155', lineHeight: 1.5 }}>{note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Alerts */}
      <div style={{
        background: '#FFF7ED', borderRadius: 12, border: '1px solid #FED7AA', marginBottom: 24, overflow: 'hidden',
      }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #FDBA74' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: '#9A3412' }}>Priority Alerts for Next Shift</h2>
        </div>
        <div style={{ padding: '16px 24px' }}>
          {PRIORITY_ALERTS.map((alert, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
              borderBottom: i < PRIORITY_ALERTS.length - 1 ? '1px solid #FED7AA' : 'none',
            }}>
              <span style={{ fontSize: 16 }}>{'\u26A0'}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#9A3412', lineHeight: 1.5 }}>{alert}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timestamp */}
      <div style={{ textAlign: 'center', fontSize: 13, color: '#94A3B8', paddingTop: 8 }}>
        Report generated: March 31, 2026 2:45 PM
      </div>
    </div>
  );
}
