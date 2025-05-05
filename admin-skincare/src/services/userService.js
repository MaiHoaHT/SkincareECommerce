// src/services/userService.js
import api from './api';

export const userService = {
  // Lấy danh sách người dùng
  getUsers: async () => {
    try {
      const response = await api.get('/api/Users');
      return response.data;
    } catch (error) {
      console.error('Error in getUsers:', error);
      throw error;
    }
  },

  // Lấy danh sách người dùng phân trang và tìm kiếm
  getUsersPaging: async (filter = "", pageIndex = 1, pageSize = 10) => {
    try {
      // Đảm bảo các tham số có giá trị hợp lệ
      const params = {
        filter: filter || null,  // Gửi null thay vì chuỗi rỗng
        pageIndex: parseInt(pageIndex),  // Đảm bảo là số nguyên
        pageSize: parseInt(pageSize)     // Đảm bảo là số nguyên
      };
      
      // Gọi API với các tham số đã được xử lý
      const response = await api.get('/api/Users/filter', { 
        params,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error in getUsersPaging:', error);
      throw error;
    }
  },

  // Lấy chi tiết người dùng theo ID
  getUser: async (id) => {
    const response = await api.get(`/api/Users/${id}`);
    return response.data;
  },

  // Tạo người dùng mới
  createUser: async (userData) => {
    const response = await api.post('/api/Users', userData);
    return response.data;
  },

  // Cập nhật người dùng
  updateUser: async (id, userData) => {
    const response = await api.put(`/api/Users/${id}`, userData);
    return response.data;
  },

  // Đổi mật khẩu người dùng
  changePassword: async (id, passwordData) => {
    const response = await api.put(`/api/Users/${id}/change-password`, passwordData);
    return response.data;
  },

  // Xóa người dùng
  deleteUser: async (id) => {
    const response = await api.delete(`/api/Users/${id}`);
    return response.data;
  },
  
  // Lấy menu theo quyền của user
  getUserMenu: async (userId) => {
    const response = await api.get(`/api/Users/${userId}/menu`);
    return response.data;
  }
};