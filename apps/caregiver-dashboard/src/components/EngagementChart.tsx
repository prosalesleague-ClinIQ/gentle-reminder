'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function generateEngagementData(days: number = 14) {
  const data = [];
  const now = new Date();

  let responseTime = 2800 + Math.random() * 600;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Gradual improvement trend with daily noise
    responseTime = Math.max(1200, Math.min(4500, responseTime + (Math.random() - 0.55) * 300));

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      responseTime: Math.round(responseTime),
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
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ color: '#1A7BC4', fontWeight: 500 }}>Avg Response</span>
        <span style={{ fontWeight: 600, color: '#1F2937' }}>
          {(payload[0].value / 1000).toFixed(1)}s
        </span>
      </div>
    </div>
  );
};

export default function EngagementChart() {
  const data = generateEngagementData();

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
        Avg Response Time
      </h2>
      <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 20px' }}>
        Last 14 days (milliseconds)
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1A7BC4" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#1A7BC4" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            tickFormatter={(v) => `${(v / 1000).toFixed(1)}s`}
            width={40}
            domain={['dataMin - 200', 'dataMax + 200']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="responseTime"
            stroke="#1A7BC4"
            strokeWidth={2}
            fill="url(#responseGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#1A7BC4', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
