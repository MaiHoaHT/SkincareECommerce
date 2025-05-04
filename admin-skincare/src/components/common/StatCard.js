import React from 'react';

function StatCard({ title, value, change, trend, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 rounded-full bg-gray-100">{icon}</div>
      </div>
      <div className="flex items-baseline">
        <p className="text-2xl font-bold">{value}</p>
        <p className={`ml-2 text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </p>
      </div>
    </div>
  );
}

export default StatCard;