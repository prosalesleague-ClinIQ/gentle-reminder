import { patients } from '../../data/mock';

const stageColors: Record<string, { bg: string; color: string }> = {
  Mild: { bg: '#D1FAE5', color: '#065F46' },
  Moderate: { bg: '#FEF3C7', color: '#92400E' },
  Severe: { bg: '#FEE2E2', color: '#991B1B' },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  Active: { bg: '#D1FAE5', color: '#065F46' },
  Inactive: { bg: '#F1F5F9', color: '#475569' },
  'Under Review': { bg: '#FEF3C7', color: '#92400E' },
};

function getCognitiveColor(score: number): string {
  if (score >= 75) return '#10B981';
  if (score >= 50) return '#F59E0B';
  return '#EF4444';
}

export default function PatientsPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>
            Patient Registry
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
            Clinical patient management and assessment tracking
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            style={{
              padding: '10px 16px',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              background: '#FFFFFF',
              fontSize: 13,
              fontWeight: 500,
              color: '#475569',
              cursor: 'pointer',
            }}
          >
            Export Registry
          </button>
          <button
            style={{
              padding: '10px 20px',
              background: '#3B82F6',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Add Patient
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          marginBottom: 20,
          padding: '14px 20px',
          background: '#FFFFFF',
          borderRadius: 10,
          border: '1px solid #E2E8F0',
        }}
      >
        <div style={{ fontSize: 13, color: '#64748B' }}>
          <span style={{ fontWeight: 600, color: '#0F172A' }}>{patients.length}</span> patients shown
        </div>
        <div style={{ width: 1, background: '#E2E8F0' }} />
        <div style={{ fontSize: 13, color: '#64748B' }}>
          <span style={{ fontWeight: 600, color: '#10B981' }}>
            {patients.filter((p) => p.status === 'Active').length}
          </span>{' '}
          active
        </div>
        <div style={{ width: 1, background: '#E2E8F0' }} />
        <div style={{ fontSize: 13, color: '#64748B' }}>
          <span style={{ fontWeight: 600, color: '#F59E0B' }}>
            {patients.filter((p) => p.status === 'Under Review').length}
          </span>{' '}
          under review
        </div>
      </div>

      {/* Patient Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 10,
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              {[
                'Patient',
                'Age / Sex',
                'Diagnosis Stage',
                'MMSE Est.',
                'Cognitive Score',
                'Last Assessment',
                'Medication Notes',
                'Status',
              ].map((col) => (
                <th
                  key={col}
                  style={{
                    padding: '12px 14px',
                    textAlign: 'left',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#64748B',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, idx) => {
              const stage = stageColors[patient.diagnosisStage] || stageColors.Mild;
              const status = statusColors[patient.status] || statusColors.Active;
              const cogColor = getCognitiveColor(patient.cognitiveScore);
              return (
                <tr
                  key={patient.id}
                  style={{
                    borderBottom: idx < patients.length - 1 ? '1px solid #F1F5F9' : 'none',
                  }}
                >
                  {/* Patient Name */}
                  <td style={{ padding: '14px', minWidth: 160 }}>
                    <div style={{ fontWeight: 500, color: '#0F172A' }}>{patient.name}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                      {patient.id} &middot; {patient.primaryCaregiver}
                    </div>
                  </td>

                  {/* Age / Sex */}
                  <td style={{ padding: '14px', color: '#475569', whiteSpace: 'nowrap' }}>
                    {patient.age} / {patient.sex}
                  </td>

                  {/* Diagnosis Stage */}
                  <td style={{ padding: '14px' }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: '3px 10px',
                        borderRadius: 4,
                        background: stage.bg,
                        color: stage.color,
                      }}
                    >
                      {patient.diagnosisStage}
                    </span>
                  </td>

                  {/* MMSE Estimate */}
                  <td style={{ padding: '14px' }}>
                    <span
                      style={{
                        fontWeight: 600,
                        color: '#334155',
                        fontFamily: 'monospace',
                        fontSize: 14,
                      }}
                    >
                      {patient.mmseEstimate}
                    </span>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>/30</span>
                  </td>

                  {/* Cognitive Score */}
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 60,
                          height: 6,
                          background: '#F1F5F9',
                          borderRadius: 3,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${patient.cognitiveScore}%`,
                            height: '100%',
                            background: cogColor,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: cogColor }}>
                        {patient.cognitiveScore}%
                      </span>
                    </div>
                  </td>

                  {/* Last Assessment */}
                  <td style={{ padding: '14px', color: '#475569', whiteSpace: 'nowrap' }}>
                    {patient.lastAssessment}
                  </td>

                  {/* Medication Notes */}
                  <td style={{ padding: '14px', color: '#475569', maxWidth: 220, fontSize: 12, lineHeight: 1.4 }}>
                    {patient.medicationNotes}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px' }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: '3px 10px',
                        borderRadius: 12,
                        background: status.bg,
                        color: status.color,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {patient.status}
                    </span>
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
