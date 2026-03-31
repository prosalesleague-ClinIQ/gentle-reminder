import StatCard from '../components/StatCard';
import { recentActivity } from '../data/mock';

const activityIcons: Record<string, { icon: string; color: string }> = {
  session: { icon: '\u2713', color: '#3D8158' },
  alert: { icon: '!', color: '#C0392B' },
  milestone: { icon: '\u2605', color: '#E5A300' },
};

export default function OverviewPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2937', margin: 0 }}>
          Good morning, Sarah
        </h1>
        <p style={{ fontSize: 15, color: '#6B7280', margin: '6px 0 0' }}>
          Here is your patient overview for today, March 31, 2026.
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
          marginBottom: 36,
        }}
      >
        <StatCard title="Active Patients" value={12} subtitle="2 new this week" color="blue" icon={'\u{1F465}'} />
        <StatCard title="Sessions Today" value={8} subtitle="3 in progress" color="green" icon={'\u{1F4CB}'} />
        <StatCard title="Avg Score" value="78%" subtitle="Up 2% from last week" color="blue" icon={'\u{1F4CA}'} />
        <StatCard title="Alerts" value={3} subtitle="2 high priority" color="red" icon={'\u{1F514}'} />
      </div>

      {/* Recent Activity */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #F0F0F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>Recent Activity</h2>
          <span style={{ fontSize: 13, color: '#1A7BC4', fontWeight: 500, cursor: 'pointer' }}>
            View all
          </span>
        </div>

        {recentActivity.map((item) => {
          const iconInfo = activityIcons[item.type];
          return (
            <div
              key={item.id}
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #F8F8F8',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: `${iconInfo.color}15`,
                  color: iconInfo.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {iconInfo.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: '#374151' }}>{item.message}</div>
              </div>
              <div style={{ fontSize: 12, color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                {item.timestamp}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
