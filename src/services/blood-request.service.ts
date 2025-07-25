import api, { publicApi } from './api.service';
import { API_ENDPOINTS } from './api.config';

// Based on user-provided payload
interface NestedLocation {
  location_id: number;
  latitude: number;
  longitude: number;
}

// This represents the detailed User object we might get from the backend
interface User {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  role: string;
  address: string;
  city: string;
  district: string;
  location_id: number;
  location: NestedLocation;
}

// Interface matching the backend entity for GET requests
export interface BloodRequest {
  request_id: number;
  user_id: number;
  blood_id: number;
  emergency_status: boolean;
  request_date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  // The 'user' object is optional because it might not be included in all API responses,
  // but it's not needed for creating a new request.
  user?: User; 
}

// Data for creating a new request - this MUST match what the backend endpoint expects
export interface CreateBloodRequestData {
    user_id: number;
    blood_id: number;
    emergency_status: boolean;
    request_date: string;
}

// Data for updating a request
export type UpdateBloodRequestData = Partial<Omit<BloodRequest, 'request_id' | 'user'>>;

export interface BloodRequestStatus {
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

export interface NewBloodRequest {
  patient_name: string;
  blood_type: string;
  quantity: number;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  location_id?: number | null;
  status: 'Pending';
}

export class BloodRequestService {
    // This is now a public endpoint
    static async getAllBloodRequests(): Promise<BloodRequest[]> {
        const response = await publicApi.get(API_ENDPOINTS.BLOOD_REQUEST.GET_ALL);
        if (response.data && response.data.$values) {
            return response.data.$values;
        }
        return Array.isArray(response.data) ? response.data : [];
    }

    // This is now a public endpoint
    static async getBloodRequestById(id: number): Promise<BloodRequest> {
        const response = await publicApi.get(API_ENDPOINTS.BLOOD_REQUEST.GET_BY_ID(id));
        return response.data;
    }

    // This requires authentication
    static async createBloodRequest(data: CreateBloodRequestData): Promise<BloodRequest> {
        const response = await api.post<BloodRequest>('/bloodrequest/new', data);
        return response.data;
    }

    // This requires authentication
    static async updateBloodRequest(id: number, data: Partial<UpdateBloodRequestData>): Promise<BloodRequest> {
        const response = await api.put(API_ENDPOINTS.BLOOD_REQUEST.UPDATE(id), data);
        return response.data;
    }

    // This requires authentication
    static async deleteBloodRequest(id: number): Promise<void> {
        await api.delete(API_ENDPOINTS.BLOOD_REQUEST.DELETE(id));
    }

    static async getMemberBloodRequests(): Promise<BloodRequest[]> {
        try {
            const response = await api.get(API_ENDPOINTS.BLOOD_REQUEST.GET_MEMBER_REQUESTS);
            // Handle cases where the response has a $values property
            if (response.data && response.data.$values) {
                return response.data.$values;
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching member blood requests:', error);
            throw error;
        }
    }
} 