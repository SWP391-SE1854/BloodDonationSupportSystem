import api, { publicApi } from './api.service';
import { API_ENDPOINTS } from './api.config';

// Based on user-provided payload
interface NestedLocation {
  location_id: number;
  latitude: number;
  longitude: number;
}

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

// Interface matching the C# backend entity
export interface BloodRequest {
  request_id: number;
  user_id: number | null;
  blood_id: string | null;
  emergency_status: boolean;
  request_date: string;
  location_id: number | null;
  user?: User; 
  location?: NestedLocation;
}

// Data for creating a new request
export type BloodRequestFormData = Pick<BloodRequest, 'user_id' | 'blood_id' | 'emergency_status' | 'location_id'>;

// Data for updating a request
export type UpdateBloodRequestData = Partial<Omit<BloodRequest, 'request_id' | 'request_date' | 'user' | 'location'>>;

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
        return response.data;
    }

    // This is now a public endpoint
    static async getBloodRequestById(id: number): Promise<BloodRequest> {
        const response = await publicApi.get(API_ENDPOINTS.BLOOD_REQUEST.GET_BY_ID(id));
        return response.data;
    }

    // This requires authentication
    static async createBloodRequest(data: BloodRequestFormData): Promise<BloodRequest> {
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