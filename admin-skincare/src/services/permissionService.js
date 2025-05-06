import api from './api';
import PermissionModel from '../models/PermissionModel';

export const permissionService = {
  // Lấy danh sách quyền hạn với các action tương ứng cho mỗi chức năng
  getCommandViews: async () => {
    try {
      const response = await api.get('/api/permissions');
      return PermissionModel.fromApiList(response.data);
    } catch (error) {
      console.error('Error in getCommandViews:', error);
      throw error;
    }
  }
}; 