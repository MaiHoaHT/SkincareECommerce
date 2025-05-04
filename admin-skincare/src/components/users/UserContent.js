import React from 'react';
import UserTable from './UserTable';

function UserContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">User List</h2>
          <p className="text-gray-500">Manage your users and their access</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add New User
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <UserTable />
        </div>
      </div>
    </div>
  );
}

export default UserContent;