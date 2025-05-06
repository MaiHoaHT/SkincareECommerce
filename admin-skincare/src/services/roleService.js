// src/services/roleService.js
import api from './api';
import RoleModel from '../models/RoleModel';

export const roleService = {
  // Lấy danh sách roles
  getRoles: async () => {
    try {
      const response = await api.get('/api/Roles');
      return RoleModel.fromApiList(response.data);
    } catch (error) {
      console.error('Error in getRoles:', error);
      throw error;
    }
  },

  // Lấy danh sách roles phân trang và tìm kiếm
  getRolesPaging: async (filter = "", pageIndex = 1, pageSize = 10) => {
    try {
      const queryParams = new URLSearchParams({
        pageIndex: pageIndex.toString(),
        pageSize: pageSize.toString()
      });
      
      if (filter && filter.trim() !== '') {
        queryParams.append('filter', filter.trim());
      }
      
      const response = await api.get(`/api/Roles/filter?${queryParams.toString()}`);
      return RoleModel.fromApiList(response.data);
    } catch (error) {
      console.error('Error in getRolesPaging:', error);
      throw error;
    }
  },

  // Lấy chi tiết role theo ID
  getRole: async (id) => {
    try {
      const response = await api.get(`/api/Roles/${id}`);
      return RoleModel.fromApi(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy vai trò');
      }
      console.error('Error in getRole:', error);
      throw error;
    }
  },

  // Tạo role mới
  createRole: async (roleData) => {
    try {
      const response = await api.post('/api/Roles', roleData.toJSON());
      return RoleModel.fromApi(response.data);
    } catch (error) {
      if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors.join(', '));
      }
      console.error('Error in createRole:', error);
      throw error;
    }
  },

  // Cập nhật role
  updateRole: async (id, roleData) => {
    try {
      const response = await api.put(`/api/Roles/${id}`, roleData.toJSON());
      return RoleModel.fromApi(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy vai trò');
      }
      if (error.response?.status === 400) {
        throw new Error('Dữ liệu không hợp lệ');
      }
      console.error('Error in updateRole:', error);
      throw error;
    }
  },

  // Xóa role
  deleteRole: async (id) => {
    try {
      const response = await api.delete(`/api/Roles/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy vai trò');
      }
      console.error('Error in deleteRole:', error);
      throw error;
    }
  },

  // Lấy danh sách quyền của role
  getRolePermissions: async (roleId) => {
    try {
      const response = await api.get(`/api/Roles/${roleId}/permissions`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy role');
      }
      console.error('Error in getRolePermissions:', error);
      throw error;
    }
  },

  // Cập nhật quyền của role
  updateRolePermissions: async (roleId, permissions) => {
    try {
      const response = await api.put(`/api/Roles/${roleId}/permissions`, {
        permissions: permissions.map(p => ({
          functionId: p.functionId,
          commandId: p.commandId
        }))
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy role');
      }
      if (error.response?.status === 400) {
        throw new Error('Dữ liệu không hợp lệ');
      }
      console.error('Error in updateRolePermissions:', error);
      throw error;
    }
  }
};