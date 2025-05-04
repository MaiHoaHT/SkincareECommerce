import React from 'react';

function UserTable() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'Inactive' },
    { id: 4, name: 'Anna Williams', email: 'anna@example.com', role: 'User', status: 'Active' },
    { id: 5, name: 'Robert Brown', email: 'robert@example.com', role: 'Editor', status: 'Active' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="py-4 px-4 text-sm">{user.id}</td>
              <td className="py-4 px-4 text-sm">{user.name}</td>
              <td className="py-4 px-4 text-sm">{user.email}</td>
              <td className="py-4 px-4 text-sm">{user.role}</td>
              <td className="py-4 px-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.status}
                </span>
              </td>
              <td className="py-4 px-4 text-sm text-blue-600 hover:text-blue-900">
                <button className="mr-2">Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;