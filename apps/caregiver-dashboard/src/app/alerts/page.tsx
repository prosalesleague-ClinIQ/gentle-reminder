import Link from 'next/link';
import AlertBadge from '../../components/AlertBadge';
import { alerts } from '../../data/mock';

export default function AlertsPage() {
  const highCount = alerts.filter((a) => a.severity === 'high').length;
  const mediumCount = alerts.filter((a) => a.severity === 'medium').length;
  const lowCount = alerts.filter((a) => a.severity === 'low').length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2937', margin: 0 }}>Alerts</h1>
        <p style={{ fontSize: 15, color: '#6B7280', margin: '6px 0 0' }}>
          Review cognitive health alerts and decline indicators across your patients.
        </p>
      </div>

      {/* Summary */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          { label: 'High Priority', count: highCount, bg: '#FDECEC', color: '#C0392B', border: '#C0392B' },
          { label: 'Medium', count: mediumCount, bg: '#FEF7E0', color: '#B58200', border: '#E5A300' },
          { label: 'Low', count: lowCount, bg: '#EBF5FB', color: '#1A7BC4', border: '#1A7BC4' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              flex: 1,
              padding: '16px 20px',
              background: '#FFFFFF',
              borderRadius: 10,
              borderLeft: `4px solid ${item.border}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: item.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 800,
                color: item.color,
              }}
            >
              {item.count}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{item.label}</div>
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                {item.count === 1 ? '1 alert' : `${item.count} alerts`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert list */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0F0F0' }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>All Alerts</h2>
        </div>

        {alerts.map((alert) => {
          const timestamp = new Date(alert.timestamp);
          const dateStr = timestamp.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          const timeStr = timestamp.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          });

          return (
            <div
              key={alert.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: '18px 24px',
                borderBottom: '1px solid #F8F8F8',
                background: alert.read ? '#FFFFFF' : '#FAFBFF',
              }}
            >
              {/* Unread dot */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: alert.read ? 'transparent' : '#1A7BC4',
                  flexShrink: 0,
                  marginTop: 6,
                }}
              />

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <AlertBadge severity={alert.severity} />
                  <Link
                    href={`/patients/${alert.patientId}`}
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#1A7BC4',
                      textDecoration: 'none',
                    }}
                  >
                    {alert.patientName}
                  </Link>
                </div>
                <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>
                  {alert.message}
                </div>
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: '#9CA3AF',
                  whiteSpace: 'nowrap',
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                <div>{dateStr}</div>
                <div>{timeStr}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
