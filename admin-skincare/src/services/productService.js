import api from './api';
import ProductModel from '../models/ProductModel';

export const productService = {
  // Lấy danh sách sản phẩm
  getProducts: async () => {
    try {
      const response = await api.get('/api/products');
      return ProductModel.fromApiList(response.data);
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    }
  },

  // Lấy chi tiết sản phẩm theo ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/api/products/${id}`);
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
      const response = await api.get(`/api/products/category/${categoryId}`);
      return ProductModel.fromApiList(response.data);
    } catch (error) {
      console.error('Error in getProductsByCategory:', error);
      throw error;
    }
  },

  // Lấy danh sách sản phẩm theo thương hiệu
  getProductsByBrand: async (brandId) => {
    try {
      const response = await api.get(`/api/products/brand/${brandId}`);
      return ProductModel.fromApiList(response.data);
    } catch (error) {
      console.error('Error in getProductsByBrand:', error);
      throw error;
    }
  },

  // Tạo sản phẩm mới
  createProduct: async (productData) => {
    try {
      const response = await api.post('/api/products', productData.toJSON());
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
      const response = await api.put(`/api/products/${id}`, productData.toJSON());
      return response.data;
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
      const response = await api.delete(`/api/products/${id}`);
      return ProductModel.fromApi(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy sản phẩm');
      }
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  }
}; 