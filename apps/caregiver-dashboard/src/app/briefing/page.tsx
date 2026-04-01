'use client';

import React from 'react';

const priorityItems = [
  'Harold missed evening medication yesterday',
  "Frank's fall risk is HIGH - extra monitoring needed",
];

const sessionSummary = {
  overview: 'Yesterday: 6 sessions completed across 4 patients (avg score: 76%)',
  patients: [
    { name: 'Margaret', score: '82%', note: 'up from 78%' },
    { name: 'Dorothy', score: '88%', note: 'personal best!' },
  ],
};

const medicationStatus = {
  overview: 'Overall adherence: 87%',
  alerts: [
    'Harold: 2 missed doses this week',
    'All other patients: 95%+ adherence',
  ],
};

const schedule = [
  { time: '9:00 AM', event: 'Margaret morning session' },
  { time: '10:00 AM', event: 'Harold medication review' },
  { time: '2:00 PM', event: 'Dorothy cognitive assessment' },
  { time: '3:00 PM', event: 'Lisa Thompson visiting Margaret' },
];

const cognitiveTrends = [
  { name: 'Margaret', trend: 'stable' },
  { name: 'Dorothy', trend: 'improving' },
  { name: 'Harold', trend: 'declining' },
  { name: 'Frank', trend: 'stable' },
];

function getTrendColor(trend: string): string {
  switch (trend) {
    case 'improving': return '#16A34A';
    case 'declining': return '#DC2626';
    case 'stable': return '#2563EB';
    default: return '#64748B';
  }
}

export default function BriefingPage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 900 }}>
      {/* Header */}
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F2B3F', marginBottom: 4 }}>
        Daily Briefing
      </h1>
      <p style={{ fontSize: 15, color: '#64748B', marginBottom: 8 }}>
        March 31, 2026
      </p>
      <p style={{ fontSize: 17, color: '#334155', marginBottom: 32 }}>
        Good morning, Sarah. Here&apos;s your patient overview for today.
      </p>

      {/* Priority Items */}
      <section
        style={{
          border: '2px solid #DC2626',
          borderRadius: 12,
          padding: '20px 24px',
          marginBottom: 24,
          backgroundColor: '#FEF2F2',
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#DC2626', marginBottom: 12, marginTop: 0 }}>
          Priority Items
        </h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {priorityItems.map((item, i) => (
            <li key={i} style={{ fontSize: 15, color: '#1E293B', marginBottom: 8, lineHeight: 1.5 }}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Session Summary */}
      <section
        style={{
          border: '2px solid #2563EB',
          borderRadius: 12,
          padding: '20px 24px',
          marginBottom: 24,
          backgroundColor: '#EFF6FF',
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#2563EB', marginBottom: 12, marginTop: 0 }}>
          Session Summary
        </h2>
        <p style={{ fontSize: 15, color: '#1E293B', marginBottom: 8 }}>
          {sessionSummary.overview}
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {sessionSummary.patients.map((p) => (
            <li key={p.name} style={{ fontSize: 15, color: '#1E293B', marginBottom: 6, lineHeight: 1.5 }}>
              <strong>{p.name}:</strong> {p.score} ({p.note})
            </li>
          ))}
        </ul>
      </section>

      {/* Medication Status */}
      <section
        style={{
          border: '2px solid #16A34A',
          borderRadius: 12,
          padding: '20px 24px',
          marginBottom: 24,
          backgroundColor: '#F0FDF4',
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#16A34A', marginBottom: 12, marginTop: 0 }}>
          Medication Status
        </h2>
        <p style={{ fontSize: 15, color: '#1E293B', marginBottom: 8 }}>
          {medicationStatus.overview}
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {medicationStatus.alerts.map((alert, i) => (
            <li key={i} style={{ fontSize: 15, color: '#1E293B', marginBottom: 6, lineHeight: 1.5 }}>
              {alert}
            </li>
          ))}
        </ul>
      </section>

      {/* Today's Schedule */}
      <section
        style={{
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: '20px 24px',
          marginBottom: 24,
          backgroundColor: '#FFFFFF',
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F2B3F', marginBottom: 12, marginTop: 0 }}>
          Today&apos;s Schedule
        </h2>
        {schedule.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '10px 0',
              borderBottom: i < schedule.length - 1 ? '1px solid #F1F5F9' : 'none',
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#2563EB',
                minWidth: 90,
                fontFamily: 'monospace',
              }}
            >
              {item.time}
            </span>
            <span style={{ fontSize: 15, color: '#1E293B' }}>{item.event}</span>
          </div>
        ))}
      </section>

      {/* Cognitive Trends */}
      <section
        style={{
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: '20px 24px',
          marginBottom: 24,
          backgroundColor: '#FFFFFF',
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F2B3F', marginBottom: 12, marginTop: 0 }}>
          Cognitive Trends
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {cognitiveTrends.map((patient) => (
            <div
              key={patient.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 8,
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
              }}
            >
              <strong style={{ fontSize: 14, color: '#1E293B' }}>{patient.name}:</strong>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: getTrendColor(patient.trend),
                }}
              >
                {patient.trend}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
