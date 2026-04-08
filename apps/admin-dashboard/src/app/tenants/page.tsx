'use client';

import React, { useState } from 'react';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'trial' | 'suspended' | 'cancelled';
  patients: number;
  caregivers: number;
  facilities: number;
  dataRegion: string;
  createdAt: string;
  trialEndsAt?: string;
  monthlyRevenue: number;
}

const tenants: Tenant[] = [
  {
    id: 'ten-1',
    name: 'Sunrise Senior Living',
    slug: 'sunrise',
    plan: 'enterprise',
    status: 'active',
    patients: 247,
    caregivers: 89,
    facilities: 6,
    dataRegion: 'us-east-1',
    createdAt: '2025-08-15',
    monthlyRevenue: 12350,
  },
  {
    id: 'ten-2',
    name: 'Golden Years Care',
    slug: 'goldenyears',
    plan: 'professional',
    status: 'active',
    patients: 124,
    caregivers: 45,
    facilities: 3,
    dataRegion: 'us-west-2',
    createdAt: '2025-10-01',
    monthlyRevenue: 4960,
  },
  {
    id: 'ten-3',
    name: 'Harbor View Memory Center',
    slug: 'harborview',
    plan: 'professional',
    status: 'active',
    patients: 86,
    caregivers: 32,
    facilities: 2,
    dataRegion: 'eu-west-1',
    createdAt: '2025-11-20',
    monthlyRevenue: 3440,
  },
  {
    id: 'ten-4',
    name: 'BrightPath Dementia Services',
    slug: 'brightpath',
    plan: 'starter',
    status: 'trial',
    patients: 18,
    caregivers: 7,
    facilities: 1,
    dataRegion: 'us-east-1',
    createdAt: '2026-03-10',
    trialEndsAt: '2026-04-10',
    monthlyRevenue: 0,
  },
  {
    id: 'ten-5',
    name: 'Pacific Northwest Memory Network',
    slug: 'pnwmemory',
    plan: 'enterprise',
    status: 'active',
    patients: 312,
    caregivers: 118,
    facilities: 8,
    dataRegion: 'us-west-2',
    createdAt: '2025-06-01',
    monthlyRevenue: 18720,
  },
  {
    id: 'ten-6',
    name: 'Legacy Care Partners',
    slug: 'legacycare',
    plan: 'professional',
    status: 'suspended',
    patients: 54,
    caregivers: 20,
    facilities: 2,
    dataRegion: 'us-east-1',
    createdAt: '2025-09-15',
    monthlyRevenue: 0,
  },
];

function getPlanColor(plan: string): string {
  switch (plan) {
    case 'enterprise': return '#A371F7';
    case 'professional': return '#58A6FF';
    case 'starter': return '#3FB950';
    default: return '#8B949E';
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return '#3FB950';
    case 'trial': return '#D29922';
    case 'suspended': return '#F85149';
    case 'cancelled': return '#8B949E';
    default: return '#8B949E';
  }
}

export default function TenantsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'trial' | 'suspended'>('all');

  const filtered = filter === 'all' ? tenants : tenants.filter((t) => t.status === filter);

  const totalPatients = tenants.reduce((s, t) => s + t.patients, 0);
  const totalRevenue = tenants.reduce((s, t) => s + t.monthlyRevenue, 0);
  const activeTenants = tenants.filter((t) => t.status === 'active').length;

  return (
    <div>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#F0F6FC', margin: 0, letterSpacing: '-0.02em' }}>
            Tenants
          </h1>
          <p style={{ fontSize: 14, color: '#8B949E', marginTop: 6 }}>
            Manage multi-tenant organizations, plans, and data isolation.
          </p>
        </div>
        <button style={{ backgroundColor: '#238636', color: '#FFFFFF', border: '1px solid #2EA04366', borderRadius: 6, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          + Onboard Tenant
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Tenants', value: tenants.length, color: '#58A6FF' },
          { label: 'Active', value: activeTenants, color: '#3FB950' },
          { label: 'Total Patients', value: totalPatients.toLocaleString(), color: '#A371F7' },
          { label: 'Monthly Revenue', value: `$${totalRevenue.toLocaleString()}`, color: '#D29922' },
        ].map((stat) => (
          <div key={stat.label} style={{ backgroundColor: '#161B22', border: '1px solid #21262D', borderRadius: 8, padding: '14px 18px' }}>
            <div style={{ fontSize: 12, color: '#8B949E', marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid #21262D' }}>
        {(['all', 'active', 'trial', 'suspended'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              backgroundColor: 'transparent',
              color: filter === tab ? '#F0F6FC' : '#8B949E',
              border: 'none',
              borderBottom: filter === tab ? '2px solid #58A6FF' : '2px solid transparent',
              padding: '10px 16px',
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: filter === tab ? 600 : 400,
              marginBottom: -1,
              textTransform: 'capitalize',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tenant Table */}
      <div style={{ backgroundColor: '#161B22', border: '1px solid #21262D', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #21262D' }}>
              {['Organization', 'Slug', 'Plan', 'Status', 'Patients', 'Staff', 'Facilities', 'Region', 'Revenue', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#8B949E', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #21262D' }}>
                <td style={{ padding: '12px 14px', fontWeight: 500, color: '#F0F6FC' }}>{t.name}</td>
                <td style={{ padding: '12px 14px', color: '#8B949E', fontFamily: 'monospace', fontSize: 12 }}>{t.slug}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: getPlanColor(t.plan), backgroundColor: `${getPlanColor(t.plan)}15`, border: `1px solid ${getPlanColor(t.plan)}30`, padding: '3px 10px', borderRadius: 12, textTransform: 'capitalize' }}>
                    {t.plan}
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: getStatusColor(t.status), display: 'inline-block' }} />
                    <span style={{ fontSize: 12, color: getStatusColor(t.status), textTransform: 'capitalize', fontWeight: 500 }}>
                      {t.status}
                      {t.trialEndsAt && <span style={{ color: '#8B949E', fontWeight: 400 }}> (ends {t.trialEndsAt})</span>}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '12px 14px', color: '#C9D1D9' }}>{t.patients}</td>
                <td style={{ padding: '12px 14px', color: '#C9D1D9' }}>{t.caregivers}</td>
                <td style={{ padding: '12px 14px', color: '#C9D1D9' }}>{t.facilities}</td>
                <td style={{ padding: '12px 14px', color: '#8B949E', fontSize: 12, fontFamily: 'monospace' }}>{t.dataRegion}</td>
                <td style={{ padding: '12px 14px', color: t.monthlyRevenue > 0 ? '#3FB950' : '#6E7681', fontWeight: 600 }}>
                  {t.monthlyRevenue > 0 ? `$${t.monthlyRevenue.toLocaleString()}` : '--'}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{ backgroundColor: 'transparent', color: '#58A6FF', border: '1px solid #30363D', borderRadius: 4, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>
                      Manage
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16, fontSize: 12, color: '#6E7681' }}>
        Showing {filtered.length} of {tenants.length} tenants
      </div>
    </div>
  );
}
