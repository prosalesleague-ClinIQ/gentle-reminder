'use client';

import { useState } from 'react';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
}

const defaultNotifications: NotificationSetting[] = [
  { id: 'session', label: 'Session Completed', description: 'When Margaret finishes a cognitive session', email: true, push: true },
  { id: 'score', label: 'Score Changes', description: 'Significant changes in cognitive scores', email: true, push: true },
  { id: 'medication', label: 'Medication Alerts', description: 'Missed doses or medication changes', email: true, push: false },
  { id: 'messages', label: 'New Messages', description: 'Messages from caregivers and clinicians', email: false, push: true },
  { id: 'weekly', label: 'Weekly Summary', description: 'Weekly progress report every Monday', email: true, push: false },
  { id: 'appointments', label: 'Appointment Reminders', description: 'Upcoming appointment notifications', email: true, push: true },
];

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'pt', label: 'Portuguese' },
];

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [language, setLanguage] = useState('en');
  const [shareData, setShareData] = useState(true);
  const [showScores, setShowScores] = useState(true);

  const toggleNotification = (id: string, channel: 'email' | 'push') => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [channel]: !n[channel] } : n))
    );
  };

  const toggleStyle = (active: boolean): React.CSSProperties => ({
    width: 44,
    height: 24,
    borderRadius: 12,
    background: active ? '#7C3AED' : '#D1D5DB',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background 0.2s',
    border: 'none',
    padding: 0,
  });

  const toggleDotStyle = (active: boolean): React.CSSProperties => ({
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: '#FFF',
    position: 'absolute',
    top: 3,
    left: active ? 23 : 3,
    transition: 'left 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  });

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2937', margin: '0 0 8px 0' }}>Settings</h1>
      <p style={{ fontSize: 16, color: '#6B7280', marginTop: 0, marginBottom: 32 }}>
        Manage your notifications, language, and privacy preferences
      </p>

      {/* Notification Preferences */}
      <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 24px 0' }}>
          Notification Preferences
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
              <th style={{ textAlign: 'left', padding: '10px 0', color: '#6B7280', fontWeight: 600, fontSize: 13 }}>Notification</th>
              <th style={{ textAlign: 'center', padding: '10px 16px', color: '#6B7280', fontWeight: 600, fontSize: 13 }}>Email</th>
              <th style={{ textAlign: 'center', padding: '10px 16px', color: '#6B7280', fontWeight: 600, fontSize: 13 }}>Push</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '16px 0' }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: '#374151' }}>{n.label}</div>
                  <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>{n.description}</div>
                </td>
                <td style={{ textAlign: 'center', padding: '16px' }}>
                  <button
                    onClick={() => toggleNotification(n.id, 'email')}
                    style={toggleStyle(n.email)}
                    aria-label={`Toggle ${n.label} email`}
                  >
                    <div style={toggleDotStyle(n.email)} />
                  </button>
                </td>
                <td style={{ textAlign: 'center', padding: '16px' }}>
                  <button
                    onClick={() => toggleNotification(n.id, 'push')}
                    style={toggleStyle(n.push)}
                    aria-label={`Toggle ${n.label} push`}
                  >
                    <div style={toggleDotStyle(n.push)} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>

        {/* Language Selection */}
        <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 20px 0' }}>Language</h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              fontSize: 15,
              color: '#374151',
              background: '#FFF',
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>

        {/* Contact Info */}
        <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 20px 0' }}>Contact Information</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, color: '#6B7280', fontWeight: 500, display: 'block', marginBottom: 4 }}>Name</label>
              <input
                defaultValue="Jennifer Wilson"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#6B7280', fontWeight: 500, display: 'block', marginBottom: 4 }}>Email</label>
              <input
                defaultValue="jennifer.wilson@email.com"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#6B7280', fontWeight: 500, display: 'block', marginBottom: 4 }}>Phone</label>
              <input
                defaultValue="(503) 555-0147"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 24px 0' }}>Privacy Settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: '#374151' }}>Share data with care team</div>
              <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>Allow caregivers and clinicians to see your contact information</div>
            </div>
            <button
              onClick={() => setShareData(!shareData)}
              style={toggleStyle(shareData)}
              aria-label="Toggle share data"
            >
              <div style={toggleDotStyle(shareData)} />
            </button>
          </div>
          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: '#374151' }}>Show cognitive scores</div>
              <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>Display numerical scores on dashboard and progress pages</div>
            </div>
            <button
              onClick={() => setShowScores(!showScores)}
              style={toggleStyle(showScores)}
              aria-label="Toggle show scores"
            >
              <div style={toggleDotStyle(showScores)} />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          style={{
            padding: '12px 32px',
            background: '#7C3AED',
            color: '#FFF',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
