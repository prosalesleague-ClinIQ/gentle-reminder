'use client';

interface Medication {
  name: string;
  dosage: string;
  adherence: number;
}

interface PatientMeds {
  patient: string;
  medications: Medication[];
}

const patientMedications: PatientMeds[] = [
  {
    patient: 'Margaret Thompson',
    medications: [
      { name: 'Donepezil', dosage: '10mg', adherence: 95 },
      { name: 'Memantine', dosage: '5mg', adherence: 88 },
      { name: 'Vitamin D', dosage: '1000IU', adherence: 92 },
    ],
  },
  {
    patient: 'Harold Jenkins',
    medications: [
      { name: 'Donepezil', dosage: '10mg', adherence: 65 },
      { name: 'Memantine', dosage: '10mg', adherence: 58 },
      { name: 'Aricept', dosage: '5mg', adherence: 70 },
    ],
  },
  {
    patient: 'Dorothy Williams',
    medications: [
      { name: 'Galantamine', dosage: '8mg', adherence: 98 },
      { name: 'Vitamin E', dosage: '400IU', adherence: 95 },
    ],
  },
  {
    patient: 'Frank Morrison',
    medications: [
      { name: 'Rivastigmine', dosage: '6mg', adherence: 45 },
      { name: 'Memantine', dosage: '10mg', adherence: 50 },
      { name: 'Donepezil', dosage: '5mg', adherence: 42 },
    ],
  },
];

const interactions = [
  {
    patient: 'Harold Jenkins',
    warning: 'Donepezil + Anticholinergics risk',
    severity: 'High',
    detail: 'Concurrent anticholinergic use may reduce efficacy of Donepezil. Review concomitant medications.',
  },
  {
    patient: 'Frank Morrison',
    warning: 'Multiple cholinesterase inhibitors',
    severity: 'Critical',
    detail: 'Patient is prescribed both Rivastigmine and Donepezil. Combined use increases risk of adverse effects without additional benefit.',
  },
];

function adherenceColor(pct: number): string {
  if (pct >= 85) return '#059669';
  if (pct >= 65) return '#D97706';
  return '#DC2626';
}

function adherenceBg(pct: number): string {
  if (pct >= 85) return '#D1FAE5';
  if (pct >= 65) return '#FEF3C7';
  return '#FEE2E2';
}

export default function MedicationsPage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
        Medication Review
      </h1>
      <p style={{ color: '#64748B', fontSize: 15, marginBottom: 32 }}>
        Patient medication schedules, adherence tracking, and interaction warnings.
      </p>

      {/* Overall Facility Adherence */}
      <div
        style={{
          background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
          border: '1px solid #BFDBFE',
          borderRadius: 12,
          padding: 24,
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#1E40AF' }}>Overall Facility Adherence</div>
          <div style={{ fontSize: 12, color: '#3B82F6', marginTop: 2 }}>Across all patients and medications</div>
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, color: '#1D4ED8' }}>78%</div>
      </div>

      {/* Patient Medication Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 36 }}>
        {patientMedications.map((pm) => (
          <div
            key={pm.patient}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', margin: 0 }}>
                {pm.patient}
              </h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Medication', 'Dosage', 'Adherence'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 16px',
                        textAlign: 'left',
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#64748B',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderBottom: '1px solid #F1F5F9',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pm.medications.map((med) => (
                  <tr key={med.name} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 500, color: '#0F172A' }}>
                      {med.name}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>
                      {med.dosage}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 60,
                            height: 6,
                            borderRadius: 3,
                            background: '#F1F5F9',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${med.adherence}%`,
                              height: '100%',
                              borderRadius: 3,
                              background: adherenceColor(med.adherence),
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: adherenceColor(med.adherence),
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: adherenceBg(med.adherence),
                          }}
                        >
                          {med.adherence}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Interaction Warnings */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 20 }}>{'\u26A0'}</span>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', margin: 0 }}>
            Interaction Warnings
          </h2>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {interactions.map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: 20,
                borderRadius: 10,
                background: item.severity === 'Critical' ? '#FEF2F2' : '#FFFBEB',
                border: `1px solid ${item.severity === 'Critical' ? '#FECACA' : '#FDE68A'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background: item.severity === 'Critical' ? '#FEE2E2' : '#FEF3C7',
                    color: item.severity === 'Critical' ? '#991B1B' : '#92400E',
                  }}
                >
                  {item.severity}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{item.patient}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1E293B', marginBottom: 6 }}>
                {item.warning}
              </div>
              <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
