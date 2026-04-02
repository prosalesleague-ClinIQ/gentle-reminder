'use client';

import React, { useState } from 'react';
import { auditLog, type AuditAction } from '@/data/mock';

function getActionColor(action: AuditAction): string {
  switch (action) {
    case 'Login':
    case 'Logout':
      return '#58A6FF';
    case 'View Patient':
      return '#8B949E';
    case 'Update Record':
    case 'Update Settings':
    case 'Facility Updated':
    case 'Billing Updated':
      return '#D29922';
    case 'Export Data':
    case 'Generate Report':
      return '#A371F7';
    case 'Create User':
    case 'API Key Created':
      return '#3FB950';
    case 'Delete User':
    case 'API Key Revoked':
    case 'Role Changed':
      return '#F85149';
    case 'Password Reset':
      return '#D29922';
    default:
      return '#8B949E';
  }
}

function getStatusColor(status: string): string {
  return status === 'Success' ? '#3FB950' : '#F85149';
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

type ActionFilter = 'all' | 'auth' | 'data' | 'admin' | 'api';

const actionGroups: Record<ActionFilter, AuditAction[] | null> = {
  all: null,
  auth: ['Login', 'Logout', 'Password Reset'],
  data: ['View Patient', 'Update Record', 'Export Data', 'Generate Report'],
  admin: ['Create User', 'Delete User', 'Update Settings', 'Role Changed', 'Facility Updated', 'Billing Updated'],
  api: ['API Key Created', 'API Key Revoked'],
};

export default function AuditPage() {
  const [actionFilter, setActionFilter] = useState<ActionFilter>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Success' | 'Failed'>('all');

  const filteredLog = auditLog.filter((entry) => {
    const matchesAction =
      actionFilter === 'all' || (actionGroups[actionFilter] && actionGroups[actionFilter]!.includes(entry.action));
    const matchesStatus =
      statusFilter === 'all' || entry.status === statusFilter;
    return matchesAction && matchesStatus;
  });

  const successCount = auditLog.filter((e) => e.status === 'Success').length;
  const failedCount = auditLog.filter((e) => e.status === 'Failed').length;

  const uniqueUsers = new Set(auditLog.map((e) => e.user)).size;
  const uniqueActions = new Set(auditLog.map((e) => e.action)).size;

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#F0F6FC', margin: 0, letterSpacing: '-0.02em' }}>
            Audit Log
          </h1>
          <p style={{ fontSize: 14, color: '#8B949E', marginTop: 6 }}>
            Complete audit trail of all platform activities for compliance and security monitoring.
          </p>
        </div>
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
          Export Audit Log
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Events', value: auditLog.length, color: '#58A6FF' },
          { label: 'Successful', value: successCount, color: '#3FB950' },
          { label: 'Failed', value: failedCount, color: '#F85149' },
          { label: 'Unique Users', value: uniqueUsers, color: '#A371F7' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: '#161B22',
              border: '1px solid #21262D',
              borderRadius: 8,
              padding: '14px 18px',
            }}
          >
            <div style={{ fontSize: 12, color: '#8B949E', marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          backgroundColor: '#161B22',
          border: '1px solid #21262D',
          borderRadius: 8,
          padding: '16px 20px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {/* Action Type Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#8B949E', fontWeight: 600 }}>Action:</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {(
              [
                { key: 'all', label: 'All' },
                { key: 'auth', label: 'Authentication' },
                { key: 'data', label: 'Data Access' },
                { key: 'admin', label: 'Admin' },
                { key: 'api', label: 'API' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActionFilter(tab.key)}
                style={{
                  backgroundColor: actionFilter === tab.key ? '#21262D' : 'transparent',
                  color: actionFilter === tab.key ? '#F0F6FC' : '#8B949E',
                  border: actionFilter === tab.key ? '1px solid #30363D' : '1px solid transparent',
                  borderRadius: 6,
                  padding: '5px 12px',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight: actionFilter === tab.key ? 600 : 400,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, backgroundColor: '#21262D' }} />

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#8B949E', fontWeight: 600 }}>Status:</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {(
              [
                { key: 'all' as const, label: 'All' },
                { key: 'Success' as const, label: 'Success' },
                { key: 'Failed' as const, label: 'Failed' },
              ]
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                style={{
                  backgroundColor: statusFilter === tab.key ? '#21262D' : 'transparent',
                  color: statusFilter === tab.key ? '#F0F6FC' : '#8B949E',
                  border: statusFilter === tab.key ? '1px solid #30363D' : '1px solid transparent',
                  borderRadius: 6,
                  padding: '5px 12px',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight: statusFilter === tab.key ? 600 : 400,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{ marginLeft: 'auto', fontSize: 12, color: '#6E7681' }}>
          {filteredLog.length} of {auditLog.length} events
        </div>
      </div>

      {/* Audit Table */}
      <div
        style={{
          backgroundColor: '#161B22',
          border: '1px solid #21262D',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #21262D' }}>
              {['Timestamp', 'User', 'Action', 'Resource', 'IP Address', 'Status', 'Details'].map(
                (header) => (
                  <th
                    key={header}
                    style={{
                      padding: '12px 14px',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: '#8B949E',
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredLog.map((entry) => (
              <tr
                key={entry.id}
                style={{
                  borderBottom: '1px solid #21262D',
                  backgroundColor: entry.status === 'Failed' ? '#F8514908' : 'transparent',
                }}
              >
                {/* Timestamp */}
                <td
                  style={{
                    padding: '12px 14px',
                    color: '#8B949E',
                    fontSize: 12,
                    fontFamily: 'monospace',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatTimestamp(entry.timestamp)}
                </td>

                {/* User */}
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: entry.user === 'Unknown' ? '#F8514920' : '#21262D',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 600,
                        color: entry.user === 'Unknown' ? '#F85149' : '#C9D1D9',
                        flexShrink: 0,
                      }}
                    >
                      {entry.user
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        color: entry.user === 'Unknown' ? '#F85149' : '#C9D1D9',
                        fontWeight: 500,
                      }}
                    >
                      {entry.user}
                    </span>
                  </div>
                </td>

                {/* Action */}
                <td style={{ padding: '12px 14px' }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: getActionColor(entry.action),
                      backgroundColor: `${getActionColor(entry.action)}15`,
                      border: `1px solid ${getActionColor(entry.action)}30`,
                      padding: '2px 8px',
                      borderRadius: 10,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {entry.action}
                  </span>
                </td>

                {/* Resource */}
                <td style={{ padding: '12px 14px', color: '#C9D1D9', fontSize: 12 }}>
                  {entry.resource}
                </td>

                {/* IP Address */}
                <td
                  style={{
                    padding: '12px 14px',
                    color: '#6E7681',
                    fontSize: 11,
                    fontFamily: 'monospace',
                  }}
                >
                  {entry.ipAddress}
                </td>

                {/* Status */}
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(entry.status),
                        display: 'inline-block',
                      }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        color: getStatusColor(entry.status),
                        fontWeight: 500,
                      }}
                    >
                      {entry.status}
                    </span>
                  </div>
                </td>

                {/* Details */}
                <td
                  style={{
                    padding: '12px 14px',
                    color: '#8B949E',
                    fontSize: 12,
                    maxWidth: 250,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {entry.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          color: '#6E7681',
        }}
      >
        <span>
          Showing {filteredLog.length} entries. Logs retained for 90 days per compliance policy.
        </span>
        <span>Last entry: {formatTimestamp(auditLog[0].timestamp)}</span>
      </div>
    </div>
  );
}
