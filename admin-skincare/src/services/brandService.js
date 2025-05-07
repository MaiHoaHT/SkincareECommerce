import api from './api';
import BrandModel from '../models/BrandModel';

export const brandService = {
  // Lấy danh sách brands
  getBrands: async () => {
    try {
      const response = await api.get('/api/Brand');
      return BrandModel.fromApiList(response.data);
    } catch (error) {
      console.error('Error in getBrands:', error);
      throw error;
    }
  },

  // Lấy danh sách brands phân trang và tìm kiếm
  getBrandsPaging: async (filter = "", pageIndex = 1, pageSize = 10) => {
    try {
      let response;
      
      if (filter && filter.trim() !== '') {
        // Nếu có filter thì gọi API filter
        const params = {
          pageIndex,
          pageSize,
          filter: filter.trim()
        };
        response = await api.get('/api/Brand/filter', { params });
      } else {
        // Nếu không có filter thì gọi API thường
        response = await api.get('/api/Brand');
      }

      return {
        items: BrandModel.fromApiList(response.data.items || response.data),
        totalCount: response.data.totalCount || response.data.length,
        pageIndex: response.data.pageIndex || 1,
        pageSize: response.data.pageSize || response.data.length
      };
    } catch (error) {
      console.error('Error in getBrandsPaging:', error);
      if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors.join(', '));
      }
      throw new Error('Không thể tải danh sách thương hiệu. Vui lòng thử lại sau.');
    }
  },

  // Lấy chi tiết brand
  getBrand: async (id) => {
    try {
      const response = await api.get(`/api/Brand/${id}`);
      return BrandModel.fromApi(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy thương hiệu');
      }
      console.error('Error in getBrand:', error);
      throw error;
    }
  },

  // Tạo brand mới
  createBrand: async (brandData) => {
    try {
      const response = await api.post('/api/Brand', brandData);
      return BrandModel.fromApi(response.data);
    } catch (error) {
      if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors.join(', '));
      }
      console.error('Error in createBrand:', error);
      throw error;
    }
  },

  // Cập nhật brand
  updateBrand: async (id, brandData) => {
    try {
      const response = await api.put(`/api/Brand/${id}`, brandData);
      return BrandModel.fromApi(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy thương hiệu');
      }
      if (error.response?.status === 400) {
        throw new Error('Dữ liệu không hợp lệ');
      }
      console.error('Error in updateBrand:', error);
      throw error;
    }
  },

  // Xóa brand
  deleteBrand: async (id) => {
    try {
      const response = await api.delete(`/api/Brand/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy thương hiệu');
      }
      console.error('Error in deleteBrand:', error);
      throw error;
    }
  }
}; 