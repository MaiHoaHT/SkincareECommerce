import api from './api';
import CategoryModel from '../models/CategoryModel';

export const categoryService = {
  // Lấy danh sách categories
  getCategories: async () => {
    try {
      const response = await api.get('/api/Categories');
      return CategoryModel.fromApiList(response.data);
    } catch (error) {
      console.error('Error in getCategories:', error);
      throw error;
    }
  },

  // Lấy danh sách categories phân trang và tìm kiếm
  getCategoriesPaging: async (filter = "", pageIndex = 1, pageSize = 10) => {
    try {
      let response;
      
      if (filter && filter.trim() !== '') {
        // Nếu có filter thì gọi API filter
        const params = {
          pageIndex,
          pageSize,
          filter: filter.trim()
        };
        response = await api.get('/api/Categories/filter', { params });
      } else {
        // Nếu không có filter thì gọi API thường
        response = await api.get('/api/Categories');
      }

      return {
        items: CategoryModel.fromApiList(response.data.items || response.data),
        totalCount: response.data.totalCount || response.data.length,
        pageIndex: response.data.pageIndex || 1,
        pageSize: response.data.pageSize || response.data.length
      };
    } catch (error) {
      console.error('Error in getCategoriesPaging:', error);
      if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors.join(', '));
      }
      throw new Error('Không thể tải danh sách danh mục. Vui lòng thử lại sau.');
    }
  },

  // Lấy chi tiết category
  getCategory: async (id) => {
    try {
      const response = await api.get(`/api/Categories/${id}`);
      return CategoryModel.fromApi(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy danh mục');
      }
      console.error('Error in getCategory:', error);
      throw error;
    }
  },

  // Tạo category mới
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/api/Categories', categoryData.toJSON());
      return CategoryModel.fromApi(response.data);
    } catch (error) {
      if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors.join(', '));
      }
      console.error('Error in createCategory:', error);
      throw error;
    }
  },

  // Cập nhật category
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/api/Categories/${id}`, categoryData.toJSON());
      return CategoryModel.fromApi(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy danh mục');
      }
      if (error.response?.status === 400) {
        throw new Error('Dữ liệu không hợp lệ');
      }
      console.error('Error in updateCategory:', error);
      throw error;
    }
  },

  // Xóa category
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/api/Categories/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy danh mục');
      }
      console.error('Error in deleteCategory:', error);
      throw error;
    }
  },

  // Lấy danh sách sub-categories
  getSubCategories: async (parentId) => {
    try {
      const response = await api.get(`/api/Categories/${parentId}/subcategories`);
      return CategoryModel.fromApiList(response.data);
    } catch (error) {
      console.error('Error in getSubCategories:', error);
      throw error;
    }
  },

  // Lấy danh sách parent categories
  getParentCategories: async () => {
    try {
      const response = await api.get('/api/Categories/parents');
      return CategoryModel.fromApiList(response.data);
    } catch (error) {
      console.error('Error in getParentCategories:', error);
      throw error;
    }
  }
}; 