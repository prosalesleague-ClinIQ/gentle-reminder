const colors = {
  blue: { bg: '#EBF5FB', border: '#1A7BC4', text: '#1A7BC4' },
  green: { bg: '#EBF5EC', border: '#3D8158', text: '#3D8158' },
  amber: { bg: '#FEF7E0', border: '#E5A300', text: '#B58200' },
  red: { bg: '#FDECEC', border: '#C0392B', text: '#C0392B' },
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: keyof typeof colors;
  icon?: string;
}

export default function StatCard({ title, value, subtitle, color = 'blue', icon }: StatCardProps) {
  const palette = colors[color];

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 12,
        padding: '24px 28px',
        borderLeft: `4px solid ${palette.border}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        minWidth: 200,
      }}
    >
      {icon && (
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: palette.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      )}
      <div>
        <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, color: palette.text, lineHeight: 1.2, marginTop: 4 }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>{subtitle}</div>
        )}
      </div>
    </div>
  );
}
