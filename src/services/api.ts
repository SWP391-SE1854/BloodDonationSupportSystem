import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  User,
  BloodRequest,
  Donor,
  BloodInventory,
  DashboardStats,
  MonthlyReport,
  DonorStatistics,
  ApiResponse,
  PaginatedResponse,
  SystemLog as SystemLogType
} from '../types/api';
import { API_BASE_URL } from '@/config/api';
import api from './api.service';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function to handle API responses
const handleResponse = <T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> => {
  return response.data;
};

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await apiClient.post<ApiResponse<{ token: string; user: User }>>('/auth/login', { email, password });
    return handleResponse(response);
  },
  register: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<ApiResponse<User>>('/auth/register', userData);
    return handleResponse(response);
  },
  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
  },
};

// Blood Requests API
export const bloodRequestApi = {
  getAll: async (params?: { page?: number; status?: string; search?: string }): Promise<ApiResponse<PaginatedResponse<BloodRequest>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<BloodRequest>>>('/blood-requests', { params });
    return handleResponse(response);
  },
  getById: async (id: string): Promise<ApiResponse<BloodRequest>> => {
    const response = await apiClient.get<ApiResponse<BloodRequest>>(`/blood-requests/${id}`);
    return handleResponse(response);
  },
  create: async (request: Partial<BloodRequest>): Promise<ApiResponse<BloodRequest>> => {
    const response = await apiClient.post<ApiResponse<BloodRequest>>('/blood-requests', request);
    return handleResponse(response);
  },
  update: async (id: string, request: Partial<BloodRequest>): Promise<ApiResponse<BloodRequest>> => {
    const response = await apiClient.put<ApiResponse<BloodRequest>>(`/blood-requests/${id}`, request);
    return handleResponse(response);
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/blood-requests/${id}`);
    return handleResponse(response);
  },
};

// Donors API
export const donorApi = {
  getAll: async (params?: { page?: number; bloodType?: string; status?: string; search?: string }): Promise<ApiResponse<PaginatedResponse<Donor>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Donor>>>('/donors', { params });
    return handleResponse(response);
  },
  getById: async (id: string): Promise<ApiResponse<Donor>> => {
    const response = await apiClient.get<ApiResponse<Donor>>(`/donors/${id}`);
    return handleResponse(response);
  },
  create: async (donor: Partial<Donor>): Promise<ApiResponse<Donor>> => {
    const response = await apiClient.post<ApiResponse<Donor>>('/donors', donor);
    return handleResponse(response);
  },
  update: async (id: string, donor: Partial<Donor>): Promise<ApiResponse<Donor>> => {
    const response = await apiClient.put<ApiResponse<Donor>>(`/donors/${id}`, donor);
    return handleResponse(response);
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/donors/${id}`);
    return handleResponse(response);
  },
};

// Inventory API
export const inventoryApi = {
  getAll: async (): Promise<ApiResponse<BloodInventory[]>> => {
    const response = await apiClient.get<ApiResponse<BloodInventory[]>>('/inventory');
    return handleResponse(response);
  },
  update: async (type: string, units: number): Promise<ApiResponse<BloodInventory>> => {
    const response = await apiClient.put<ApiResponse<BloodInventory>>(`/inventory/${type}`, { units });
    return handleResponse(response);
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: () => apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats'),
  getMonthlyReport: async (month: string): Promise<ApiResponse<MonthlyReport>> => {
    const response = await apiClient.get<ApiResponse<MonthlyReport>>(`/dashboard/reports/monthly/${month}`);
    return handleResponse(response);
  },
  getDonorStats: async (): Promise<ApiResponse<DonorStatistics>> => {
    const response = await apiClient.get<ApiResponse<DonorStatistics>>('/dashboard/stats/donors');
    return handleResponse(response);
  },
  getRecentActivity: () => apiClient.get<ApiResponse<BloodRequest[]>>('/dashboard/activity'),
};

// System Log type
interface SystemLog {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

// Admin API
export const adminApi = {
  getAllUsers: () => apiClient.get<ApiResponse<PaginatedResponse<User>>>('/admin/users'),
  getUserById: (id: string) => apiClient.get<ApiResponse<User>>(`/admin/users/${id}`),
  updateUser: (id: string, data: Partial<User>) => apiClient.put<ApiResponse<User>>(`/admin/users/${id}`, data),
  deleteUser: (id: string) => apiClient.delete<ApiResponse<void>>(`/admin/users/${id}`),
  getSystemLogs: () => apiClient.get<ApiResponse<PaginatedResponse<SystemLogType>>>('/admin/logs'),
};

// Firebase API
export const firebaseApi = {
  sendResetPassword: (email: string) => apiClient.post<ApiResponse<void>>('/firebase/send-reset-password', email),
}; 