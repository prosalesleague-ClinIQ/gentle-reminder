'use client';

import React, { useState, useEffect } from 'react';

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  uptime: string;
  latencyMs: number;
  version: string;
  lastCheck: string;
}

interface SystemMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

const services: ServiceStatus[] = [
  { name: 'API Server', status: 'healthy', uptime: '99.97%', latencyMs: 42, version: 'v1.28.0', lastCheck: '10s ago' },
  { name: 'PostgreSQL', status: 'healthy', uptime: '99.99%', latencyMs: 8, version: '16.2', lastCheck: '10s ago' },
  { name: 'Neo4j (Memory Graph)', status: 'healthy', uptime: '99.91%', latencyMs: 15, version: '5.15', lastCheck: '10s ago' },
  { name: 'AI Services (FastAPI)', status: 'healthy', uptime: '99.85%', latencyMs: 128, version: 'v1.12.0', lastCheck: '10s ago' },
  { name: 'Redis Cache', status: 'healthy', uptime: '99.99%', latencyMs: 2, version: '7.2', lastCheck: '10s ago' },
  { name: 'WebSocket Server', status: 'healthy', uptime: '99.94%', latencyMs: 5, version: 'v1.28.0', lastCheck: '10s ago' },
  { name: 'Whisper Transcription', status: 'degraded', uptime: '98.72%', latencyMs: 2340, version: 'large-v3', lastCheck: '30s ago' },
  { name: 'Push Notification Service', status: 'healthy', uptime: '99.96%', latencyMs: 89, version: 'v1.4.0', lastCheck: '10s ago' },
];

const systemMetrics: SystemMetric[] = [
  { label: 'API Requests (24h)', value: '847,293', trend: 'up', color: '#58A6FF' },
  { label: 'Avg Response Time', value: '42ms', trend: 'down', color: '#3FB950' },
  { label: 'Error Rate', value: '0.03%', trend: 'down', color: '#3FB950' },
  { label: 'Active WebSockets', value: '1,247', trend: 'up', color: '#A371F7' },
  { label: 'DB Connections', value: '38/100', trend: 'stable', color: '#D29922' },
  { label: 'Memory Usage', value: '4.2 GB / 16 GB', trend: 'stable', color: '#58A6FF' },
  { label: 'CPU Utilization', value: '23%', trend: 'stable', color: '#3FB950' },
  { label: 'Disk Usage', value: '127 GB / 500 GB', trend: 'up', color: '#D29922' },
];

function getStatusColor(status: string): string {
  switch (status) {
    case 'healthy': return '#3FB950';
    case 'degraded': return '#D29922';
    case 'down': return '#F85149';
    default: return '#8B949E';
  }
}

function getTrendArrow(trend: string): string {
  switch (trend) {
    case 'up': return '\u2191';
    case 'down': return '\u2193';
    default: return '\u2192';
  }
}

export default function SystemPage() {
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setRefreshCount((c) => c + 1), 10000);
    return () => clearInterval(interval);
  }, []);

  const healthyCount = services.filter((s) => s.status === 'healthy').length;
  const overallStatus = services.every((s) => s.status === 'healthy')
    ? 'All Systems Operational'
    : services.some((s) => s.status === 'down')
      ? 'System Outage Detected'
      : 'Partial Degradation';

  const overallColor = services.every((s) => s.status === 'healthy')
    ? '#3FB950'
    : services.some((s) => s.status === 'down')
      ? '#F85149'
      : '#D29922';

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#F0F6FC', margin: 0, letterSpacing: '-0.02em' }}>
          System Health
        </h1>
        <p style={{ fontSize: 14, color: '#8B949E', marginTop: 6 }}>
          Real-time monitoring of platform services, infrastructure, and performance metrics.
        </p>
      </div>

      {/* Overall Status Banner */}
      <div style={{ backgroundColor: `${overallColor}10`, border: `1px solid ${overallColor}30`, borderRadius: 8, padding: '16px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: overallColor, display: 'inline-block', boxShadow: `0 0 8px ${overallColor}60` }} />
          <span style={{ fontSize: 16, fontWeight: 600, color: overallColor }}>{overallStatus}</span>
        </div>
        <span style={{ fontSize: 12, color: '#8B949E' }}>
          {healthyCount}/{services.length} services healthy &middot; Last refresh: {refreshCount * 10}s ago
        </span>
      </div>

      {/* System Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {systemMetrics.map((m) => (
          <div key={m.label} style={{ backgroundColor: '#161B22', border: '1px solid #21262D', borderRadius: 8, padding: '14px 18px' }}>
            <div style={{ fontSize: 12, color: '#8B949E', marginBottom: 6 }}>{m.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: m.color }}>{m.value}</span>
              <span style={{ fontSize: 12, color: m.trend === 'down' ? '#3FB950' : m.trend === 'up' ? '#D29922' : '#8B949E' }}>
                {getTrendArrow(m.trend)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Services Table */}
      <div style={{ backgroundColor: '#161B22', border: '1px solid #21262D', borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #21262D', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#F0F6FC' }}>Service Status</span>
          <span style={{ fontSize: 12, color: '#8B949E' }}>Auto-refreshes every 10s</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #21262D' }}>
              {['Service', 'Status', 'Uptime (30d)', 'Latency', 'Version', 'Last Check'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#8B949E', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.name} style={{ borderBottom: '1px solid #21262D' }}>
                <td style={{ padding: '12px 16px', fontWeight: 500, color: '#F0F6FC' }}>{s.name}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: getStatusColor(s.status), display: 'inline-block' }} />
                    <span style={{ color: getStatusColor(s.status), fontWeight: 500, textTransform: 'capitalize' }}>{s.status}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#C9D1D9' }}>{s.uptime}</td>
                <td style={{ padding: '12px 16px', color: s.latencyMs > 1000 ? '#D29922' : '#C9D1D9', fontFamily: 'monospace', fontSize: 12 }}>
                  {s.latencyMs}ms
                </td>
                <td style={{ padding: '12px 16px', color: '#8B949E', fontFamily: 'monospace', fontSize: 12 }}>{s.version}</td>
                <td style={{ padding: '12px 16px', color: '#8B949E', fontSize: 12 }}>{s.lastCheck}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Incidents */}
      <div style={{ backgroundColor: '#161B22', border: '1px solid #21262D', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #21262D' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#F0F6FC' }}>Recent Incidents</span>
        </div>
        <div style={{ padding: 20 }}>
          {[
            { date: 'Apr 6, 2026', title: 'Whisper transcription latency spike', severity: 'warning', duration: '23m', resolved: true },
            { date: 'Apr 2, 2026', title: 'Database connection pool exhaustion', severity: 'critical', duration: '8m', resolved: true },
            { date: 'Mar 28, 2026', title: 'CDN cache invalidation delay', severity: 'minor', duration: '45m', resolved: true },
          ].map((incident, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: i < 2 ? '1px solid #21262D' : 'none' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: incident.severity === 'critical' ? '#F85149' : incident.severity === 'warning' ? '#D29922' : '#8B949E', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: '#F0F6FC', fontWeight: 500 }}>{incident.title}</div>
                <div style={{ fontSize: 12, color: '#8B949E', marginTop: 2 }}>
                  {incident.date} &middot; Duration: {incident.duration} &middot;{' '}
                  <span style={{ color: '#3FB950' }}>Resolved</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
