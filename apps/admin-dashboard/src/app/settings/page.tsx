import React from 'react';

interface SettingField {
  label: string;
  value: string;
  type: 'text' | 'select' | 'toggle' | 'number';
  description?: string;
}

interface SettingsSection {
  title: string;
  description: string;
  icon: string;
  fields: SettingField[];
}

const settingsSections: SettingsSection[] = [
  {
    title: 'General',
    description: 'Basic platform configuration and branding.',
    icon: 'G',
    fields: [
      { label: 'Platform Name', value: 'Gentle Reminder', type: 'text', description: 'The name displayed across all interfaces and communications.' },
      { label: 'Support Email', value: 'support@gentlereminder.care', type: 'text', description: 'Primary contact email for platform support inquiries.' },
      { label: 'Default Language', value: 'English (US)', type: 'select', description: 'Default language for new user accounts and system notifications.' },
      { label: 'Timezone', value: 'America/Los_Angeles (Pacific Time)', type: 'select', description: 'System-wide timezone for scheduling and audit logging.' },
      { label: 'Date Format', value: 'MM/DD/YYYY', type: 'select', description: 'Default date format used across the platform.' },
      { label: 'Maintenance Mode', value: 'Disabled', type: 'toggle', description: 'When enabled, shows a maintenance notice and restricts access to admins only.' },
    ],
  },
  {
    title: 'Security',
    description: 'Authentication, access controls, and security policies.',
    icon: 'S',
    fields: [
      { label: 'Minimum Password Length', value: '12 characters', type: 'number', description: 'Minimum number of characters required for user passwords.' },
      { label: 'Password Complexity', value: 'Require uppercase, lowercase, number, special character', type: 'select', description: 'Enforced password complexity rules for all user accounts.' },
      { label: 'Session Timeout', value: '30 minutes', type: 'select', description: 'Duration of inactivity before automatic session termination.' },
      { label: '2FA Enforcement', value: 'Required for Admin & Clinician roles', type: 'select', description: 'Which user roles must enable two-factor authentication.' },
      { label: 'Max Login Attempts', value: '5 attempts before lockout', type: 'number', description: 'Maximum consecutive failed login attempts before account lockout.' },
      { label: 'Lockout Duration', value: '15 minutes', type: 'select', description: 'Duration of account lockout after exceeding maximum login attempts.' },
      { label: 'IP Allowlisting', value: 'Disabled', type: 'toggle', description: 'Restrict admin portal access to specific IP addresses.' },
      { label: 'Password Expiry', value: '90 days', type: 'select', description: 'Maximum password age before users must change their password.' },
    ],
  },
  {
    title: 'Notifications',
    description: 'Email, SMS, and push notification configuration.',
    icon: 'N',
    fields: [
      { label: 'Email Gateway', value: 'Amazon SES (us-west-2)', type: 'select', description: 'Email service provider for transactional and notification emails.' },
      { label: 'From Email', value: 'notifications@gentlereminder.care', type: 'text', description: 'Sender email address for all platform notifications.' },
      { label: 'SMS Provider', value: 'Twilio', type: 'select', description: 'SMS gateway for reminder delivery and verification codes.' },
      { label: 'SMS From Number', value: '+1 (503) 555-0100', type: 'text', description: 'Outbound phone number for SMS notifications.' },
      { label: 'Push Notifications', value: 'Firebase Cloud Messaging (FCM)', type: 'select', description: 'Push notification provider for mobile app alerts.' },
      { label: 'Admin Alert Emails', value: 'Enabled (Critical & Warning)', type: 'select', description: 'Send email alerts to administrators for system events.' },
      { label: 'Daily Digest', value: 'Enabled at 8:00 AM PT', type: 'toggle', description: 'Send daily summary email of platform activity to admins.' },
    ],
  },
  {
    title: 'Data Retention',
    description: 'Configure data lifecycle and retention policies for compliance.',
    icon: 'D',
    fields: [
      { label: 'Patient Records', value: '7 years after last activity', type: 'select', description: 'Retention period for patient health records (HIPAA requires minimum 6 years).' },
      { label: 'Audit Logs', value: '90 days (active) / 7 years (archived)', type: 'select', description: 'Active retention for quick access and long-term archival for compliance.' },
      { label: 'Voice Recordings', value: '30 days', type: 'select', description: 'Retention period for AI voice reminder recordings.' },
      { label: 'Session Logs', value: '90 days', type: 'select', description: 'Retention period for user session and authentication logs.' },
      { label: 'Analytics Data', value: '2 years', type: 'select', description: 'Retention period for aggregated analytics and reporting data.' },
      { label: 'Backup Retention', value: '30 days (daily) / 1 year (monthly)', type: 'select', description: 'Backup schedule and retention for disaster recovery.' },
      { label: 'Deleted Account Data', value: '30 days before permanent deletion', type: 'select', description: 'Grace period before permanently removing deleted account data.' },
    ],
  },
];

function getIconColor(icon: string): string {
  switch (icon) {
    case 'G':
      return '#58A6FF';
    case 'S':
      return '#F85149';
    case 'N':
      return '#A371F7';
    case 'D':
      return '#D29922';
    default:
      return '#8B949E';
  }
}

function getTypeIndicator(type: string): React.ReactNode {
  switch (type) {
    case 'toggle':
      return (
        <div
          style={{
            width: 36,
            height: 20,
            borderRadius: 10,
            backgroundColor: '#238636',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              position: 'absolute',
              top: 2,
              right: 2,
            }}
          />
        </div>
      );
    case 'select':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6E7681" strokeWidth="2">
          <polyline points="6,9 12,15 18,9" />
        </svg>
      );
    default:
      return null;
  }
}

