import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './api.config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface BloodRequest {
  id: number;
  userId: string;
  bloodType: string;
  units: number;
  urgency: string;
  status: string;
  hospitalName: string;
  location: string;
  contactNumber: string;
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBloodRequestRequest {
  bloodType: string;
  units: number;
  urgency: string;
  hospitalName: string;
  location: string;
  contactNumber: string;
  additionalNotes?: string;
}

export interface UpdateBloodRequestRequest {
  units?: number;
  urgency?: string;
  status?: string;
  hospitalName?: string;
  location?: string;
  contactNumber?: string;
  additionalNotes?: string;
}

export const bloodRequestService = {
  async getBloodRequests(): Promise<BloodRequest[]> {
    const response = await api.get(API_ENDPOINTS.GET_BLOOD_REQUESTS);
    return response.data;
  },

  async getBloodRequestById(id: number): Promise<BloodRequest> {
    const response = await api.get(API_ENDPOINTS.GET_BLOOD_REQUEST_BY_ID(id));
    return response.data;
  },

  async createBloodRequest(data: CreateBloodRequestRequest): Promise<BloodRequest> {
    const response = await api.post(API_ENDPOINTS.CREATE_BLOOD_REQUEST, data);
    return response.data;
  },

  async updateBloodRequest(id: number, data: UpdateBloodRequestRequest): Promise<BloodRequest> {
    const response = await api.put(API_ENDPOINTS.UPDATE_BLOOD_REQUEST(id), data);
    return response.data;
  },

  async deleteBloodRequest(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.DELETE_BLOOD_REQUEST(id));
  },
}; 