import React from 'react';
import {
  monthlyRevenue,
  subscriptionPlans,
  facilities,
  billingHistory,
} from '@/data/mock';

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

function getStatusColor(status: string): string {
  switch (status) {
    case 'Paid':
      return '#3FB950';
    case 'Pending':
      return '#D29922';
    case 'Failed':
      return '#F85149';
    default:
      return '#8B949E';
  }
}

export default function BillingPage() {
  const totalMonthlyRevenue = facilities.reduce((sum, f) => sum + f.monthlyCost, 0);
  const totalPatients = facilities.reduce((sum, f) => sum + f.patientCount, 0);
  const avgRevenuePerPatient = Math.round(totalMonthlyRevenue / totalPatients);
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue));

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#F0F6FC', margin: 0, letterSpacing: '-0.02em' }}>
          Billing & Subscriptions
        </h1>
        <p style={{ fontSize: 14, color: '#8B949E', marginTop: 6 }}>
          Revenue overview, subscription management, and payment history.
        </p>
      </div>

      {/* Revenue Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Monthly Revenue', value: `$${totalMonthlyRevenue.toLocaleString()}`, color: '#3FB950', sub: '+13.7% vs last month' },
          { label: 'Active Subscriptions', value: facilities.length.toString(), color: '#58A6FF', sub: 'All facilities active' },
          { label: 'Total Patients Billed', value: totalPatients.toString(), color: '#A371F7', sub: '+12 this month' },
          { label: 'Avg Revenue / Patient', value: `$${avgRevenuePerPatient}`, color: '#D29922', sub: 'Per month' },
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
            <div style={{ fontSize: 12, color: '#6E7681', marginTop: 4 }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div
        style={{
          backgroundColor: '#161B22',
          border: '1px solid #21262D',
          borderRadius: 8,
          padding: 24,
          marginBottom: 32,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 600, color: '#F0F6FC', marginBottom: 24 }}>
          Revenue Trend (6 Months)
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 200, paddingBottom: 30, position: 'relative' }}>
          {monthlyRevenue.map((month) => {
            const heightPct = (month.revenue / maxRevenue) * 100;
            return (
              <div key={month.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#C9D1D9' }}>
                  ${(month.revenue / 1000).toFixed(1)}k
                </div>
                <div
                  style={{
                    width: '100%',
                    maxWidth: 60,
                    height: `${heightPct}%`,
                    background: 'linear-gradient(180deg, #58A6FF, #1F6FEB)',
                    borderRadius: '4px 4px 0 0',
                    minHeight: 20,
                    position: 'relative',
                  }}
                />
                <div style={{ fontSize: 11, color: '#8B949E', textAlign: 'center', position: 'absolute', bottom: 0 }}>
                  {month.month}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          {monthlyRevenue.map((m) => (
            <div key={m.month} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: '#8B949E' }}>
              {m.month}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          {monthlyRevenue.map((m) => (
            <div key={m.month} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: '#6E7681' }}>
              {m.patients} patients
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Plans */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#F0F6FC', marginBottom: 16 }}>
          Subscription Plans
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.tier}
              style={{
                backgroundColor: '#161B22',
                border: plan.recommended ? '2px solid #58A6FF' : '1px solid #21262D',
                borderRadius: 8,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {plan.recommended && (
                <div
                  style={{
                    backgroundColor: '#58A6FF',
                    color: '#FFFFFF',
                    fontSize: 11,
                    fontWeight: 700,
                    textAlign: 'center',
                    padding: '4px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Most Popular
                </div>
              )}
              <div style={{ padding: 24 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: getTierColor(plan.tier),
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 8,
                  }}
                >
                  {plan.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 36, fontWeight: 700, color: '#F0F6FC' }}>
                    ${plan.pricePerPatient}
                  </span>
                  <span style={{ fontSize: 14, color: '#8B949E' }}>/patient/mo</span>
                </div>
                <div style={{ fontSize: 12, color: '#6E7681', marginBottom: 20 }}>
                  Billed monthly per active patient
                </div>

                <div style={{ borderTop: '1px solid #21262D', paddingTop: 16 }}>
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 0',
                        fontSize: 13,
                        color: '#C9D1D9',
                      }}
                    >
                      <span style={{ color: '#3FB950', fontSize: 14 }}>&#10003;</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Subscriptions Table */}
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
          Active Subscriptions
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #21262D' }}>
              {['Facility', 'Tier', 'Patients', 'Monthly Cost', 'Next Billing', 'Status'].map(
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
                      color: getTierColor(facility.subscriptionTier),
                      backgroundColor: `${getTierColor(facility.subscriptionTier)}15`,
                      border: `1px solid ${getTierColor(facility.subscriptionTier)}30`,
                      padding: '3px 10px',
                      borderRadius: 12,
                    }}
                  >
                    {facility.subscriptionTier}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#C9D1D9', fontWeight: 600 }}>
                  {facility.patientCount}
                </td>
                <td style={{ padding: '14px 16px', color: '#3FB950', fontWeight: 600 }}>
                  ${facility.monthlyCost.toLocaleString()}
                </td>
                <td style={{ padding: '14px 16px', color: '#8B949E' }}>
                  {new Date(facility.nextBillingDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#3FB950',
                      backgroundColor: '#3FB95015',
                      border: '1px solid #3FB95030',
                      padding: '3px 10px',
                      borderRadius: 12,
                    }}
                  >
                    {facility.billingStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment History */}
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 600, color: '#F0F6FC' }}>
            Payment History
          </span>
          <button
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
            Export CSV
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #21262D' }}>
              {['Invoice', 'Date', 'Facility', 'Amount', 'Method', 'Status'].map(
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
            {billingHistory.map((entry) => (
              <tr key={entry.id} style={{ borderBottom: '1px solid #21262D' }}>
                <td style={{ padding: '14px 16px', color: '#58A6FF', fontWeight: 500, fontFamily: 'monospace', fontSize: 12 }}>
                  {entry.invoiceNumber}
                </td>
                <td style={{ padding: '14px 16px', color: '#8B949E' }}>
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td style={{ padding: '14px 16px', color: '#C9D1D9' }}>
                  {entry.facility}
                </td>
                <td style={{ padding: '14px 16px', color: '#F0F6FC', fontWeight: 600 }}>
                  ${entry.amount.toLocaleString()}
                </td>
                <td style={{ padding: '14px 16px', color: '#8B949E', fontSize: 12 }}>
                  {entry.method}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: getStatusColor(entry.status),
                      backgroundColor: `${getStatusColor(entry.status)}15`,
                      border: `1px solid ${getStatusColor(entry.status)}30`,
                      padding: '3px 10px',
                      borderRadius: 12,
                    }}
                  >
                    {entry.status}
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
