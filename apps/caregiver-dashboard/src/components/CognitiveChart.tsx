'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

function generateCognitiveData(days: number = 30, seed?: string) {
  const data = [];
  const now = new Date();

  // Base values with slight randomness
  let orientation = 72 + Math.random() * 8;
  let identity = 65 + Math.random() * 8;
  let memory = 55 + Math.random() * 10;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Subtle drift with small daily variance
    orientation = Math.min(100, Math.max(30, orientation + (Math.random() - 0.45) * 3));
    identity = Math.min(100, Math.max(25, identity + (Math.random() - 0.48) * 3.5));
    memory = Math.min(100, Math.max(20, memory + (Math.random() - 0.5) * 4));

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      Orientation: Math.round(orientation),
      Identity: Math.round(identity),
      Memory: Math.round(memory),
    });
  }

  return data;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        padding: '10px 14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        fontSize: 13,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6, color: '#374151' }}>{label}</div>
      {payload.map((entry: any) => (
        <div
          key={entry.name}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            padding: '2px 0',
          }}
        >
          <span style={{ color: entry.color, fontWeight: 500 }}>{entry.name}</span>
          <span style={{ fontWeight: 600, color: '#1F2937' }}>{entry.value}%</span>
        </div>
      ))}
    </div>
  );
};

interface CognitiveChartProps {
  title?: string;
  days?: number;
}

export default function CognitiveChart({ title = 'Cognitive Score Trends', days = 30 }: CognitiveChartProps) {
  const data = generateCognitiveData(days);

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <h2 style={{ fontSize: 17, fontWeight: 600, margin: '0 0 4px', color: '#1F2937' }}>
        {title}
      </h2>
      <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 20px' }}>
        Last {days} days
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            interval={Math.floor(days / 6)}
          />
          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            tickFormatter={(v) => `${v}%`}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 13, paddingBottom: 8 }}
          />
          <Line
            type="monotone"
            dataKey="Orientation"
            stroke="#1A7BC4"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="Identity"
            stroke="#3D8158"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="Memory"
            stroke="#E5A300"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
