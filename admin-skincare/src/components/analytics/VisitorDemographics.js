import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';

function VisitorDemographics() {
  const data = [
    { subject: '18-24', A: 120, B: 110, fullMark: 150 },
    { subject: '25-34', A: 98, B: 130, fullMark: 150 },
    { subject: '35-44', A: 86, B: 130, fullMark: 150 },
    { subject: '45-54', A: 99, B: 100, fullMark: 150 },
    { subject: '55-64', A: 85, B: 90, fullMark: 150 },
    { subject: '65+', A: 65, B: 85, fullMark: 150 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Visitor Demographics</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar name="Male" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Radar name="Female" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default VisitorDemographics;