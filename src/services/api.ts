import type { AxiosResponse } from 'axios';
import type {
  User,
  BloodRequest,
  Donor,
  BloodInventory,
  BloodInventoryUnit,
  DashboardStats,
  MonthlyReport,
  DonorStatistics,
  ApiResponse,
  PaginatedResponse,
  SystemLog as SystemLogType
} from '../types/api';
import api, { publicApi } from './api.service';
import { API_ENDPOINTS } from './api.config';

// Helper function to handle API responses
const handleResponse = <T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> => {
  return response.data;
};

// Auth API - Uses the public client for login/register
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await publicApi.post<ApiResponse<{ token: string; user: User }>>('/api/auth/login', { email, password });
    return handleResponse(response);
  },
  register: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await publicApi.post<ApiResponse<User>>('/api/auth/register', userData);
    return handleResponse(response);
  },
  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
  },
};

// Blood Requests API
export const bloodRequestApi = {
  getAll: async (params?: { page?: number; status?: string; search?: string }): Promise<ApiResponse<PaginatedResponse<BloodRequest>>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<BloodRequest>>>('/blood-requests', { params });
    return handleResponse(response);
  },
  getById: async (id: string): Promise<ApiResponse<BloodRequest>> => {
    const response = await api.get<ApiResponse<BloodRequest>>(`/blood-requests/${id}`);
    return handleResponse(response);
  },
  create: async (request: Partial<BloodRequest>): Promise<ApiResponse<BloodRequest>> => {
    const response = await api.post<ApiResponse<BloodRequest>>('/blood-requests', request);
    return handleResponse(response);
  },
  update: async (id: string, request: Partial<BloodRequest>): Promise<ApiResponse<BloodRequest>> => {
    const response = await api.put<ApiResponse<BloodRequest>>(`/blood-requests/${id}`, request);
    return handleResponse(response);
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/blood-requests/${id}`);
    return handleResponse(response);
  },
};

// Donors API
export const donorApi = {
  getAll: async (params?: { page?: number; bloodType?: string; status?: string; search?: string }): Promise<ApiResponse<PaginatedResponse<Donor>>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Donor>>>('/donors', { params });
    return handleResponse(response);
  },
  getById: async (id: string): Promise<ApiResponse<Donor>> => {
    const response = await api.get<ApiResponse<Donor>>(`/donors/${id}`);
    return handleResponse(response);
  },
  create: async (donor: Partial<Donor>): Promise<ApiResponse<Donor>> => {
    const response = await api.post<ApiResponse<Donor>>('/donors', donor);
    return handleResponse(response);
  },
  update: async (id: string, donor: Partial<Donor>): Promise<ApiResponse<Donor>> => {
    const response = await api.put<ApiResponse<Donor>>(`/donors/${id}`, donor);
    return handleResponse(response);
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/donors/${id}`);
    return handleResponse(response);
  },
};

// Inventory API - NEW VERSION
export const inventoryApi = {
  getAll: async (): Promise<ApiResponse<BloodInventoryUnit[]>> => {
    const response = await api.get<ApiResponse<BloodInventoryUnit[]>>(API_ENDPOINTS.BLOOD_INVENTORY.GET_ALL);
    return handleResponse(response);
  },
  getById: async (id: number): Promise<ApiResponse<BloodInventoryUnit>> => {
    const response = await api.get<ApiResponse<BloodInventoryUnit>>(API_ENDPOINTS.BLOOD_INVENTORY.GET_BY_ID(id));
    return handleResponse(response);
  },
  create: async (data: Partial<BloodInventoryUnit>): Promise<ApiResponse<BloodInventoryUnit>> => {
    const response = await api.post<ApiResponse<BloodInventoryUnit>>(API_ENDPOINTS.BLOOD_INVENTORY.CREATE, data);
    return handleResponse(response);
  },
  update: async (id: number, data: Partial<BloodInventoryUnit>): Promise<ApiResponse<BloodInventoryUnit>> => {
    const response = await api.put<ApiResponse<BloodInventoryUnit>>(API_ENDPOINTS.BLOOD_INVENTORY.UPDATE(id), data);
    return handleResponse(response);
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(API_ENDPOINTS.BLOOD_INVENTORY.DELETE(id));
    return handleResponse(response);
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: () => api.get<ApiResponse<DashboardStats>>('/dashboard/stats'),
  getMonthlyReport: async (month: string): Promise<ApiResponse<MonthlyReport>> => {
    const response = await api.get<ApiResponse<MonthlyReport>>(`/dashboard/reports/monthly/${month}`);
    return handleResponse(response);
  },
  getDonorStats: async (): Promise<ApiResponse<DonorStatistics>> => {
    const response = await api.get<ApiResponse<DonorStatistics>>('/dashboard/stats/donors');
    return handleResponse(response);
  },
  getRecentActivity: () => api.get<ApiResponse<BloodRequest[]>>('/dashboard/activity'),
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
  getAllUsers: () => api.get<ApiResponse<PaginatedResponse<User>>>('/admin/users'),
  getUserById: (id: string) => api.get<ApiResponse<User>>(`/admin/users/${id}`),
  updateUser: (id: string, data: Partial<User>) => api.put<ApiResponse<User>>(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete<ApiResponse<void>>(`/admin/users/${id}`),
  getSystemLogs: () => api.get<ApiResponse<PaginatedResponse<SystemLogType>>>('/admin/logs'),
};

// Firebase API
export const firebaseApi = {
  sendResetPassword: (email: string) => publicApi.post<ApiResponse<void>>('/firebase/send-reset-password', email),
}; 