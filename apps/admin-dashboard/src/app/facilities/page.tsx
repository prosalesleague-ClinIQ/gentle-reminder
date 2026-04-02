import React from 'react';
import { facilities } from '@/data/mock';

function getTierColor(tier: string): string {
  switch (tier) {
    case 'Enterprise':
      return '#A371F7';
    case 'Professional':
      return '#58A6FF';
    case 'Standard':
      return '#8B949E';
    default:
      return '#8B949E';
  }
}

function getTierBg(tier: string): string {
  switch (tier) {
    case 'Enterprise':
      return '#A371F715';
    case 'Professional':
      return '#58A6FF15';
    case 'Standard':
      return '#8B949E15';
    default:
      return '#8B949E15';
  }
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#3FB950';
  if (score >= 80) return '#D29922';
  return '#F85149';
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

export default function FacilitiesPage() {
  const totalPatients = facilities.reduce((sum, f) => sum + f.patientCount, 0);
  const totalStaff = facilities.reduce((sum, f) => sum + f.staffCount, 0);
  const avgScore = Math.round(
    facilities.reduce((sum, f) => sum + f.monthlyScore, 0) / facilities.length
  );

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#F0F6FC', margin: 0, letterSpacing: '-0.02em' }}>
            Facilities
          </h1>
          <p style={{ fontSize: 14, color: '#8B949E', marginTop: 6 }}>
            Manage and monitor all facilities on the Gentle Reminder platform.
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
          + Add Facility
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Facilities', value: facilities.length, color: '#58A6FF' },
          { label: 'Total Patients', value: totalPatients, color: '#3FB950' },
          { label: 'Total Staff', value: totalStaff, color: '#A371F7' },
          { label: 'Avg Monthly Score', value: `${avgScore}%`, color: '#D29922' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: '#161B22',
              border: '1px solid #21262D',
              borderRadius: 8,
              padding: '16px 20px',
            }}
          >
            <div style={{ fontSize: 12, color: '#8B949E', marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Facility Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 }}>
        {facilities.map((facility) => (
          <div
            key={facility.id}
            style={{
              backgroundColor: '#161B22',
              border: '1px solid #21262D',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            {/* Card Header */}
            <div
              style={{
                padding: '20px 24px 16px',
                borderBottom: '1px solid #21262D',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#F0F6FC', margin: 0 }}>
                  {facility.name}
                </h3>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: getTierColor(facility.subscriptionTier),
                    backgroundColor: getTierBg(facility.subscriptionTier),
                    border: `1px solid ${getTierColor(facility.subscriptionTier)}30`,
                    padding: '3px 10px',
                    borderRadius: 12,
                  }}
                >
                  {facility.subscriptionTier}
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#8B949E' }}>{facility.location}</div>
              <div style={{ fontSize: 12, color: '#6E7681', marginTop: 2 }}>{facility.address}</div>
            </div>

            {/* Card Stats */}
            <div style={{ padding: '16px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                    Patients
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#F0F6FC' }}>
                    {facility.patientCount}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                    Staff
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#F0F6FC' }}>
                    {facility.staffCount}
                  </div>
                </div>
              </div>

              {/* Monthly Score */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#8B949E' }}>Monthly Score</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: getScoreColor(facility.monthlyScore) }}>
                    {facility.monthlyScore}%
                  </span>
                </div>
                <div style={{ width: '100%', height: 6, backgroundColor: '#21262D', borderRadius: 3 }}>
                  <div
                    style={{
                      width: `${facility.monthlyScore}%`,
                      height: '100%',
                      backgroundColor: getScoreColor(facility.monthlyScore),
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>

              {/* Contact */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: '#8B949E', marginBottom: 4 }}>Contact</div>
                <div style={{ fontSize: 13, color: '#C9D1D9' }}>{facility.contactPerson}</div>
                <div style={{ fontSize: 12, color: '#58A6FF' }}>{facility.contactEmail}</div>
              </div>

              {/* BAA Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 12, color: '#8B949E' }}>BAA Status</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: getBaaColor(facility.baaStatus),
                    backgroundColor: `${getBaaColor(facility.baaStatus)}15`,
                    border: `1px solid ${getBaaColor(facility.baaStatus)}30`,
                    padding: '2px 8px',
                    borderRadius: 10,
                  }}
                >
                  {facility.baaStatus}
                </span>
              </div>

              {/* Active Alerts */}
              {facility.activeAlerts > 0 && (
                <div
                  style={{
                    padding: '8px 12px',
                    backgroundColor: facility.activeAlerts > 3 ? '#F8514915' : '#D2992215',
                    border: `1px solid ${facility.activeAlerts > 3 ? '#F8514930' : '#D2992230'}`,
                    borderRadius: 6,
                    fontSize: 12,
                    color: facility.activeAlerts > 3 ? '#F85149' : '#D29922',
                    marginBottom: 16,
                  }}
                >
                  {facility.activeAlerts} active alert{facility.activeAlerts !== 1 ? 's' : ''} requiring attention
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div
              style={{
                padding: '12px 24px',
                borderTop: '1px solid #21262D',
                display: 'flex',
                gap: 8,
              }}
            >
              <button
                style={{
                  flex: 1,
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
                Manage
              </button>
              <button
                style={{
                  backgroundColor: 'transparent',
                  color: '#8B949E',
                  border: '1px solid #30363D',
                  borderRadius: 6,
                  padding: '8px 12px',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                ...
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Facility Comparison Table */}
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
          Facility Comparison
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 13,
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid #21262D' }}>
                {['Facility', 'Location', 'Patients', 'Staff', 'Tier', 'Score', 'Monthly Cost', 'BAA', 'Alerts'].map(
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
                <tr
                  key={facility.id}
                  style={{ borderBottom: '1px solid #21262D' }}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 500, color: '#F0F6FC' }}>
                    {facility.name}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#8B949E' }}>
                    {facility.location}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#C9D1D9', fontWeight: 600 }}>
                    {facility.patientCount}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#C9D1D9' }}>
                    {facility.staffCount}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: getTierColor(facility.subscriptionTier),
                        backgroundColor: getTierBg(facility.subscriptionTier),
                        border: `1px solid ${getTierColor(facility.subscriptionTier)}30`,
                        padding: '2px 8px',
                        borderRadius: 10,
                      }}
                    >
                      {facility.subscriptionTier}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ color: getScoreColor(facility.monthlyScore), fontWeight: 600 }}>
                      {facility.monthlyScore}%
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#C9D1D9', fontWeight: 500 }}>
                    ${facility.monthlyCost.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: getBaaColor(facility.baaStatus),
                      }}
                    >
                      {facility.baaStatus}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        color: facility.activeAlerts > 3 ? '#F85149' : facility.activeAlerts > 0 ? '#D29922' : '#3FB950',
                        fontWeight: 600,
                      }}
                    >
                      {facility.activeAlerts}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Features Comparison */}
      <div
        style={{
          marginTop: 24,
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
          Feature Access by Facility
        </div>
        <div style={{ padding: 24 }}>
          {facilities.map((facility) => (
            <div key={facility.id} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#C9D1D9', marginBottom: 8 }}>
                {facility.name}
                <span style={{ fontSize: 12, color: '#8B949E', marginLeft: 8 }}>
                  ({facility.subscriptionTier})
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {facility.features.map((feature) => (
                  <span
                    key={feature}
                    style={{
                      fontSize: 11,
                      padding: '4px 10px',
                      borderRadius: 12,
                      backgroundColor: '#21262D',
                      color: '#C9D1D9',
                      border: '1px solid #30363D',
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
