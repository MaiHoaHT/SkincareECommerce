import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function TrafficOverview() {
  const data = [
    { name: 'Jan', visits: 4000, pageViews: 2400 },
    { name: 'Feb', visits: 3000, pageViews: 1398 },
    { name: 'Mar', visits: 2000, pageViews: 9800 },
    { name: 'Apr', visits: 2780, pageViews: 3908 },
    { name: 'May', visits: 1890, pageViews: 4800 },
    { name: 'Jun', visits: 2390, pageViews: 3800 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Traffic Overview</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="visits" stroke="#3b82f6" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="pageViews" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TrafficOverview;