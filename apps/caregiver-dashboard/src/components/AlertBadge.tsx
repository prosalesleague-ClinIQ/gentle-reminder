const severityStyles: Record<string, { bg: string; color: string; label: string }> = {
  high: { bg: '#FDECEC', color: '#C0392B', label: 'High' },
  medium: { bg: '#FEF7E0', color: '#B58200', label: 'Medium' },
  low: { bg: '#EBF5FB', color: '#1A7BC4', label: 'Low' },
};

interface AlertBadgeProps {
  severity: 'high' | 'medium' | 'low';
}

export default function AlertBadge({ severity }: AlertBadgeProps) {
  const style = severityStyles[severity];

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        background: style.bg,
        color: style.color,
        letterSpacing: '0.02em',
      }}
    >
      {style.label}
    </span>
  );
}