export default function SettingsPage() {
  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#F0F6FC', margin: 0, letterSpacing: '-0.02em' }}>
            Settings
          </h1>
          <p style={{ fontSize: 14, color: '#8B949E', marginTop: 6 }}>
            Configure platform-wide settings, security policies, and integrations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            style={{
              backgroundColor: '#21262D',
              color: '#C9D1D9',
              border: '1px solid #30363D',
              borderRadius: 6,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Reset to Defaults
          </button>
          <button
            style={{
              backgroundColor: '#238636',
              color: '#FFFFFF',
              border: '1px solid #2EA04366',
              borderRadius: 6,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Environment Indicator */}
      <div
        style={{
          backgroundColor: '#0D1117',
          border: '1px solid #21262D',
          borderRadius: 8,
          padding: '14px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#F85149',
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: 13, color: '#C9D1D9' }}>
            You are editing <strong style={{ color: '#F85149' }}>Production</strong> settings.
            Changes take effect immediately.
          </span>
        </div>
        <span style={{ fontSize: 12, color: '#6E7681' }}>
          Last modified: Mar 30, 2026 by Thomas Anderson
        </span>
      </div>

      {/* Settings Sections */}
      {settingsSections.map((section) => (
        <div
          key={section.title}
          style={{
            backgroundColor: '#161B22',
            border: '1px solid #21262D',
            borderRadius: 8,
            overflow: 'hidden',
            marginBottom: 24,
          }}
        >
          {/* Section Header */}
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid #21262D',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: `${getIconColor(section.icon)}15`,
                border: `1px solid ${getIconColor(section.icon)}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 700,
                color: getIconColor(section.icon),
                flexShrink: 0,
              }}
            >
              {section.icon}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#F0F6FC' }}>
                {section.title}
              </div>
              <div style={{ fontSize: 13, color: '#8B949E', marginTop: 2 }}>
                {section.description}
              </div>
            </div>
          </div>

          {/* Fields */}
          {section.fields.map((field, index) => (
            <div
              key={field.label}
              style={{
                padding: '16px 24px',
                borderBottom: index < section.fields.length - 1 ? '1px solid #21262D' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 24,
              }}
            >
              {/* Label + Description */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#C9D1D9' }}>
                  {field.label}
                </div>
                {field.description && (
                  <div style={{ fontSize: 12, color: '#6E7681', marginTop: 3, lineHeight: 1.4 }}>
                    {field.description}
                  </div>
                )}
              </div>

              {/* Value */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                {field.type === 'toggle' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, color: '#C9D1D9' }}>{field.value}</span>
                    {getTypeIndicator(field.type)}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#0D1117',
                      border: '1px solid #21262D',
                      borderRadius: 6,
                      fontSize: 13,
                      color: '#C9D1D9',
                      minWidth: 240,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{field.value}</span>
                    {getTypeIndicator(field.type)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Danger Zone */}
      <div
        style={{
          backgroundColor: '#161B22',
          border: '1px solid #F8514930',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #F8514920',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: '#F8514915',
              border: '1px solid #F8514930',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 700,
              color: '#F85149',
              flexShrink: 0,
            }}
          >
            !
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#F85149' }}>
              Danger Zone
            </div>
            <div style={{ fontSize: 13, color: '#8B949E', marginTop: 2 }}>
              Irreversible and destructive actions. Proceed with extreme caution.
            </div>
          </div>
        </div>

        {[
          {
            title: 'Export All Data',
            description: 'Download a complete export of all platform data including patient records, analytics, and configurations.',
            buttonText: 'Export Data',
            buttonColor: '#D29922',
          },
          {
            title: 'Purge Audit Logs',
            description: 'Permanently delete all audit log entries older than the configured retention period. This cannot be undone.',
            buttonText: 'Purge Logs',
            buttonColor: '#F85149',
          },
          {
            title: 'Reset Platform',
            description: 'Reset all settings to factory defaults. This will not affect patient data or user accounts.',
            buttonText: 'Reset Settings',
            buttonColor: '#F85149',
          },
        ].map((item, index) => (
          <div
            key={item.title}
            style={{
              padding: '16px 24px',
              borderBottom: index < 2 ? '1px solid #21262D' : 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#C9D1D9' }}>
                {item.title}
              </div>
              <div style={{ fontSize: 12, color: '#8B949E', marginTop: 3 }}>
                {item.description}
              </div>
            </div>
            <button
              style={{
                backgroundColor: 'transparent',
                color: item.buttonColor,
                border: `1px solid ${item.buttonColor}40`,
                borderRadius: 6,
                padding: '8px 16px',
                fontSize: 13,
                cursor: 'pointer',
                fontWeight: 500,
                flexShrink: 0,
                marginLeft: 24,
              }}
            >
              {item.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* System Info Footer */}
      <div
        style={{
          marginTop: 24,
          padding: '16px 20px',
          backgroundColor: '#0D1117',
          border: '1px solid #21262D',
          borderRadius: 8,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
        }}
      >
        {[
          { label: 'Platform Version', value: 'v2.4.1' },
          { label: 'API Version', value: 'v1.8.0' },
          { label: 'Last Deployment', value: 'Mar 31, 2026 at 2:15 PM' },
          { label: 'Environment', value: 'Production (us-west-2)' },
        ].map((info) => (
          <div key={info.label}>
            <div style={{ fontSize: 11, color: '#6E7681', marginBottom: 2 }}>{info.label}</div>
            <div style={{ fontSize: 13, color: '#C9D1D9', fontFamily: 'monospace' }}>
              {info.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
