import axios from 'axios';
import { API_TIMEOUT } from '../config/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5081/api',
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const firebaseToken = localStorage.getItem('firebaseToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (firebaseToken) {
      config.headers.Authorization = `Bearer ${firebaseToken}`;
    }
    
    console.log('Axios request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
      baseURL: config.baseURL
    });
    
    return config;
  },
  (error) => {
    console.error('Request  error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    if (error.response?.status === 401) {
      // Clear tokens on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('firebaseToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 