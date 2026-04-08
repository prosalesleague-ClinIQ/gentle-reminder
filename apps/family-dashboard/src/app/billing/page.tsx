'use client';

import { billingPlan, invoices } from '../../data/mock';

const plans = [
  {
    name: 'Family Care Basic',
    price: 29.99,
    features: ['15 sessions/month', '5 GB storage', '2 family members', 'Email support'],
    current: false,
  },
  {
    name: 'Family Care Plus',
    price: 49.99,
    features: ['30 sessions/month', '10 GB storage', '5 family members', 'Priority support', 'Photo sharing', 'Voice messages'],
    current: true,
  },
  {
    name: 'Family Care Premium',
    price: 79.99,
    features: ['Unlimited sessions', '50 GB storage', '10 family members', '24/7 support', 'Video calls', 'Custom exercises', 'Clinician access'],
    current: false,
  },
];

export default function BillingPage() {
  const usagePercent = (n: number, total: number) => Math.round((n / total) * 100);

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2937', margin: '0 0 8px 0' }}>Billing</h1>
      <p style={{ fontSize: 16, color: '#6B7280', marginTop: 0, marginBottom: 32 }}>
        Manage your subscription and payment details
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>

        {/* Current Plan Card */}
        <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', borderRadius: 12, padding: 28, color: '#FFF', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
          <div style={{ fontSize: 13, fontWeight: 500, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Plan</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{billingPlan.name}</div>
          <div style={{ fontSize: 36, fontWeight: 800, marginTop: 12 }}>
            ${billingPlan.price}<span style={{ fontSize: 16, fontWeight: 400, opacity: 0.7 }}>/{billingPlan.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
          </div>
          <div style={{ marginTop: 16, fontSize: 14, opacity: 0.8 }}>
            Renews on {new Date(billingPlan.renewalDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Usage Summary */}
        <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 20px 0' }}>Usage Summary</h2>
          {[
            { label: 'Sessions', used: billingPlan.sessionsUsed, total: billingPlan.sessionsIncluded, unit: '' },
            { label: 'Storage', used: billingPlan.storageUsedGb, total: billingPlan.storageGb, unit: ' GB' },
            { label: 'Family Members', used: billingPlan.usersActive, total: billingPlan.usersIncluded, unit: '' },
          ].map((item) => {
            const pct = usagePercent(item.used, item.total);
            return (
              <div key={item.label} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: 14, color: '#6B7280' }}>
                    {item.used}{item.unit} / {item.total}{item.unit}
                  </span>
                </div>
                <div style={{ height: 8, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: pct > 80 ? '#F59E0B' : '#7C3AED',
                      borderRadius: 4,
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>

        {/* Invoice History */}
        <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 20px 0' }}>Invoice History</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B7280', fontWeight: 600, fontSize: 13 }}>Date</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B7280', fontWeight: 600, fontSize: 13 }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B7280', fontWeight: 600, fontSize: 13 }}>Status</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: '#6B7280', fontWeight: 600, fontSize: 13 }}></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px', color: '#374151' }}>
                    {new Date(inv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '12px', color: '#374151', fontWeight: 500 }}>${inv.amount.toFixed(2)}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: 10,
                        fontSize: 12,
                        fontWeight: 600,
                        background: inv.status === 'paid' ? '#ECFDF5' : inv.status === 'pending' ? '#FFFBEB' : '#FEF2F2',
                        color: inv.status === 'paid' ? '#059669' : inv.status === 'pending' ? '#D97706' : '#DC2626',
                      }}
                    >
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <a href={inv.downloadUrl} style={{ color: '#7C3AED', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment Method */}
        <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 20px 0' }}>Payment Method</h2>
          <div
            style={{
              padding: '20px 24px',
              borderRadius: 10,
              border: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 48,
                  height: 32,
                  borderRadius: 6,
                  background: '#1E40AF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                VISA
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 500, color: '#374151' }}>Visa ending in 4242</div>
                <div style={{ fontSize: 13, color: '#9CA3AF' }}>Expires 08/2028</div>
              </div>
            </div>
            <button
              style={{
                padding: '8px 16px',
                background: '#F3F4F6',
                border: 'none',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                color: '#374151',
                cursor: 'pointer',
              }}
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Plan Comparison */}
      <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 24px 0' }}>Compare Plans</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                padding: 24,
                borderRadius: 12,
                border: plan.current ? '2px solid #7C3AED' : '1px solid #E5E7EB',
                background: plan.current ? '#FAF5FF' : '#FFF',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {plan.current && (
                <span
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#7C3AED',
                    color: '#FFF',
                    padding: '4px 14px',
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Current Plan
                </span>
              )}
              <div style={{ fontSize: 18, fontWeight: 600, color: '#374151', marginTop: plan.current ? 8 : 0 }}>
                {plan.name}
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#7C3AED', margin: '12px 0' }}>
                ${plan.price}<span style={{ fontSize: 14, fontWeight: 400, color: '#9CA3AF' }}>/mo</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0', textAlign: 'left' }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ fontSize: 14, color: '#4B5563', padding: '6px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#10B981', fontWeight: 700 }}>{'\u2713'}</span> {f}
                  </li>
                ))}
              </ul>
              {!plan.current && (
                <button
                  style={{
                    width: '100%',
                    padding: '10px 0',
                    border: '2px solid #7C3AED',
                    background: 'transparent',
                    color: '#7C3AED',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: 8,
                  }}
                >
                  Switch Plan
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
