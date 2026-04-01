'use client';

import { useState } from 'react';

const patients = [
  { id: 'margaret', name: 'Margaret Thompson' },
  { id: 'harold', name: 'Harold Jenkins' },
  { id: 'dorothy', name: 'Dorothy Williams' },
  { id: 'frank', name: 'Frank Morrison' },
];

interface TimelineEvent {
  date: string;
  events: {
    icon: string;
    description: string;
    score?: string;
    type: 'session' | 'mood' | 'clinical' | 'social' | 'alert' | 'medication' | 'therapy';
  }[];
}

const margaretTimeline: TimelineEvent[] = [
  {
    date: 'Mar 31',
    events: [
      { icon: '\u2713', description: 'Session completed (82%)', score: '82%', type: 'session' },
      { icon: '\u263A', description: 'Mood: Happy', type: 'mood' },
    ],
  },
  {
    date: 'Mar 30',
    events: [
      { icon: '\u26A0', description: 'Confusion episode noted', type: 'alert' },
      { icon: '\u2713', description: 'Session completed (75%)', score: '75%', type: 'session' },
    ],
  },
  {
    date: 'Mar 29',
    events: [
      { icon: '\u2665', description: 'Lisa visited', type: 'social' },
      { icon: '\u2713', description: 'Session completed (78%)', score: '78%', type: 'session' },
      { icon: '\u26A0', description: 'Agitation in evening', type: 'alert' },
    ],
  },
  {
    date: 'Mar 28',
    events: [
      { icon: '\u2605', description: 'Excellent session (88%)', score: '88%', type: 'session' },
      { icon: '\u270E', description: 'New story recorded', type: 'therapy' },
    ],
  },
  {
    date: 'Mar 27',
    events: [
      { icon: '\u2717', description: 'Missed morning session', type: 'alert' },
      { icon: '\u2795', description: 'Medication all taken', type: 'medication' },
    ],
  },
  {
    date: 'Mar 25',
    events: [
      { icon: '\u2316', description: 'Dr. Chen appointment', type: 'clinical' },
      { icon: '\u{1F4CB}', description: 'Care plan reviewed', type: 'clinical' },
    ],
  },
  {
    date: 'Mar 20',
    events: [
      { icon: '\u266B', description: 'Started new music therapy', type: 'therapy' },
      { icon: '\u2191', description: 'Memory score improved', type: 'session' },
    ],
  },
];

const typeColors: Record<string, { bg: string; border: string; text: string }> = {
  session: { bg: '#EFF6FF', border: '#3B82F6', text: '#1D4ED8' },
  mood: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
  clinical: { bg: '#F0FDF4', border: '#22C55E', text: '#166534' },
  social: { bg: '#FCE7F3', border: '#EC4899', text: '#9D174D' },
  alert: { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B' },
  medication: { bg: '#F0F9FF', border: '#0EA5E9', text: '#0369A1' },
  therapy: { bg: '#F5F3FF', border: '#8B5CF6', text: '#5B21B6' },
};

export default function TimelinePage() {
  const [selectedPatient, setSelectedPatient] = useState('margaret');

  return (
    <div style={{ padding: '32px 40px', maxWidth: 900 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
        Patient Timeline
      </h1>
      <p style={{ color: '#64748B', fontSize: 15, marginBottom: 24 }}>
        Chronological view of patient cognitive events, sessions, and milestones.
      </p>

      {/* Patient Selector */}
      <div style={{ marginBottom: 32 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#475569', marginBottom: 6 }}>
          Select Patient
        </label>
        <select
          value={selectedPatient}
          onChange={(e: any) => setSelectedPatient(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #CBD5E1',
            fontSize: 14,
            background: '#FFFFFF',
            color: '#0F172A',
            minWidth: 280,
          }}
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute',
            left: 79,
            top: 0,
            bottom: 0,
            width: 2,
            background: '#E2E8F0',
          }}
        />

        {margaretTimeline.map((day, dayIdx) => (
          <div key={day.date} style={{ marginBottom: 32, position: 'relative' }}>
            {/* Date label */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 24,
              }}
            >
              <div
                style={{
                  width: 64,
                  textAlign: 'right',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#0F172A',
                  paddingTop: 12,
                  flexShrink: 0,
                }}
              >
                {day.date}
              </div>

              {/* Dot on line */}
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#3B82F6',
                  border: '3px solid #DBEAFE',
                  marginTop: 14,
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: 1,
                }}
              />

              {/* Events for this day */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {day.events.map((evt, evtIdx) => {
                  const colors = typeColors[evt.type];
                  return (
                    <div
                      key={evtIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        background: colors.bg,
                        borderLeft: `3px solid ${colors.border}`,
                        borderRadius: 8,
                        padding: '12px 16px',
                      }}
                    >
                      <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{evt.icon}</span>
                      <span style={{ fontSize: 14, color: colors.text, fontWeight: 500, flex: 1 }}>
                        {evt.description}
                      </span>
                      {evt.score && (
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: colors.border,
                            background: '#FFFFFF',
                            padding: '2px 10px',
                            borderRadius: 6,
                          }}
                        >
                          {evt.score}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
