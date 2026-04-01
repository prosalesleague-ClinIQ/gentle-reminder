'use client';

const services = [
  { name: 'API Server', status: 'Online', latency: '45ms', detail: 'Uptime 99.9%', uptime: 99.9 },
  { name: 'AI Services', status: 'Online', latency: '120ms', detail: 'Uptime 98.5%', uptime: 98.5 },
  { name: 'Database', status: 'Online', latency: '12/100 connections', detail: 'Uptime 99.99%', uptime: 99.99 },
  { name: 'WebSocket', status: 'Online', latency: '8 connected', detail: 'Uptime 99.8%', uptime: 99.8 },
];

const metrics = [
  { label: 'Active Users', value: '48' },
  { label: 'Requests Today', value: '12,450' },
  { label: 'Avg Response Time', value: '85ms' },
  { label: 'Error Rate', value: '0.02%' },
];

const endpoints = [
  { path: 'GET /api/v1/patients', responseTime: '42ms', status: 'Healthy' },
  { path: 'GET /api/v1/patients/:id', responseTime: '38ms', status: 'Healthy' },
  { path: 'POST /api/v1/patients', responseTime: '65ms', status: 'Healthy' },
  { path: 'GET /api/v1/analytics/cognitive-trends', responseTime: '125ms', status: 'Healthy' },
  { path: 'GET /api/v1/analytics/alerts', responseTime: '89ms', status: 'Healthy' },
  { path: 'POST /api/v1/voice/transcribe', responseTime: '340ms', status: 'Healthy' },
  { path: 'GET /api/v1/medications', responseTime: '55ms', status: 'Healthy' },
  { path: 'POST /api/v1/auth/login', responseTime: '112ms', status: 'Healthy' },
  { path: 'GET /api/v1/reports', responseTime: '78ms', status: 'Healthy' },
  { path: 'GET /health', responseTime: '8ms', status: 'Healthy' },
];

export default function SystemHealthPage() {
  return (
    <div style={{ padding: '32px 36px', maxWidth: 1200 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
        System Health
      </h1>
      <p style={{ color: '#64748B', fontSize: 14, marginBottom: 28 }}>
        Real-time monitoring of all platform services and infrastructure.
      </p>

      {/* Service Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {services.map((svc) => (
          <div
            key={svc.name}
            style={{
              background: '#FFFFFF',
              borderRadius: 12,
              padding: '20px 20px 16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#22C55E',
                  boxShadow: '0 0 6px rgba(34,197,94,0.4)',
                }}
              />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{svc.name}</span>
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>
              {svc.status} &middot; {svc.latency}
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 10 }}>{svc.detail}</div>
            {/* Uptime bar */}
            <div style={{ background: '#F1F5F9', borderRadius: 4, height: 6, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${svc.uptime}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #22C55E, #16A34A)',
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* System Metrics */}
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', marginBottom: 16 }}>
        System Metrics
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              background: '#FFFFFF',
              borderRadius: 12,
              padding: '20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500, marginBottom: 6 }}>
              {m.label}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#0F172A' }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* API Endpoint Status Table */}
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', marginBottom: 16 }}>
        API Endpoint Status
      </h2>
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#475569' }}>
                Endpoint
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#475569' }}>
                Response Time
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#475569' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map((ep, i) => (
              <tr
                key={ep.path}
                style={{
                  borderBottom: i < endpoints.length - 1 ? '1px solid #F1F5F9' : 'none',
                }}
              >
                <td style={{ padding: '10px 16px', fontFamily: 'monospace', color: '#334155' }}>
                  {ep.path}
                </td>
                <td style={{ padding: '10px 16px', color: '#475569' }}>{ep.responseTime}</td>
                <td style={{ padding: '10px 16px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: '#F0FDF4',
                      color: '#15803D',
                      padding: '3px 10px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#22C55E',
                      }}
                    />
                    {ep.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
