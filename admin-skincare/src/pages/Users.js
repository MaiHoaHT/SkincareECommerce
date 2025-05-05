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
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h1>Quản lý người dùng</h1>
      
      <div className="user-controls">
        <button className="add-button" onClick={handleAddNew}>Thêm mới</button>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Ngày sinh</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.userName}</td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{new Date(user.dob).toLocaleDateString()}</td>
              <td>{new Date(user.createDate).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(user.id)}>Sửa</button>
                <button onClick={() => handleDelete(user.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
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