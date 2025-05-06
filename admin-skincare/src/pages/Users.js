// src/pages/Users.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { userService } from '../services/userService';
import { setAuthToken } from '../services/api';
import UserForm from '../components/users/UserForm';

const Users = () => {
  const auth = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.access_token) {
      setAuthToken(auth.user.access_token);
      fetchUsers();
    }
  }, [auth.isAuthenticated, auth.user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const userData = await userService.getUser(id);
      setCurrentUser(userData);
      setShowUserForm(true);
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleAddNew = () => {
    setCurrentUser(null);
    setShowUserForm(true);
  };

  const handleFormSubmit = async (userData) => {
    try {
      if (currentUser) {
        await userService.updateUser(currentUser.id, userData);
      } else {
        await userService.createUser(userData);
      }
      setShowUserForm(false);
      fetchUsers();
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  if (loading && !users.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <div className="flex items-center gap-2.5 px-5 py-4 bg-red-50 rounded text-red-600">
          <span className="text-xl">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold text-gray-800">Danh sách người dùng</h1>
        <button 
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          onClick={handleAddNew}
        >
          <span className="text-xl">+</span>
          Thêm mới
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Username</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Họ và tên</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Số điện thoại</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Ngày sinh</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Ngày tạo</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{user.userName}</td>
                  <td className="px-4 py-3">{user.firstName} {user.lastName}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phoneNumber}</td>
                  <td className="px-4 py-3">{new Date(user.dob).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{new Date(user.createDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        onClick={() => handleEdit(user.id)}
                      >
                        <span>✏️</span>
                        Sửa
                      </button>
                      <button 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                        onClick={() => handleDelete(user.id)}
                      >
                        <span>🗑️</span>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {showUserForm && (
        <UserForm 
          user={currentUser} 
          onSubmit={handleFormSubmit} 
          onCancel={() => setShowUserForm(false)} 
        />
      )}
    </div>
  );
};

export default Users;