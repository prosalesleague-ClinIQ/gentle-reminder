'use client';

import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import StatCard from '../components/StatCard';
import { patient, cognitiveScores, sessions, medications, messages, threads, nextAppointment } from '../data/mock';

const recentScores = cognitiveScores.slice(-7);
const lastSession = sessions[0];
const recentMessages = messages.filter((m) => m.senderRole !== 'family').slice(0, 3);

export default function DashboardPage() {
  return (
    <div>
      {/* Welcome header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2937', margin: 0 }}>
          Welcome back, Jennifer
        </h1>
        <p style={{ fontSize: 16, color: '#6B7280', marginTop: 4 }}>
          Here is how {patient.name} is doing today
        </p>
      </div>

      {/* Stat cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard title="Overall Score" value={`${cognitiveScores[cognitiveScores.length - 1].overall}%`} subtitle="Stable this week" color="purple" icon="\u2605" />
        <StatCard title="Sessions This Week" value={5} subtitle="of 7 scheduled" color="green" icon="\u25B6" />
        <StatCard title="Medication Adherence" value="92%" subtitle="Last 7 days" color="blue" icon="\u2695" />
        <StatCard title="Unread Messages" value={threads.reduce((sum, t) => sum + t.unreadCount, 0)} subtitle="From care team" color="amber" icon="\u2709" />
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Last Session Card */}
        <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 20px 0' }}>
            Last Session
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, color: '#6B7280' }}>Date</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1F2937' }}>{lastSession.date}</div>
            </div>
            <div>
              <div style={{ fontSize: 14, color: '#6B7280' }}>Score</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#7C3AED' }}>{lastSession.score}%</div>
            </div>
            <div>
              <div style={{ fontSize: 14, color: '#6B7280' }}>Duration</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1F2937' }}>{lastSession.duration}</div>
            </div>
          </div>
          <div style={{ fontSize: 14, color: '#6B7280' }}>
            {lastSession.type} - {lastSession.exercisesCompleted}/{lastSession.exercisesTotal} exercises completed
          </div>
        </div>

        {/* Cognitive Trend Card */}
        <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 20px 0' }}>
            Cognitive Trend (7 Days)
          </h2>
          <div style={{ width: '100%', height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recentScores}>
                <Line
                  type="monotone"
                  dataKey="overall"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  dot={{ fill: '#7C3AED', r: 3 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                  labelFormatter={(_, payload) => {
                    if (payload && payload.length > 0) {
                      return payload[0]?.payload?.date || '';
                    }
                    return '';
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Medications Card */}
        <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 20px 0' }}>
            Today&apos;s Medications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {medications.map((med) => (
              <div
                key={med.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: med.status === 'taken' ? '#ECFDF5' : '#FFFBEB',
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: '#1F2937' }}>{med.name}</div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>{med.dosage} - {med.schedule}</div>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: 12,
                    background: med.status === 'taken' ? '#10B981' : '#F59E0B',
                    color: '#FFF',
                  }}
                >
                  {med.status === 'taken' ? 'Taken' : `Pending${med.nextDose ? ` (${med.nextDose})` : ''}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages Card */}
        <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 20px 0' }}>
            Recent Messages
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {recentMessages.map((msg) => (
              <div key={msg.id} style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{msg.sender}</span>
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>
                    {new Date(msg.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                  {msg.content.length > 100 ? msg.content.slice(0, 100) + '...' : msg.content}
                </p>
                {!msg.read && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#7C3AED', marginTop: 4, display: 'inline-block' }}>
                    New
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Next Appointment Card */}
        <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', color: '#FFF', gridColumn: '1 / -1' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px 0', opacity: 0.9 }}>
            Next Appointment
          </h2>
          <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{nextAppointment.title}</div>
              <div style={{ fontSize: 16, marginTop: 4, opacity: 0.85 }}>
                {new Date(nextAppointment.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {nextAppointment.time}
              </div>
            </div>
            <div style={{ opacity: 0.85 }}>
              <div style={{ fontSize: 14 }}>{nextAppointment.location}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
