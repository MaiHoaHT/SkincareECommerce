// src/pages/Users.jsx
import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import UserForm from '../components/users/UserForm';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showUserForm, setShowUserForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    // Fetch users on component mount or when pagination/filter changes
    fetchUsers();
  }, [pageIndex, pageSize, filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsersPaging(filter, pageIndex, pageSize);
      setUsers(data.items);
      setTotalRecords(data.totalRecords);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPageIndex(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  const handlePageChange = (newPage) => {
    setPageIndex(newPage);
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
        // Refresh danh sách sau khi xóa
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleAddNew = () => {
    setCurrentUser(null); // Reset currentUser để form trống
    setShowUserForm(true);
  };

  const handleFormSubmit = async (userData) => {
    try {
      if (currentUser) {
        // Update existing user
        await userService.updateUser(currentUser.id, userData);
      } else {
        // Create new user
        await userService.createUser(userData);
      }
      setShowUserForm(false);
      fetchUsers();
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(totalRecords / pageSize);
    const pages = [];
    
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button 
          key={i} 
          onClick={() => handlePageChange(i)}
          className={pageIndex === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(pageIndex - 1)} 
          disabled={pageIndex === 1}
        >
          Prev
        </button>
        {pages}
        <button 
          onClick={() => handlePageChange(pageIndex + 1)}
          disabled={pageIndex === totalPages}
        >
          Next
        </button>
      </div>
    );
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
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Tìm kiếm theo email, tên đăng nhập hoặc số điện thoại" 
            value={filter}
            onChange={handleFilterChange}
          />
          <button onClick={fetchUsers}>Tìm kiếm</button>
        </div>
        
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
      
      {renderPagination()}
      
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