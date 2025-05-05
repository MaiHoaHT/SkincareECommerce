// src/services/userService.js
import api from './api';

export const userService = {
  // Lấy danh sách người dùng
  getUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },

  // Lấy danh sách người dùng phân trang và tìm kiếm
  getUsersPaging: async (filter = "", pageIndex = 1, pageSize = 10) => {
    const response = await api.get(`/api/users/filter?filter=${filter}&pageIndex=${pageIndex}&pageSize=${pageSize}`);
    return response.data;
  },

  // Lấy chi tiết người dùng theo ID
  getUser: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  // Tạo người dùng mới
  createUser: async (userData) => {
    const response = await api.post('/api/users', userData);
    return response.data;
  },

  // Cập nhật người dùng
  updateUser: async (id, userData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  // Đổi mật khẩu người dùng
  changePassword: async (id, passwordData) => {
    const response = await api.put(`/api/users/${id}/change-password`, passwordData);
    return response.data;
  },

  // Xóa người dùng
  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },
  
  // Lấy menu theo quyền của user
  getUserMenu: async (userId) => {
    const response = await api.get(`/api/users/${userId}/menu`);
    return response.data;
  }
};