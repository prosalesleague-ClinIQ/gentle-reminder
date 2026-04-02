import React from 'react';
import { systemStats, recentActivity, systemHealth } from '@/data/mock';

const styles = {
  pageHeader: {
    marginBottom: 32,
  } as React.CSSProperties,
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#F0F6FC',
    margin: 0,
    letterSpacing: '-0.02em',
  } as React.CSSProperties,
  subtitle: {
    fontSize: 14,
    color: '#8B949E',
    marginTop: 6,
  } as React.CSSProperties,
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginBottom: 32,
  } as React.CSSProperties,
  statCard: {
    backgroundColor: '#161B22',
    border: '1px solid #21262D',
    borderRadius: 8,
    padding: '20px 24px',
  } as React.CSSProperties,
  statLabel: {
    fontSize: 13,
    color: '#8B949E',
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  } as React.CSSProperties,
  statValue: {
    fontSize: 32,
    fontWeight: 700,
    color: '#F0F6FC',
    letterSpacing: '-0.02em',
  } as React.CSSProperties,
  statChange: {
    fontSize: 12,
    marginTop: 6,
  } as React.CSSProperties,
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
  } as React.CSSProperties,
  card: {
    backgroundColor: '#161B22',
    border: '1px solid #21262D',
    borderRadius: 8,
    padding: 24,
  } as React.CSSProperties,
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#F0F6FC',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: '1px solid #21262D',
  } as React.CSSProperties,
};

function StatDot({ color }: { color: string }) {
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'inline-block',
      }}
    />
  );
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date('2026-04-01T08:30:00Z');
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'success':
      return '#3FB950';
    case 'warning':
      return '#D29922';
    case 'error':
      return '#F85149';
    default:
      return '#58A6FF';
  }
}

function getHealthColor(status: string): string {
  switch (status) {
    case 'Operational':
      return '#3FB950';
    case 'Degraded':
      return '#D29922';
    case 'Down':
      return '#F85149';
    default:
      return '#8B949E';
  }
}

function getTypeIcon(type: string): string {
  switch (type) {
    case 'user':
      return 'U';
    case 'system':
      return 'S';
    case 'billing':
      return 'B';
    case 'compliance':
      return 'C';
    case 'patient':
      return 'P';
    case 'facility':
      return 'F';
    default:
      return '?';
  }
}

export default function DashboardPage() {
  const statCards = [
    {
      label: 'Total Facilities',
      value: systemStats.totalFacilities.toString(),
      change: '+1 this quarter',
      changeColor: '#3FB950',
      dotColor: '#58A6FF',
    },
    {
      label: 'Active Patients',
      value: systemStats.activePatients.toString(),
      change: '+12 this month',
      changeColor: '#3FB950',
      dotColor: '#3FB950',
    },
    {
      label: 'Caregivers',
      value: systemStats.totalCaregivers.toString(),
      change: '+3 this month',
      changeColor: '#3FB950',
      dotColor: '#A371F7',
    },
    {
      label: 'Clinicians',
      value: systemStats.totalClinicians.toString(),
      change: 'Stable',
      changeColor: '#8B949E',
      dotColor: '#D29922',
    },
    {
      label: 'Monthly Revenue',
      value: formatCurrency(systemStats.monthlyRevenue),
      change: '+13.7% vs last month',
      changeColor: '#3FB950',
      dotColor: '#3FB950',
    },
    {
      label: 'System Uptime',
      value: `${systemStats.systemUptime}%`,
      change: 'Last 30 days',
      changeColor: '#8B949E',
      dotColor: '#3FB950',
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>
          Welcome back, Sarah. Here is your platform overview for April 1, 2026.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={styles.statsGrid}>
        {statCards.map((stat) => (
          <div key={stat.label} style={styles.statCard}>
            <div style={styles.statLabel}>
              <StatDot color={stat.dotColor} />
              {stat.label}
            </div>
            <div style={styles.statValue}>{stat.value}</div>
            <div style={{ ...styles.statChange, color: stat.changeColor }}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Section */}
      <div style={styles.sectionGrid}>
        {/* Recent Activity */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>Recent Activity</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentActivity.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: '1px solid #21262D',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    backgroundColor: `${getSeverityColor(item.severity)}15`,
                    border: `1px solid ${getSeverityColor(item.severity)}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: getSeverityColor(item.severity),
                    flexShrink: 0,
                  }}
                >
                  {getTypeIcon(item.type)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      color: '#C9D1D9',
                      lineHeight: 1.4,
                    }}
                  >
                    {item.message}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#8B949E',
                      marginTop: 4,
                    }}
                  >
                    {formatTime(item.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>System Health</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {systemHealth.map((indicator) => (
              <div
                key={indicator.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #21262D',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <StatDot color={getHealthColor(indicator.status)} />
                  <div>
                    <div style={{ fontSize: 14, color: '#C9D1D9', fontWeight: 500 }}>
                      {indicator.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#8B949E', marginTop: 2 }}>
                      {indicator.latency}ms latency
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: getHealthColor(indicator.status),
                      padding: '3px 10px',
                      borderRadius: 12,
                      backgroundColor: `${getHealthColor(indicator.status)}15`,
                      border: `1px solid ${getHealthColor(indicator.status)}30`,
                    }}
                  >
                    {indicator.status}
                  </div>
                  <div style={{ fontSize: 11, color: '#8B949E', marginTop: 4 }}>
                    {indicator.uptime}% uptime
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Status */}
          <div
            style={{
              marginTop: 20,
              padding: 16,
              backgroundColor: '#0D1117',
              borderRadius: 6,
              border: '1px solid #21262D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: '#8B949E' }}>Overall Platform Status</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#D29922', marginTop: 4 }}>
                Partially Degraded
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#8B949E' }}>Last checked</div>
              <div style={{ fontSize: 13, color: '#C9D1D9', marginTop: 2 }}>2 min ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div
        style={{
          marginTop: 24,
          backgroundColor: '#161B22',
          border: '1px solid #21262D',
          borderRadius: 8,
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 500, color: '#C9D1D9' }}>
          Quick Actions
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {['Add Facility', 'Create User', 'Generate Report', 'View Audit Log'].map(
            (action) => (
              <button
                key={action}
                style={{
                  backgroundColor: '#21262D',
                  color: '#C9D1D9',
                  border: '1px solid #30363D',
                  borderRadius: 6,
                  padding: '8px 16px',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                {action}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
