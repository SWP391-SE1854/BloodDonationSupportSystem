import axios from 'axios';
import { environment } from '../config/environment';
import { auth } from '@/config/firebase';
import { API_BASE_URL } from '@/config/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL, // Use API_BASE_URL from config
  withCredentials: false, // Changed to false for CORS
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*' // Attempt to add CORS headers
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Get the JWT token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error but don't redirect
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export default api; 