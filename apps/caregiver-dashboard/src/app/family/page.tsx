'use client';

const familyMembers = [
  {
    name: 'Lisa Thompson',
    relationship: 'Daughter',
    lastContact: 'Today',
    status: 'active' as const,
    email: 'lisa.thompson@email.com',
    phone: '(555) 123-4567',
    initials: 'LT',
  },
  {
    name: 'Robert Thompson',
    relationship: 'Husband',
    lastContact: 'Yesterday',
    status: 'needs-update' as const,
    email: 'robert.thompson@email.com',
    phone: '(555) 234-5678',
    initials: 'RT',
  },
  {
    name: 'James Thompson',
    relationship: 'Son',
    lastContact: '3 days ago',
    status: 'needs-update' as const,
    email: 'james.thompson@email.com',
    phone: '(555) 345-6789',
    initials: 'JT',
  },
  {
    name: 'Emma Thompson',
    relationship: 'Granddaughter',
    lastContact: '1 week ago',
    status: 'overdue' as const,
    email: 'emma.thompson@email.com',
    phone: '(555) 456-7890',
    initials: 'ET',
  },
];

const quickUpdateTemplates = [
  {
    title: 'Daily Summary',
    icon: '\u2606',
    description: 'Auto-generated overview of patient\'s day including mood, activities, and notable events.',
    color: '#3B82F6',
  },
  {
    title: 'Session Results',
    icon: '\u2261',
    description: 'Cognitive exercise scores, progress trends, and engagement levels from recent sessions.',
    color: '#8B5CF6',
  },
  {
    title: 'Medication Report',
    icon: '\u2695',
    description: 'Medication adherence summary, schedule compliance, and any noted side effects.',
    color: '#10B981',
  },
  {
    title: 'Photo Share',
    icon: '\u25A3',
    description: 'Share a recent moment or activity photo with a brief caption for the family.',
    color: '#F59E0B',
  },
];

function getStatusBadge(status: 'active' | 'needs-update' | 'overdue') {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    active: { bg: '#DCFCE7', color: '#16A34A', label: 'Active' },
    'needs-update': { bg: '#FEF3C7', color: '#D97706', label: 'Needs Update' },
    overdue: { bg: '#FEE2E2', color: '#DC2626', label: 'Overdue' },
  };
  const s = styles[status];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 600,
        background: s.bg,
        color: s.color,
      }}
    >
      {s.label}
    </span>
  );
}

export default function FamilyPage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Family Portal
        </h1>
        <p style={{ fontSize: 15, color: '#64748B', marginTop: 6 }}>
          Keep families informed about their loved ones
        </p>
      </div>

      {/* Patient context */}
      <div
        style={{
          background: '#F0F9FF',
          border: '1px solid #BAE6FD',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#1A7BC4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 600,
            color: '#FFF',
          }}
        >
          MW
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>Margaret Wilson</div>
          <div style={{ fontSize: 13, color: '#64748B' }}>Patient -- 4 family contacts registered</div>
        </div>
      </div>

      {/* Family Members */}
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', marginBottom: 16 }}>
        Family Members
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
          marginBottom: 40,
        }}
      >
        {familyMembers.map((member) => (
          <div
            key={member.name}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              padding: '20px',
              transition: 'box-shadow 0.15s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background:
                    member.status === 'active'
                      ? '#DCFCE7'
                      : member.status === 'needs-update'
                        ? '#FEF3C7'
                        : '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                  fontWeight: 700,
                  color:
                    member.status === 'active'
                      ? '#16A34A'
                      : member.status === 'needs-update'
                        ? '#D97706'
                        : '#DC2626',
                }}
              >
                {member.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>{member.name}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{member.relationship}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              {getStatusBadge(member.status)}
              <span style={{ fontSize: 12, color: '#94A3B8' }}>Last: {member.lastContact}</span>
            </div>

            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 12, marginTop: 4 }}>
              <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>{member.email}</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>{member.phone}</div>
            </div>

            <button
              style={{
                marginTop: 14,
                width: '100%',
                padding: '9px 0',
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                background: member.status === 'overdue' ? '#1A7BC4' : '#F8FAFC',
                color: member.status === 'overdue' ? '#FFFFFF' : '#334155',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {member.status === 'overdue' ? 'Send Update Now' : 'Send Update'}
            </button>
          </div>
        ))}
      </div>

      {/* Quick Update Templates */}
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>
        Quick Update Templates
      </h2>
      <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16, marginTop: 0 }}>
        Select a template to generate and send a family update
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 16,
        }}
      >
        {quickUpdateTemplates.map((template) => (
          <div
            key={template.title}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              padding: '20px',
              cursor: 'pointer',
              transition: 'box-shadow 0.15s, border-color 0.15s',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: `${template.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                marginBottom: 14,
                color: template.color,
              }}
            >
              {template.icon}
            </div>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#0F172A', marginBottom: 6 }}>
              {template.title}
            </div>
            <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>
              {template.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
