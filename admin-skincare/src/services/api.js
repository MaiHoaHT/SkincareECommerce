// src/services/api.js
import axios from 'axios';

const API_URL = 'https://localhost:7261'; // Bỏ /api ở đây vì nó đã được thêm trong các service

// Tạo instance của axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
});

// Hàm để set token cho các request
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Interceptor để xử lý lỗi 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;