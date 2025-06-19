import api from './api.service';
import { API_ENDPOINTS } from './api.config';

export interface BloodRequest {
  id: number;
  user_id: number;
  blood_id: number;
  request_date: string;
  emergency_status: boolean;
  location_id: number;
}

export interface CreateBloodRequest {
  user_id: number;
  blood_id: number;
  emergency_status: boolean;
  location_id: number;
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

export class BloodRequestService {
  static async getAllBloodRequests(): Promise<BloodRequest[]> {
    try {
      const response = await api.get(API_ENDPOINTS.BLOOD_REQUEST.GET_ALL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all blood requests:', error);
      throw error;
    }
  }

  static async getBloodRequestById(id: number): Promise<BloodRequest> {
    try {
      const response = await api.get(API_ENDPOINTS.BLOOD_REQUEST.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching blood request with id ${id}:`, error);
      throw error;
    }
  }

  static async createBloodRequest(data: CreateBloodRequest): Promise<BloodRequest> {
    try {
      const response = await api.post(API_ENDPOINTS.BLOOD_REQUEST.CREATE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating blood request:', error);
      throw error;
    }
  }

  static async updateBloodRequest(id: number, data: Partial<CreateBloodRequest>): Promise<BloodRequest> {
    try {
      const response = await api.put(API_ENDPOINTS.BLOOD_REQUEST.UPDATE(id), data);
      return response.data;
    } catch (error) {
      console.error(`Error updating blood request with id ${id}:`, error);
      throw error;
    }
  }

  static async deleteBloodRequest(id: number): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.BLOOD_REQUEST.DELETE(id));
    } catch (error) {
      console.error(`Error deleting blood request with id ${id}:`, error);
      throw error;
    }
  }
}

export default BloodRequestService; 