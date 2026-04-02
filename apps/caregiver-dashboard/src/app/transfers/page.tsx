'use client';

import React, { useState } from 'react';

interface TransferRecord {
  patient: string;
  destination: string;
  date: string;
  status: string;
}

const TRANSFER_HISTORY: TransferRecord[] = [
  { patient: 'Margaret Chen', destination: 'Oakwood Assisted Living', date: 'March 20, 2026', status: 'Completed' },
  { patient: 'Frank Rodriguez', destination: 'Home with family care', date: 'March 10, 2026', status: 'Completed' },
  { patient: 'Betty Thompson', destination: 'Riverside Memory Unit', date: 'February 28, 2026', status: 'Completed' },
];

export default function TransfersPage() {
  const [dischargeChecklist, setDischargeChecklist] = useState({
    cognitive: true,
    medication: true,
    familyTraining: false,
    homeSafety: false,
  });

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1000 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F2B3F', marginBottom: 8 }}>
        Patient Transfers
      </h1>
      <p style={{ color: '#64748B', fontSize: 15, marginBottom: 32 }}>
        Manage patient transfers, discharges, and care transitions
      </p>

      {/* Active Transfers */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#0F2B3F', marginBottom: 16 }}>
          Active Transfers
        </h2>
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 12,
            border: '1px solid #E2E8F0',
            padding: 24,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#0F2B3F', margin: 0 }}>
                Harold Jenkins
              </h3>
              <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>
                Patient ID: GR-1042
              </p>
            </div>
            <span
              style={{
                background: '#FFF3E0',
                color: '#E65100',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Pending Documentation
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' as const }}>
                Transferring To
              </span>
              <p style={{ fontSize: 15, color: '#1E293B', margin: '4px 0 0' }}>Sunrise Memory Care</p>
            </div>
            <div>
              <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' as const }}>
                Transfer Date
              </span>
              <p style={{ fontSize: 15, color: '#1E293B', margin: '4px 0 0' }}>April 5, 2026</p>
            </div>
          </div>
          <div
            style={{
              background: '#F8FAFC',
              borderRadius: 8,
              padding: 16,
              fontSize: 14,
              color: '#475569',
            }}
          >
            <strong>Transfer includes:</strong> medical records, cognitive history, care plan, medication list
          </div>
        </div>
      </section>

      {/* Discharge Planning */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#0F2B3F', marginBottom: 16 }}>
          Discharge Planning
        </h2>
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 12,
            border: '1px solid #E2E8F0',
            padding: 24,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#0F2B3F', margin: 0 }}>
                Dorothy Williams
              </h3>
              <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>
                Patient ID: GR-1038
              </p>
            </div>
            <span
              style={{
                background: '#E3F2FD',
                color: '#1565C0',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              In Progress
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' as const }}>
                Discharge To
              </span>
              <p style={{ fontSize: 15, color: '#1E293B', margin: '4px 0 0' }}>Home with family care</p>
            </div>
            <div>
              <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' as const }}>
                Target Date
              </span>
              <p style={{ fontSize: 15, color: '#1E293B', margin: '4px 0 0' }}>April 15, 2026</p>
            </div>
          </div>

          <h4 style={{ fontSize: 14, fontWeight: 600, color: '#475569', marginBottom: 12 }}>
            Discharge Checklist
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { key: 'cognitive' as const, label: 'Final cognitive assessment' },
              { key: 'medication' as const, label: 'Medication reconciliation' },
              { key: 'familyTraining' as const, label: 'Family training' },
              { key: 'homeSafety' as const, label: 'Home safety assessment' },
            ].map((item) => (
              <label
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 15,
                  color: '#1E293B',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={dischargeChecklist[item.key]}
                  onChange={() =>
                    setDischargeChecklist((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key],
                    }))
                  }
                  style={{ width: 18, height: 18, accentColor: '#1A7BC4' }}
                />
                <span
                  style={{
                    textDecoration: dischargeChecklist[item.key] ? 'line-through' : 'none',
                    color: dischargeChecklist[item.key] ? '#94A3B8' : '#1E293B',
                  }}
                >
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Transfer History */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#0F2B3F', marginBottom: 16 }}>
          Transfer History
        </h2>
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 12,
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                {['Patient', 'Destination', 'Date', 'Status'].map((header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: 'left',
                      padding: '14px 20px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#94A3B8',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRANSFER_HISTORY.map((record, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: idx < TRANSFER_HISTORY.length - 1 ? '1px solid #F1F5F9' : 'none',
                  }}
                >
                  <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 500, color: '#1E293B' }}>
                    {record.patient}
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 14, color: '#475569' }}>
                    {record.destination}
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 14, color: '#475569' }}>
                    {record.date}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span
                      style={{
                        background: '#E8F5E9',
                        color: '#2E7D32',
                        padding: '3px 10px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Initiate Transfer Button */}
      <button
        style={{
          background: '#1A7BC4',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: 10,
          padding: '14px 28px',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          width: '100%',
        }}
        onClick={() => alert('Transfer initiation form would open here')}
      >
        Initiate Transfer
      </button>
    </div>
  );
}
