import React from 'react';

function QuickStats() {
  const stats = [
    { label: 'Active Users', percentage: 75, color: 'bg-blue-600' },
    { label: 'Server Load', percentage: 42, color: 'bg-green-500' },
    { label: 'Memory Usage', percentage: 60, color: 'bg-yellow-500' },
    { label: 'Disk Space', percentage: 85, color: 'bg-red-500' }
  ];

  return (
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <div key={index}>
          <h3 className="text-sm text-gray-500">{stat.label}</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className={`${stat.color} h-2.5 rounded-full`} style={{ width: `${stat.percentage}%` }}></div>
          </div>
          <p className="text-right text-sm mt-1">{stat.percentage}%</p>
        </div>
      ))}
    </div>
  );
}

export default QuickStats;