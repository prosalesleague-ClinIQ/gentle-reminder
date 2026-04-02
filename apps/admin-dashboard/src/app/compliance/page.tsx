import React from 'react';
import { complianceItems, facilities, type SafeguardCategory, type ComplianceStatus } from '@/data/mock';

function getStatusColor(status: ComplianceStatus): string {
  switch (status) {
    case 'Compliant':
      return '#3FB950';
    case 'In Progress':
      return '#D29922';
    case 'Needs Attention':
      return '#F85149';
    default:
      return '#8B949E';
  }
}

function getStatusIcon(status: ComplianceStatus): string {
  switch (status) {
    case 'Compliant':
      return '\u2713';
    case 'In Progress':
      return '\u25CB';
    case 'Needs Attention':
      return '!';
    default:
      return '?';
  }
}

function getBaaColor(status: string): string {
  switch (status) {
    case 'Active':
      return '#3FB950';
    case 'Pending':
      return '#D29922';
    case 'Expired':
      return '#F85149';
    default:
      return '#8B949E';
  }
}

export default function CompliancePage() {
  const compliantCount = complianceItems.filter((i) => i.status === 'Compliant').length;
  const inProgressCount = complianceItems.filter((i) => i.status === 'In Progress').length;
  const needsAttentionCount = complianceItems.filter((i) => i.status === 'Needs Attention').length;
  const complianceScore = Math.round((compliantCount / complianceItems.length) * 100);

  const categories: SafeguardCategory[] = ['Administrative', 'Technical', 'Physical'];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#F0F6FC', margin: 0, letterSpacing: '-0.02em' }}>
            HIPAA Compliance
          </h1>
          <p style={{ fontSize: 14, color: '#8B949E', marginTop: 6 }}>
            Monitor compliance status across all HIPAA safeguard categories.
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
          Generate Compliance Report
        </button>
      </div>

      {/* Compliance Score */}
      <div
        style={{
          backgroundColor: '#161B22',
          border: '1px solid #21262D',
          borderRadius: 8,
          padding: 32,
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 40,
        }}
      >
        {/* Score Circle */}
        <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            {/* Background circle */}
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="#21262D"
              strokeWidth="10"
            />
            {/* Score arc */}
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke={complianceScore >= 90 ? '#3FB950' : complianceScore >= 70 ? '#D29922' : '#F85149'}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(complianceScore / 100) * 377} 377`}
              transform="rotate(-90 70 70)"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 700, color: '#F0F6FC' }}>
              {complianceScore}%
            </div>
            <div style={{ fontSize: 11, color: '#8B949E' }}>Compliance</div>
          </div>
        </div>

        {/* Score Details */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#F0F6FC', marginBottom: 16 }}>
            Overall Compliance Score
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Compliant', count: compliantCount, color: '#3FB950' },
              { label: 'In Progress', count: inProgressCount, color: '#D29922' },
              { label: 'Needs Attention', count: needsAttentionCount, color: '#F85149' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#0D1117',
                  border: '1px solid #21262D',
                  borderRadius: 6,
                }}
              >
                <div style={{ fontSize: 12, color: '#8B949E', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: item.color }}>{item.count}</div>
                <div style={{ fontSize: 11, color: '#6E7681', marginTop: 2 }}>
                  of {complianceItems.length} items
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: 16 }}>
            <div style={{ width: '100%', height: 8, backgroundColor: '#21262D', borderRadius: 4, display: 'flex', overflow: 'hidden' }}>
              <div style={{ width: `${(compliantCount / complianceItems.length) * 100}%`, height: '100%', backgroundColor: '#3FB950' }} />
              <div style={{ width: `${(inProgressCount / complianceItems.length) * 100}%`, height: '100%', backgroundColor: '#D29922' }} />
              <div style={{ width: `${(needsAttentionCount / complianceItems.length) * 100}%`, height: '100%', backgroundColor: '#F85149' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Checklist by Category */}
      {categories.map((category) => {
        const items = complianceItems.filter((i) => i.category === category);
        const catCompliant = items.filter((i) => i.status === 'Compliant').length;

        return (
          <div
            key={category}
            style={{
              backgroundColor: '#161B22',
              border: '1px solid #21262D',
              borderRadius: 8,
              overflow: 'hidden',
              marginBottom: 24,
            }}
          >
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #21262D',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: 16, fontWeight: 600, color: '#F0F6FC' }}>
                  {category} Safeguards
                </span>
                <span style={{ fontSize: 13, color: '#8B949E', marginLeft: 12 }}>
                  {catCompliant}/{items.length} compliant
                </span>
              </div>
              <div style={{ width: 100, height: 4, backgroundColor: '#21262D', borderRadius: 2 }}>
                <div
                  style={{
                    width: `${(catCompliant / items.length) * 100}%`,
                    height: '100%',
                    backgroundColor: catCompliant === items.length ? '#3FB950' : '#D29922',
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>

            {items.map((item, index) => (
              <div
                key={item.id}
                style={{
                  padding: '16px 24px',
                  borderBottom: index < items.length - 1 ? '1px solid #21262D' : 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 16,
                }}
              >
                {/* Status Icon */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: `${getStatusColor(item.status)}15`,
                    border: `1px solid ${getStatusColor(item.status)}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    color: getStatusColor(item.status),
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {getStatusIcon(item.status)}
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#F0F6FC', marginBottom: 4 }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#8B949E', lineHeight: 1.4 }}>
                        {item.description}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: getStatusColor(item.status),
                        backgroundColor: `${getStatusColor(item.status)}15`,
                        border: `1px solid ${getStatusColor(item.status)}30`,
                        padding: '3px 10px',
                        borderRadius: 12,
                        flexShrink: 0,
                        marginLeft: 16,
                      }}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Meta info */}
                  <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
                    <div style={{ fontSize: 12, color: '#6E7681' }}>
                      <span style={{ color: '#8B949E' }}>Last reviewed:</span>{' '}
                      {new Date(item.lastReviewed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div style={{ fontSize: 12, color: '#6E7681' }}>
                      <span style={{ color: '#8B949E' }}>Next review:</span>{' '}
                      {new Date(item.nextReview).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div style={{ fontSize: 12, color: '#6E7681' }}>
                      <span style={{ color: '#8B949E' }}>Owner:</span> {item.owner}
                    </div>
                  </div>

                  {/* Notes */}
                  {item.notes && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: '8px 12px',
                        backgroundColor: '#0D1117',
                        border: '1px solid #21262D',
                        borderRadius: 4,
                        fontSize: 12,
                        color: '#8B949E',
                        lineHeight: 1.4,
                      }}
                    >
                      {item.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {/* BAA Status by Facility */}
      <div
        style={{
          backgroundColor: '#161B22',
          border: '1px solid #21262D',
          borderRadius: 8,
          overflow: 'hidden',
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
          Business Associate Agreements (BAA)
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #21262D' }}>
              {['Facility', 'BAA Status', 'Expiry Date', 'Last Audit', 'Contact'].map(
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
            {facilities.map((facility) => (
              <tr key={facility.id} style={{ borderBottom: '1px solid #21262D' }}>
                <td style={{ padding: '14px 16px', fontWeight: 500, color: '#F0F6FC' }}>
                  {facility.name}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: getBaaColor(facility.baaStatus),
                      backgroundColor: `${getBaaColor(facility.baaStatus)}15`,
                      border: `1px solid ${getBaaColor(facility.baaStatus)}30`,
                      padding: '3px 10px',
                      borderRadius: 12,
                    }}
                  >
                    {facility.baaStatus}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#8B949E' }}>
                  {new Date(facility.baaExpiry).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td style={{ padding: '14px 16px', color: '#8B949E' }}>
                  {new Date(facility.lastAudit).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ color: '#C9D1D9', fontSize: 13 }}>{facility.contactPerson}</div>
                  <div style={{ color: '#58A6FF', fontSize: 12 }}>{facility.contactEmail}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
