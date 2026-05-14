import axios from 'axios';
import { useUserStore } from '../store/user';
import router from '../router';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 20000,
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
  const userStore = useUserStore();
  // Do not send token for login or register endpoints
  const isAuthRequest = config.url.includes('/auth/login') || config.url.includes('/auth/register');
  if (userStore.token && !isAuthRequest) {
    config.headers.Authorization = `Bearer ${userStore.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use((response) => {
  return response.data;
}, (error) => {
  const isAuthRequest = error.config && (error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register'));
  
  if (error.response && error.response.status === 401 && !isAuthRequest) {
    // Token expired or invalid - only redirect if NOT already on login page
    const userStore = useUserStore();
    userStore.logout();
    router.push('/login');
  }
  
  // Return the actual error message from backend if available
  const message =
    error.code === 'ECONNABORTED'
      ? '请求超时，请检查网络连接后重试'
      : error.response?.data?.detail || error.response?.data?.msg || error.message;
  return Promise.reject(new Error(message));
});

export default api;
