// src/services/functionService.js
import api from './api';
import FunctionModel from '../models/FunctionModel';

export const functionService = {
  // Lấy danh sách functions
  getFunctions: async () => {
    try {
      const response = await api.get('/api/functions');
      return FunctionModel.fromApiList(response.data);
    } catch (error) {
      console.error('Error in getFunctions:', error);
      throw error;
    }
  },

  // Lấy danh sách functions phân trang và tìm kiếm
  getFunctionsPaging: async (filter = "", pageIndex = 1, pageSize = 10) => {
    try {
      const queryParams = new URLSearchParams({
        pageIndex: pageIndex.toString(),
        pageSize: pageSize.toString()
      });
      
      if (filter && filter.trim() !== '') {
        queryParams.append('filter', filter.trim());
      }
      
      const response = await api.get(`/api/functions/filter?${queryParams.toString()}`);
      return FunctionModel.fromApiList(response.data);
    } catch (error) {
      console.error('Error in getFunctionsPaging:', error);
      throw error;
    }
  },

  // Lấy chi tiết function theo ID
  getFunction: async (id) => {
    try {
      const response = await api.get(`/api/functions/${id}`);
      return FunctionModel.fromApi(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy chức năng');
      }
      console.error('Error in getFunction:', error);
      throw error;
    }
  },

  // Lấy danh sách functions theo parent ID
  getFunctionsByParentId: async (functionId) => {
    try {
      const response = await api.get(`/api/functions/${functionId}/parents`);
      return FunctionModel.fromApiList(response.data);
    } catch (error) {
      console.error('Error in getFunctionsByParentId:', error);
      throw error;
    }
  },

  // Tạo function mới
  createFunction: async (functionData) => {
    try {
      const response = await api.post('/api/functions', functionData.toJSON());
      return FunctionModel.fromApi(response.data);
    } catch (error) {
      if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors.join(', '));
      }
      console.error('Error in createFunction:', error);
      throw error;
    }
  },

  // Cập nhật function
  updateFunction: async (id, functionData) => {
    try {
      const response = await api.put(`/api/functions/${id}`, functionData.toJSON());
      return FunctionModel.fromApi(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy chức năng');
      }
      if (error.response?.status === 400) {
        throw new Error('Dữ liệu không hợp lệ');
      }
      console.error('Error in updateFunction:', error);
      throw error;
    }
  },

  // Xóa function
  deleteFunction: async (id) => {
    try {
      const response = await api.delete(`/api/functions/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy chức năng');
      }
      console.error('Error in deleteFunction:', error);
      throw error;
    }
  },

  // Lấy danh sách commands trong function
  getCommandsInFunction: async (functionId) => {
    try {
      const response = await api.get(`/api/functions/${functionId}/commands`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy chức năng');
      }
      console.error('Error in getCommandsInFunction:', error);
      throw error;
    }
  },

  // Thêm commands vào function
  addCommandsToFunction: async (functionId, commandIds, addToAllFunctions = false) => {
    try {
      const response = await api.post(`/api/functions/${functionId}/commands`, {
        commandIds,
        addToAllFunctions
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy chức năng');
      }
      if (error.response?.status === 400) {
        throw new Error('Command đã tồn tại trong chức năng');
      }
      console.error('Error in addCommandsToFunction:', error);
      throw error;
    }
  },

  // Xóa commands khỏi function
  removeCommandsFromFunction: async (functionId, commandIds) => {
    try {
      const response = await api.delete(`/api/functions/${functionId}/commands`, {
        params: { commandIds }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy chức năng');
      }
      if (error.response?.status === 400) {
        throw new Error('Command không tồn tại trong chức năng');
      }
      console.error('Error in removeCommandsFromFunction:', error);
      throw error;
    }
  },

  // Lấy danh sách quyền của function
  getFunctionPermissions: async (functionId) => {
    try {
      const response = await api.get(`/api/Functions/${functionId}/permissions`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy function');
      }
      console.error('Error in getFunctionPermissions:', error);
      throw error;
    }
  },

  // Cập nhật quyền của function
  updateFunctionPermissions: async (functionId, permissions) => {
    try {
      const response = await api.put(`/api/Functions/${functionId}/permissions`, {
        permissions: permissions.map(p => ({
          functionId: p.functionId,
          commandId: p.commandId
        }))
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy function');
      }
      if (error.response?.status === 400) {
        throw new Error('Dữ liệu không hợp lệ');
      }
      console.error('Error in updateFunctionPermissions:', error);
      throw error;
    }
  }
};