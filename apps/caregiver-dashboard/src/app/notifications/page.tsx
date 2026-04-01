'use client';

import { useState } from 'react';

interface NotificationPreference {
  id: string;
  category: string;
  description: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  enabled: boolean;
}

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  type: 'update' | 'alert' | 'message' | 'report';
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  read: boolean;
}

const initialPreferences: NotificationPreference[] = [
  { id: 'cognitive-decline', category: 'Cognitive decline alerts', description: 'Get notified when a patient shows signs of cognitive decline over time', priority: 'high', enabled: true },
  { id: 'missed-medications', category: 'Missed medications', description: 'Alerts when patients miss scheduled medication doses', priority: 'high', enabled: true },
  { id: 'session-completions', category: 'Session completions', description: 'Updates when patients complete cognitive exercises', priority: 'normal', enabled: true },
  { id: 'fall-risk', category: 'Fall risk alerts', description: 'Urgent notifications for elevated fall risk assessments', priority: 'urgent', enabled: true },
  { id: 'family-messages', category: 'Family messages', description: 'Messages from family members about their loved ones', priority: 'normal', enabled: true },
  { id: 'weekly-reports', category: 'Weekly reports', description: 'Automated weekly summary reports for each patient', priority: 'low', enabled: true },
];

const demoNotifications: Notification[] = [
  { id: '1', message: 'Margaret completed morning session (82%)', timestamp: '12 min ago', type: 'update', read: false },
  { id: '2', message: 'Harold missed Memantine 12pm dose', timestamp: '1 hour ago', type: 'alert', priority: 'high', read: false },
  { id: '3', message: 'Lisa Thompson sent a message', timestamp: '2 hours ago', type: 'message', read: false },
  { id: '4', message: 'Frank Anderson fall risk: HIGH', timestamp: '3 hours ago', type: 'alert', priority: 'urgent', read: false },
  { id: '5', message: 'Dorothy reached 12-day streak!', timestamp: '5 hours ago', type: 'update', read: true },
  { id: '6', message: 'Weekly report ready for Margaret', timestamp: '8 hours ago', type: 'report', read: true },
  { id: '7', message: "Harold's cognitive score declined 8%", timestamp: 'yesterday', type: 'alert', priority: 'high', read: true },
  { id: '8', message: "Margaret's family uploaded new photos", timestamp: 'yesterday', type: 'update', read: true },
];

const priorityColors: Record<string, { bg: string; text: string }> = {
  urgent: { bg: '#FEE2E2', text: '#DC2626' },
  high: { bg: '#FFF7ED', text: '#EA580C' },
  normal: { bg: '#EFF6FF', text: '#2563EB' },
  low: { bg: '#F0FDF4', text: '#16A34A' },
};

const typeIcons: Record<string, string> = {
  update: '\u2713',
  alert: '\u26A0',
  message: '\u2709',
  report: '\u2261',
};

const typeColors: Record<string, { bg: string; text: string }> = {
  update: { bg: '#EFF6FF', text: '#2563EB' },
  alert: { bg: '#FEE2E2', text: '#DC2626' },
  message: { bg: '#F0FDF4', text: '#16A34A' },
  report: { bg: '#F5F3FF', text: '#7C3AED' },
};

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [notifications, setNotifications] = useState(demoNotifications);

  const togglePreference = (id: string) => {
    setPreferences((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
        Notifications
      </h1>
      <p style={{ color: '#64748B', fontSize: 15, marginBottom: 32 }}>
        Manage your notification preferences and view recent alerts.
      </p>

      {/* Preferences Section */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1E293B', marginBottom: 16 }}>
          Preferences
        </h2>
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 12,
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
          }}
        >
          {preferences.map((pref, index) => (
            <div
              key={pref.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: index < preferences.length - 1 ? '1px solid #F1F5F9' : 'none',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>
                    {pref.category}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 9999,
                      background: priorityColors[pref.priority].bg,
                      color: priorityColors[pref.priority].text,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {pref.priority}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>{pref.description}</p>
              </div>
              <button
                onClick={() => togglePreference(pref.id)}
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 14,
                  border: 'none',
                  cursor: 'pointer',
                  background: pref.enabled ? '#1A7BC4' : '#CBD5E1',
                  position: 'relative',
                  transition: 'background 0.2s',
                  flexShrink: 0,
                  marginLeft: 16,
                }}
                aria-label={`Toggle ${pref.category}`}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 3,
                    left: pref.enabled ? 23 : 3,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Notifications Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1E293B', margin: 0 }}>
            Recent Notifications
          </h2>
          <span style={{ fontSize: 13, color: '#64748B' }}>
            {notifications.filter((n) => !n.read).length} unread
          </span>
        </div>
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 12,
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
          }}
        >
          {notifications.map((notif, index) => {
            const tColors = typeColors[notif.type];
            return (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 24px',
                  borderBottom: index < notifications.length - 1 ? '1px solid #F1F5F9' : 'none',
                  background: notif.read ? '#FFFFFF' : '#F8FAFC',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                {/* Unread dot */}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: notif.read ? 'transparent' : '#1A7BC4',
                    flexShrink: 0,
                  }}
                />
                {/* Icon */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: tColors.bg,
                    color: tColors.text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {typeIcons[notif.type]}
                </div>
                {/* Content */}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: notif.read ? 400 : 600,
                      color: '#1E293B',
                    }}
                  >
                    {notif.message}
                  </p>
                  <span style={{ fontSize: 12, color: '#94A3B8' }}>{notif.timestamp}</span>
                </div>
                {/* Type badge */}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    background: tColors.bg,
                    color: tColors.text,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    flexShrink: 0,
                  }}
                >
                  {notif.type}
                </span>
                {/* Priority badge for alerts */}
                {notif.priority && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 9999,
                      background: priorityColors[notif.priority].bg,
                      color: priorityColors[notif.priority].text,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      flexShrink: 0,
                    }}
                  >
                    {notif.priority}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
