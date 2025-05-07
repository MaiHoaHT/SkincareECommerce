import api from './api';
import ProductModel from '../models/ProductModel';

export const productService = {
  // Lấy danh sách sản phẩm
  getProducts: async () => {
    try {
      const response = await api.get('/api/Products');
      return ProductModel.fromApiList(response.data);
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    }
  },
  getProductsPaging: async (filter = "", pageIndex = 1, pageSize = 10) => {
    try {
      let response;
      
      if (filter && filter.trim() !== '') {
        // Nếu có filter thì gọi API filter
        const params = {
          pageIndex,
          pageSize,
          filter: filter.trim()
        };
        response = await api.get('/api/Products/filter', { params });
      } else {
        // Nếu không có filter thì gọi API thường
        response = await api.get('/api/Products');
      }

      return {
        items: ProductModel.fromApiList(response.data.items || response.data),
        totalCount: response.data.totalCount || response.data.length,
        pageIndex: response.data.pageIndex || 1,
        pageSize: response.data.pageSize || response.data.length
      };
    } catch (error) {
      console.error('Error in getProductsPaging:', error);
      if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors.join(', '));
      }
      throw new Error('Không thể tải danh sách thương hiệu. Vui lòng thử lại sau.');
    }
  },
  // Lấy chi tiết sản phẩm theo ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/api/Products/${id}`);
      return ProductModel.fromApi(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy sản phẩm');
      }
      console.error('Error in getProductById:', error);
      throw error;
    }
  },

  // Lấy danh sách sản phẩm theo danh mục
  getProductsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/api/Products/category/${categoryId}`);
      return ProductModel.fromApiList(response.data);
    } catch (error) {
      console.error('Error in getProductsByCategory:', error);
      throw error;
    }
  },

  // Lấy danh sách sản phẩm theo thương hiệu
  getProductsByBrand: async (brandId) => {
    try {
      const response = await api.get(`/api/Products/brand/${brandId}`);
      return ProductModel.fromApiList(response.data);
    } catch (error) {
      console.error('Error in getProductsByBrand:', error);
      throw error;
    }
  },

  // Tạo sản phẩm mới
  createProduct: async (productData) => {
    try {
      const response = await api.post('/api/Products', productData.toJSON());
      return ProductModel.fromApi(response.data);
    } catch (error) {
      if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors.join(', '));
      }
      console.error('Error in createProduct:', error);
      throw error;
    }
  },

  // Cập nhật sản phẩm
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/api/Products/${id}`, productData.toJSON());
      return ProductModel.fromApi(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy sản phẩm');
      }
      if (error.response?.status === 400) {
        throw new Error('Dữ liệu không hợp lệ');
      }
      console.error('Error in updateProduct:', error);
      throw error;
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/api/Products/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy sản phẩm');
      }
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  }
}; 