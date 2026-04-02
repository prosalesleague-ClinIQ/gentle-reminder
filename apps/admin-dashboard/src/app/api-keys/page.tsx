'use client';

import React, { useState } from 'react';
import { apiKeys, apiUsageStats } from '@/data/mock';

function getStatusColor(status: string): string {
  return status === 'Active' ? '#3FB950' : '#F85149';
}

function getEnvColor(env: string): string {
  switch (env) {
    case 'Production':
      return '#F85149';
    case 'Staging':
      return '#D29922';
    case 'Development':
      return '#58A6FF';
    case 'Legacy':
      return '#8B949E';
    default:
      return '#8B949E';
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatLastUsed(timestamp: string): string {
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

export default function ApiKeysPage() {
  const [showKeyId, setShowKeyId] = useState<string | null>(null);

  const activeKeys = apiKeys.filter((k) => k.status === 'Active').length;
  const revokedKeys = apiKeys.filter((k) => k.status === 'Revoked').length;

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#F0F6FC', margin: 0, letterSpacing: '-0.02em' }}>
            API Keys
          </h1>
          <p style={{ fontSize: 14, color: '#8B949E', marginTop: 6 }}>
            Manage API keys and monitor usage across all environments.
          </p>
        </div>
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
          + Generate New Key
        </button>
      </div>

      {/* API Usage Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Requests Today', value: apiUsageStats.requestsToday.toLocaleString(), color: '#58A6FF' },
          { label: 'Rate Limit Hits', value: apiUsageStats.rateLimitHits.toString(), color: apiUsageStats.rateLimitHits > 10 ? '#F85149' : '#D29922' },
          { label: 'Avg Response Time', value: `${apiUsageStats.avgResponseTime}ms`, color: '#3FB950' },
          { label: 'Active Keys', value: activeKeys.toString(), color: '#3FB950' },
          { label: 'Error Rate', value: `${apiUsageStats.errorRate}%`, color: apiUsageStats.errorRate > 1 ? '#F85149' : '#3FB950' },
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

      {/* API Keys List */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#F0F6FC', marginBottom: 16 }}>
          API Keys ({apiKeys.length})
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {apiKeys.map((key) => (
            <div
              key={key.id}
              style={{
                backgroundColor: '#161B22',
                border: `1px solid ${key.status === 'Revoked' ? '#F8514930' : '#21262D'}`,
                borderRadius: 8,
                padding: '20px 24px',
                opacity: key.status === 'Revoked' ? 0.7 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Env Badge */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      backgroundColor: `${getEnvColor(key.environment)}15`,
                      border: `1px solid ${getEnvColor(key.environment)}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={getEnvColor(key.environment)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                    </svg>
                  </div>

                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#F0F6FC' }}>
                      {key.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: getEnvColor(key.environment),
                          backgroundColor: `${getEnvColor(key.environment)}15`,
                          border: `1px solid ${getEnvColor(key.environment)}30`,
                          padding: '2px 8px',
                          borderRadius: 10,
                        }}
                      >
                        {key.environment}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: getStatusColor(key.status),
                          backgroundColor: `${getStatusColor(key.status)}15`,
                          border: `1px solid ${getStatusColor(key.status)}30`,
                          padding: '2px 8px',
                          borderRadius: 10,
                        }}
                      >
                        {key.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {key.status === 'Active' && (
                    <>
                      <button
                        onClick={() => setShowKeyId(showKeyId === key.id ? null : key.id)}
                        style={{
                          backgroundColor: '#21262D',
                          color: '#C9D1D9',
                          border: '1px solid #30363D',
                          borderRadius: 6,
                          padding: '6px 14px',
                          fontSize: 12,
                          cursor: 'pointer',
                          fontWeight: 500,
                        }}
                      >
                        {showKeyId === key.id ? 'Hide' : 'Reveal'}
                      </button>
                      <button
                        style={{
                          backgroundColor: 'transparent',
                          color: '#F85149',
                          border: '1px solid #F8514930',
                          borderRadius: 6,
                          padding: '6px 14px',
                          fontSize: 12,
                          cursor: 'pointer',
                          fontWeight: 500,
                        }}
                      >
                        Revoke
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Key Value */}
              <div
                style={{
                  backgroundColor: '#0D1117',
                  border: '1px solid #21262D',
                  borderRadius: 6,
                  padding: '10px 14px',
                  fontFamily: 'monospace',
                  fontSize: 13,
                  color: showKeyId === key.id ? '#F0F6FC' : '#6E7681',
                  marginBottom: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>
                  {showKeyId === key.id
                    ? key.prefix.replace('...', '_7f8a2b3c4d5e6f1a2b3c4d5e')
                    : key.prefix}
                </span>
                <button
                  style={{
                    backgroundColor: 'transparent',
                    color: '#58A6FF',
                    border: 'none',
                    fontSize: 12,
                    cursor: 'pointer',
                    padding: '2px 8px',
                  }}
                >
                  Copy
                </button>
              </div>

              {/* Key Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#6E7681', marginBottom: 2 }}>Created</div>
                  <div style={{ fontSize: 12, color: '#C9D1D9' }}>{formatDate(key.createdAt)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#6E7681', marginBottom: 2 }}>Last Used</div>
                  <div style={{ fontSize: 12, color: '#C9D1D9' }}>
                    {key.status === 'Revoked' ? 'N/A' : formatLastUsed(key.lastUsed)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#6E7681', marginBottom: 2 }}>Rate Limit</div>
                  <div style={{ fontSize: 12, color: '#C9D1D9' }}>
                    {key.rateLimit.toLocaleString()} req/hr
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#6E7681', marginBottom: 2 }}>Requests Today</div>
                  <div style={{ fontSize: 12, color: '#C9D1D9' }}>
                    {key.requestsToday.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#6E7681', marginBottom: 2 }}>Created By</div>
                  <div style={{ fontSize: 12, color: '#C9D1D9' }}>{key.createdBy}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Endpoints */}
      <div
        style={{
          backgroundColor: '#161B22',
          border: '1px solid #21262D',
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: 32,
        }}
      >
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #21262D',
            fontSize: 16,
            fontWeight: 600,
            color: '#F0F6FC',
          }}
        >
          Top Endpoints (Today)
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #21262D' }}>
              {['Endpoint', 'Requests', 'Avg Response', 'Traffic Share'].map(
                (header) => (
                  <th
                    key={header}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: '#8B949E',
                      fontSize: 12,
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
            {apiUsageStats.topEndpoints.map((endpoint) => {
              const share = Math.round(
                (endpoint.count / apiUsageStats.requestsToday) * 100
              );
              return (
                <tr key={endpoint.endpoint} style={{ borderBottom: '1px solid #21262D' }}>
                  <td
                    style={{
                      padding: '14px 16px',
                      color: '#58A6FF',
                      fontFamily: 'monospace',
                      fontSize: 12,
                    }}
                  >
                    {endpoint.endpoint}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#C9D1D9', fontWeight: 600 }}>
                    {endpoint.count.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        color: endpoint.avgMs < 100 ? '#3FB950' : endpoint.avgMs < 200 ? '#D29922' : '#F85149',
                        fontWeight: 500,
                      }}
                    >
                      {endpoint.avgMs}ms
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 100, height: 6, backgroundColor: '#21262D', borderRadius: 3 }}>
                        <div
                          style={{
                            width: `${share}%`,
                            height: '100%',
                            backgroundColor: '#58A6FF',
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 12, color: '#8B949E' }}>{share}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rate Limiting Info */}
      <div
        style={{
          backgroundColor: '#161B22',
          border: '1px solid #21262D',
          borderRadius: 8,
          padding: 24,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 600, color: '#F0F6FC', marginBottom: 16 }}>
          Rate Limiting Policy
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { env: 'Production', limit: '10,000 req/hr', burst: '500 req/min', color: '#F85149' },
            { env: 'Staging', limit: '5,000 req/hr', burst: '250 req/min', color: '#D29922' },
            { env: 'Development', limit: '2,000 req/hr', burst: '100 req/min', color: '#58A6FF' },
          ].map((item) => (
            <div
              key={item.env}
              style={{
                padding: '16px 20px',
                backgroundColor: '#0D1117',
                border: '1px solid #21262D',
                borderRadius: 6,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: item.color, marginBottom: 8 }}>
                {item.env}
              </div>
              <div style={{ fontSize: 12, color: '#8B949E', marginBottom: 4 }}>
                Rate limit: <span style={{ color: '#C9D1D9' }}>{item.limit}</span>
              </div>
              <div style={{ fontSize: 12, color: '#8B949E' }}>
                Burst limit: <span style={{ color: '#C9D1D9' }}>{item.burst}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
