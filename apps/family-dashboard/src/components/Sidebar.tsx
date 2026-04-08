import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '\u2302' },
  { href: '/progress', label: 'Progress Updates', icon: '\u2261' },
  { href: '/messages', label: 'Messages', icon: '\u2709' },
  { href: '/photos', label: 'Photos & Memories', icon: '\u25A3' },
  { href: '/medications', label: 'Medications', icon: '\u2695' },
  { href: '/billing', label: 'Billing', icon: '\u2610' },
  { href: '/settings', label: 'Settings', icon: '\u2699' },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 240,
        background: '#2D3748',
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
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', color: '#B794F4', textTransform: 'uppercase' }}>
          Gentle Reminder
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, marginTop: 4, color: '#E2E8F0' }}>
          Family Portal
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
              color: '#E2E8F0',
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

      {/* Patient info footer */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          fontSize: 12,
          color: '#A0AEC0',
        }}
      >
        <div style={{ fontSize: 11, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
          Caring for
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 600,
              color: '#FFF',
            }}
          >
            MW
          </div>
          <div>
            <div style={{ color: '#E2E8F0', fontWeight: 500, fontSize: 13 }}>Margaret Wilson</div>
            <div style={{ color: '#A0AEC0', fontSize: 11 }}>Daughter</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
