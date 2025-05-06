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
      // Tạo query string thủ công để đảm bảo format đúng
      const queryParams = new URLSearchParams({
        pageIndex: pageIndex.toString(),
        pageSize: pageSize.toString()
      });
      
      // Thêm filter vào query string nếu có
      if (filter && filter.trim() !== '') {
        queryParams.append('filter', filter.trim());
      }
      
      // Gọi API với query string đã được format
      const response = await api.get(`/api/Users/filter?${queryParams.toString()}`, {
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
    try {
      const response = await api.get(`/api/Users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getUser:', error);
      throw error;
    }
  },

  // Tạo người dùng mới
  createUser: async (userData) => {
    try {
      const response = await api.post('/api/Users', userData);
      return response.data;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  },

  // Cập nhật người dùng
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/api/Users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  },

  // Đổi mật khẩu người dùng
  changePassword: async (id, passwordData) => {
    try {
      const response = await api.put(`/api/Users/${id}/change-password`, passwordData);
      return response.data;
    } catch (error) {
      console.error('Error in changePassword:', error);
      throw error;
    }
  },

  // Xóa người dùng
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/api/Users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  },

  // Lấy menu theo quyền của user
  getUserMenu: async (userId) => {
    try {
      const response = await api.get(`/api/Users/${userId}/menu`);
      return response.data;
    } catch (error) {
      console.error('Error in getUserMenu:', error);
      throw error;
    }
  }
};