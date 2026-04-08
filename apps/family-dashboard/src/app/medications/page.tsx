'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { medications, medicationAdherence, medicationChanges } from '../../data/mock';

const missedDoses = medications.filter((m) => m.adherence < 90);

export default function MedicationsPage() {
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2937', margin: '0 0 8px 0' }}>Medications</h1>
      <p style={{ fontSize: 16, color: '#6B7280', marginTop: 0, marginBottom: 32 }}>
        Margaret&apos;s current medications and adherence
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>

        {/* Current Medications */}
        <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 20px 0' }}>
            Current Medications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {medications.map((med) => (
              <div
                key={med.id}
                style={{
                  padding: '14px 18px',
                  borderRadius: 10,
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937' }}>{med.name}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{med.dosage} - {med.schedule}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: med.adherence >= 95 ? '#059669' : med.adherence >= 85 ? '#D97706' : '#DC2626',
                    }}
                  >
                    {med.adherence}%
                  </div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>adherence</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Adherence Chart */}
        <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 20px 0' }}>
            Adherence This Week
          </h2>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={medicationAdherence}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="day" tick={{ fontSize: 13, fill: '#6B7280' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
                <Bar dataKey="adherence" fill="#10B981" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Missed Doses */}
        <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 20px 0' }}>
            Adherence Alerts
          </h2>
          {missedDoses.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: '#059669', fontSize: 15 }}>
              All medications above 90% adherence this week!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {missedDoses.map((med) => (
                <div
                  key={med.id}
                  style={{
                    padding: '14px 18px',
                    borderRadius: 10,
                    background: '#FFFBEB',
                    border: '1px solid #FCD34D',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{'\u26A0'}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#92400E' }}>{med.name}</div>
                    <div style={{ fontSize: 13, color: '#B45309' }}>
                      Adherence at {med.adherence}% - some doses may have been missed
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medication Changes Log */}
        <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 20px 0' }}>
            Recent Changes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {medicationChanges.map((change) => (
              <div
                key={change.id}
                style={{
                  paddingLeft: 16,
                  borderLeft: '3px solid #7C3AED',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{change.medication}</div>
                <div style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>{change.change}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
                  {new Date(change.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - {change.prescribedBy}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
