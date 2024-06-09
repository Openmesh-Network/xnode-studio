'use client'

import React from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const data = [
  { date: '12.11.2023', rewards: 200 },
  { date: '13.11.2023', rewards: 500 },
  { date: '14.11.2023', rewards: 500 },
  { date: '15.11.2023', rewards: 250 },
  { date: '16.11.2023', rewards: 300 },
  { date: '17.11.2023', rewards: 500 },
  { date: '18.11.2023', rewards: 330 },
  { date: '19.11.2023', rewards: 200 },
  { date: '20.11.2023', rewards: 600 },
  { date: '21.11.2023', rewards: 220 },
]

const RewardsChart = () => (
  <ResponsiveContainer width="100%" height={250}>
    <LineChart
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 0,
        bottom: 5,
      }}
    >
      <XAxis
        dataKey="date"
        tickLine={false}
        tick={{ fontWeight: '600', fontSize: '0.875rem', color: '#000' }}
      />
      <YAxis tickLine={false} tick={false} />
      <Tooltip />
      <Line
        type="linear"
        dataKey="rewards"
        stroke="#888"
        dot={{ r: 4, fill: '#888' }}
      />
    </LineChart>
  </ResponsiveContainer>
)

export default RewardsChart
