'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

function generateSessionData(days: number = 14) {
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const completed = Math.floor(Math.random() * 6) + 3;
    const abandoned = Math.floor(Math.random() * 3);

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      Completed: completed,
      Abandoned: abandoned,
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
          <span style={{ color: entry.fill, fontWeight: 500 }}>{entry.name}</span>
          <span style={{ fontWeight: 600, color: '#1F2937' }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function SessionChart() {
  const data = generateSessionData();

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        height: '100%',
      }}
    >
      <h2 style={{ fontSize: 17, fontWeight: 600, margin: '0 0 4px', color: '#1F2937' }}>
        Sessions per Day
      </h2>
      <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 20px' }}>
        Last 14 days
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            interval={1}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            allowDecimals={false}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 13, paddingBottom: 8 }}
          />
          <Bar
            dataKey="Completed"
            fill="#3D8158"
            radius={[4, 4, 0, 0]}
            barSize={14}
          />
          <Bar
            dataKey="Abandoned"
            fill="#E5A300"
            radius={[4, 4, 0, 0]}
            barSize={14}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
