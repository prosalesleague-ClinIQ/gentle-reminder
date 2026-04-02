'use client';

import React, { useState } from 'react';
import { users, type UserRole, type UserStatus } from '@/data/mock';

function getRoleColor(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '#F85149';
    case 'clinician':
      return '#58A6FF';
    case 'caregiver':
      return '#3FB950';
    case 'family':
      return '#D29922';
    default:
      return '#8B949E';
  }
}

function getRoleBg(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '#F8514915';
    case 'clinician':
      return '#58A6FF15';
    case 'caregiver':
      return '#3FB95015';
    case 'family':
      return '#D2992215';
    default:
      return '#8B949E15';
  }
}

function getStatusColor(status: UserStatus): string {
  switch (status) {
    case 'active':
      return '#3FB950';
    case 'inactive':
      return '#8B949E';
    case 'suspended':
      return '#F85149';
    default:
      return '#8B949E';
  }
}

function formatLastLogin(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type FilterTab = 'all' | UserRole;

export default function UsersPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const filteredUsers =
    activeFilter === 'all'
      ? users
      : users.filter((u) => u.role === activeFilter);

  const roleCounts = {
    all: users.length,
    admin: users.filter((u) => u.role === 'admin').length,
    clinician: users.filter((u) => u.role === 'clinician').length,
    caregiver: users.filter((u) => u.role === 'caregiver').length,
    family: users.filter((u) => u.role === 'family').length,
  };

  const activeCount = users.filter((u) => u.status === 'active').length;
  const inactiveCount = users.filter((u) => u.status === 'inactive').length;
  const suspendedCount = users.filter((u) => u.status === 'suspended').length;
  const twoFaCount = users.filter((u) => u.twoFactorEnabled).length;

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All Users' },
    { key: 'admin', label: 'Admins' },
    { key: 'clinician', label: 'Clinicians' },
    { key: 'caregiver', label: 'Caregivers' },
    { key: 'family', label: 'Family' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#F0F6FC', margin: 0, letterSpacing: '-0.02em' }}>
            Users
          </h1>
          <p style={{ fontSize: 14, color: '#8B949E', marginTop: 6 }}>
            Manage user accounts, roles, and permissions across all facilities.
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
          + Add User
        </button>
      </div>

      {/* User Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Users', value: users.length, color: '#58A6FF' },
          { label: 'Active', value: activeCount, color: '#3FB950' },
          { label: 'Inactive', value: inactiveCount, color: '#8B949E' },
          { label: 'Suspended', value: suspendedCount, color: '#F85149' },
          { label: '2FA Enabled', value: twoFaCount, color: '#A371F7' },
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

      {/* Role Breakdown */}
      <div
        style={{
          backgroundColor: '#161B22',
          border: '1px solid #21262D',
          borderRadius: 8,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: '#F0F6FC', marginBottom: 16 }}>
          Users by Role
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {(
            [
              { role: 'admin' as UserRole, label: 'Administrators' },
              { role: 'clinician' as UserRole, label: 'Clinicians' },
              { role: 'caregiver' as UserRole, label: 'Caregivers' },
              { role: 'family' as UserRole, label: 'Family Members' },
            ] as const
          ).map(({ role, label }) => {
            const count = roleCounts[role];
            const pct = Math.round((count / users.length) * 100);
            return (
              <div key={role} style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: '#C9D1D9' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: getRoleColor(role) }}>
                    {count}
                  </span>
                </div>
                <div style={{ width: '100%', height: 6, backgroundColor: '#21262D', borderRadius: 3 }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      backgroundColor: getRoleColor(role),
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          marginBottom: 16,
          borderBottom: '1px solid #21262D',
          paddingBottom: 0,
        }}
      >
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            style={{
              backgroundColor: 'transparent',
              color: activeFilter === tab.key ? '#F0F6FC' : '#8B949E',
              border: 'none',
              borderBottom: activeFilter === tab.key ? '2px solid #58A6FF' : '2px solid transparent',
              padding: '10px 16px',
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: activeFilter === tab.key ? 600 : 400,
              marginBottom: -1,
            }}
          >
            {tab.label}
            <span
              style={{
                marginLeft: 6,
                fontSize: 11,
                backgroundColor: activeFilter === tab.key ? '#58A6FF20' : '#21262D',
                color: activeFilter === tab.key ? '#58A6FF' : '#8B949E',
                padding: '1px 7px',
                borderRadius: 10,
              }}
            >
              {roleCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* User Table */}
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
              {['User', 'Email', 'Role', 'Facility', 'Status', '2FA', 'Last Login', 'Actions'].map(
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
            {filteredUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #21262D' }}>
                {/* User */}
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: `${getRoleColor(user.role)}20`,
                        border: `1px solid ${getRoleColor(user.role)}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 600,
                        color: getRoleColor(user.role),
                        flexShrink: 0,
                      }}
                    >
                      {user.avatar}
                    </div>
                    <span style={{ fontWeight: 500, color: '#F0F6FC' }}>{user.name}</span>
                  </div>
                </td>

                {/* Email */}
                <td style={{ padding: '12px 16px', color: '#58A6FF', fontSize: 12 }}>
                  {user.email}
                </td>

                {/* Role */}
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: getRoleColor(user.role),
                      backgroundColor: getRoleBg(user.role),
                      border: `1px solid ${getRoleColor(user.role)}30`,
                      padding: '3px 10px',
                      borderRadius: 12,
                      textTransform: 'capitalize',
                    }}
                  >
                    {user.role}
                  </span>
                </td>

                {/* Facility */}
                <td style={{ padding: '12px 16px', color: user.facility ? '#C9D1D9' : '#6E7681', fontSize: 12 }}>
                  {user.facility || 'Global'}
                </td>

                {/* Status */}
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(user.status),
                        display: 'inline-block',
                      }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        color: getStatusColor(user.status),
                        textTransform: 'capitalize',
                        fontWeight: 500,
                      }}
                    >
                      {user.status}
                    </span>
                  </div>
                </td>

                {/* 2FA */}
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 12, color: user.twoFactorEnabled ? '#3FB950' : '#6E7681' }}>
                    {user.twoFactorEnabled ? 'Enabled' : 'Off'}
                  </span>
                </td>

                {/* Last Login */}
                <td style={{ padding: '12px 16px', color: '#8B949E', fontSize: 12 }}>
                  {formatLastLogin(user.lastLogin)}
                </td>

                {/* Actions */}
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      style={{
                        backgroundColor: 'transparent',
                        color: '#58A6FF',
                        border: '1px solid #30363D',
                        borderRadius: 4,
                        padding: '4px 10px',
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        backgroundColor: 'transparent',
                        color: '#8B949E',
                        border: '1px solid #30363D',
                        borderRadius: 4,
                        padding: '4px 10px',
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      ...
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div style={{ marginTop: 16, fontSize: 12, color: '#6E7681', display: 'flex', justifyContent: 'space-between' }}>
        <span>
          Showing {filteredUsers.length} of {users.length} users
        </span>
        <span>Last synced: April 1, 2026 08:15 AM</span>
      </div>
    </div>
  );
}
