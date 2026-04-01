import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Overview', icon: '\u25A3' },
  { href: '/patients', label: 'Patients', icon: '\u2639' },
  { href: '/family', label: 'Family', icon: '\u2302' },
  { href: '/care-plans', label: 'Care Plans', icon: '\u{1F4CB}' },
  { href: '/alerts', label: 'Alerts', icon: '\u26A0' },
  { href: '/analytics', label: 'Analytics', icon: '\u2261' },
  { href: '/engagement', label: 'Engagement', icon: '\u2665' },
  { href: '/sleep', label: 'Sleep', icon: '\u263D' },
  { href: '/risk', label: 'Risk', icon: '\u26A1' },
  { href: '/handoff', label: 'Handoff', icon: '\u2398' },
  { href: '/tasks', label: 'Tasks', icon: '\u2713' },
  { href: '/messages', label: 'Messages', icon: '\u2709' },
  { href: '/notifications', label: 'Notifications', icon: '\uD83D\uDD14' },
  { href: '#', label: 'Settings', icon: '\u2699' },
  { href: '/system', label: 'System', icon: '\u2316' },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 240,
        background: '#0F2B3F',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      {/* Logo area */}
      <div
        style={{
          padding: '28px 24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', color: '#7EB8DC', textTransform: 'uppercase' }}>
          Gentle Reminder
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, marginTop: 4, color: '#CBD5E1' }}>
          Caregiver Portal
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 8,
              color: '#CBD5E1',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 2,
              transition: 'background 0.15s',
            }}
          >
            <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          fontSize: 12,
          color: '#64748B',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#1A7BC4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 600,
              color: '#FFF',
            }}
          >
            SM
          </div>
          <div>
            <div style={{ color: '#CBD5E1', fontWeight: 500, fontSize: 13 }}>Sarah Mitchell</div>
            <div style={{ color: '#64748B', fontSize: 11 }}>Lead Caregiver</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
