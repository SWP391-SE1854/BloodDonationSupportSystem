import axios, { AxiosInstance } from 'axios';
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
    // Do not overwrite the Authorization header if it's already set.
    // This is crucial for the firebase-login flow which sets its own header.
    if (config.headers.Authorization) {
      return config;
    }
    
    // For all other requests, get the JWT token from localStorage and attach it.
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
    // Check if the error is a 401 Unauthorized
    if (error.response?.status === 401) {
      console.log("Caught 401 Unauthorized error. Token may be invalid or expired. Redirecting to login.");

      // The token is invalid or expired.
      // Clear the user's session from local storage.
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to the login page to force re-authentication.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }

      // Return a new promise that never resolves to prevent further actions.
      return new Promise(() => {});
    }
    
    // Log any other errors
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    });
    
    return Promise.reject(error);
  }
);

export const publicApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 