// src/services/api.js
import axios from 'axios';
import { useAuth } from 'react-oidc-context';

const API_URL = 'https://localhost:7261/api'; // URL của API backend

// Tạo instance của axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor để thêm access token vào mỗi request
api.interceptors.request.use(
  async (config) => {
    const auth = useAuth();
    if (auth.isAuthenticated) {
      const token = auth.user?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý lỗi 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      const auth = useAuth();
      await auth.removeUser();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;