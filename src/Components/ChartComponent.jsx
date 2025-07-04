import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

function ChartComponent({ pair, historicalData }) {
  // historicalData: [{ time, price }]
  return (
    <div className='chart-wrapper'>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={historicalData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--text-secondary)" />
          <XAxis
            dataKey="time"
            stroke="var(--text-secondary)"
            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
            label={{ position: 'insideBottom', offset: -5, fill: 'var(--text-primary)', fontSize: 13 }}
          />
          <YAxis
            stroke="var(--text-secondary)"
            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
            tickFormatter={v => `$${v}`}
            label={{ value: 'Price (USD)', angle: -90, position: 'insideLeft', fill: 'var(--text-primary)', fontSize: 13 }}
          />
          <Tooltip wrapperStyle={{ className: 'coinbase-tooltip' }} formatter={v => `$${v}`} />
          <Line type="monotone" dataKey="price" stroke="#ec9fb7" strokeWidth={2} dot={false} name={`${pair} Price (USD)`} fillOpacity={0.2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartComponent;
