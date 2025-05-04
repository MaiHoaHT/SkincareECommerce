import React from 'react';

function ActivityTable() {
  const activities = [
    { user: 'John Doe', action: 'Created a new product', time: '5 minutes ago' },
    { user: 'Jane Smith', action: 'Updated user profile', time: '10 minutes ago' },
    { user: 'Mike Johnson', action: 'Deleted a post', time: '25 minutes ago' },
    { user: 'Anna Williams', action: 'Submitted a report', time: '1 hour ago' },
    { user: 'Robert Brown', action: 'Changed system settings', time: '2 hours ago' },
  ];

  return (
    <div className="overflow-hidden">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="py-3 px-4 text-sm">{activity.user}</td>
              <td className="py-3 px-4 text-sm">{activity.action}</td>
              <td className="py-3 px-4 text-sm text-gray-500">{activity.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ActivityTable;