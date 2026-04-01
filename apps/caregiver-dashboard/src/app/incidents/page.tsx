'use client';

import { useState } from 'react';

interface Incident {
  id: number;
  patient: string;
  type: string;
  severity: string;
  description: string;
  date: string;
  status: 'Open' | 'Resolved';
}

const incidentTypes = ['Fall', 'Wandering', 'Agitation', 'Confusion', 'Medication Error', 'Other'];
const severityLevels = ['Low', 'Medium', 'High', 'Critical'];
const patients = ['Margaret', 'Harold', 'Dorothy', 'Frank'];

const typeBadgeColors: Record<string, { bg: string; text: string }> = {
  Fall: { bg: '#FEE2E2', text: '#991B1B' },
  Wandering: { bg: '#FEF3C7', text: '#92400E' },
  Agitation: { bg: '#FFE4E6', text: '#9F1239' },
  Confusion: { bg: '#E0E7FF', text: '#3730A3' },
  'Medication Error': { bg: '#FCE7F3', text: '#9D174D' },
  Other: { bg: '#F3F4F6', text: '#374151' },
};

const severityBadgeColors: Record<string, { bg: string; text: string }> = {
  Low: { bg: '#D1FAE5', text: '#065F46' },
  Medium: { bg: '#FEF3C7', text: '#92400E' },
  High: { bg: '#FED7AA', text: '#9A3412' },
  Critical: { bg: '#FEE2E2', text: '#991B1B' },
};

const initialIncidents: Incident[] = [
  {
    id: 1,
    patient: 'Margaret',
    type: 'Confusion',
    severity: 'Medium',
    description: 'Confused about the date after waking from nap',
    date: 'Mar 31, 10:15 AM',
    status: 'Open',
  },
  {
    id: 2,
    patient: 'Harold',
    type: 'Medication Error',
    severity: 'High',
    description: 'Refused morning Memantine dose',
    date: 'Mar 31, 8:00 AM',
    status: 'Open',
  },
  {
    id: 3,
    patient: 'Frank',
    type: 'Fall',
    severity: 'Critical',
    description: 'Fell in bathroom, no injuries',
    date: 'Mar 30, 9:30 PM',
    status: 'Open',
  },
  {
    id: 4,
    patient: 'Dorothy',
    type: 'Wandering',
    severity: 'Low',
    description: 'Found near exit door, redirected easily',
    date: 'Mar 30, 4:15 PM',
    status: 'Resolved',
  },
  {
    id: 5,
    patient: 'Margaret',
    type: 'Agitation',
    severity: 'Medium',
    description: 'Became upset during evening routine',
    date: 'Mar 29, 7:00 PM',
    status: 'Resolved',
  },
];

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [formPatient, setFormPatient] = useState('Margaret');
  const [formType, setFormType] = useState('Fall');
  const [formSeverity, setFormSeverity] = useState('Low');
  const [formDescription, setFormDescription] = useState('');

  const handleSubmit = () => {
    if (!formDescription.trim()) return;
    const newIncident: Incident = {
      id: Date.now(),
      patient: formPatient,
      type: formType,
      severity: formSeverity,
      description: formDescription.trim(),
      date: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      status: 'Open',
    };
    setIncidents([newIncident, ...incidents]);
    setFormDescription('');
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
        Incident Reports
      </h1>
      <p style={{ color: '#64748B', fontSize: 15, marginBottom: 32 }}>
        Log and track patient incidents for clinical review.
      </p>

      {/* New Incident Form */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: 28,
          marginBottom: 32,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', marginBottom: 20 }}>
          New Incident
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#475569', marginBottom: 6 }}>
              Patient
            </label>
            <select
              value={formPatient}
              onChange={(e: any) => setFormPatient(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                fontSize: 14,
                background: '#F8FAFC',
                color: '#0F172A',
              }}
            >
              {patients.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#475569', marginBottom: 6 }}>
              Incident Type
            </label>
            <select
              value={formType}
              onChange={(e: any) => setFormType(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                fontSize: 14,
                background: '#F8FAFC',
                color: '#0F172A',
              }}
            >
              {incidentTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#475569', marginBottom: 6 }}>
              Severity
            </label>
            <select
              value={formSeverity}
              onChange={(e: any) => setFormSeverity(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                fontSize: 14,
                background: '#F8FAFC',
                color: '#0F172A',
              }}
            >
              {severityLevels.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#475569', marginBottom: 6 }}>
            Description
          </label>
          <textarea
            value={formDescription}
            onChange={(e: any) => setFormDescription(e.target.value)}
            placeholder="Describe the incident in detail..."
            rows={3}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #CBD5E1',
              fontSize: 14,
              background: '#F8FAFC',
              color: '#0F172A',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          style={{
            padding: '10px 24px',
            borderRadius: 8,
            border: 'none',
            background: '#1A7BC4',
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Submit Report
        </button>
      </div>

      {/* Recent Incidents Table */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', margin: 0 }}>
            Recent Incidents
          </h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {['Patient', 'Type', 'Severity', 'Description', 'Date/Time', 'Status'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #E2E8F0',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc) => (
              <tr key={inc.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 500, color: '#0F172A' }}>
                  {inc.patient}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: typeBadgeColors[inc.type]?.bg ?? '#F3F4F6',
                      color: typeBadgeColors[inc.type]?.text ?? '#374151',
                    }}
                  >
                    {inc.type}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: severityBadgeColors[inc.severity]?.bg ?? '#F3F4F6',
                      color: severityBadgeColors[inc.severity]?.text ?? '#374151',
                    }}
                  >
                    {inc.severity}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569', maxWidth: 280 }}>
                  {inc.description}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748B', whiteSpace: 'nowrap' }}>
                  {inc.date}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: inc.status === 'Open' ? '#DBEAFE' : '#D1FAE5',
                      color: inc.status === 'Open' ? '#1E40AF' : '#065F46',
                    }}
                  >
                    {inc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
