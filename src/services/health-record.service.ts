import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './api.config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface HealthRecord {
  record_id: number;
  user_id: number;
  weight: number;
  height: number;
  blood_type: string | null;
  allergies: string | null;
  medication: string | null;
  last_donation: string;
  eligibility_status: boolean | null;
  donation_count: number;
}

export const healthRecordService = {
  async getUserHealthRecord(userId: string): Promise<HealthRecord> {
    const response = await api.get(API_ENDPOINTS.GET_HEALTH_RECORD_BY_USER_ID(userId));
    return response.data;
  },

  async createHealthRecord(data: Partial<HealthRecord>): Promise<HealthRecord> {
    const response = await api.post(API_ENDPOINTS.CREATE_HEALTH_RECORD, data);
    return response.data;
  },

  async updateHealthRecord(id: number, data: Partial<HealthRecord>): Promise<HealthRecord> {
    const response = await api.put(`/healthrecord/${id}`, data);
    return response.data;
  },
}; 