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

export interface BloodRequest {
  request_id: number;
  user_id: number;
  blood_id: number;
  emergency_status: boolean;
  request_date: string;
  location_id: number;
  user?: User; 
  location?: NestedLocation;
}

// This is the data we collect from the form
export type BloodRequestFormData = Pick<BloodRequest, 'user_id' | 'blood_id' | 'emergency_status' | 'location_id'>;

// The service will now expect the full object for creation
export const createBloodRequest = async (data: BloodRequest): Promise<BloodRequest> => {
    const response = await api.post(API_ENDPOINTS.BLOOD_REQUESTS.CREATE, data);
    return response.data;
};

// Update can also use the full object, though we only send a subset of fields
export type UpdateBloodRequestData = Omit<BloodRequest, 'request_date' | 'user' | 'location'>;


export const getAllBloodRequests = async (): Promise<BloodRequest[]> => {
    const response = await publicApi.get(API_ENDPOINTS.BLOOD_REQUESTS.GET_ALL);
    return response.data;
};

export const getBloodRequestById = async (id: number): Promise<BloodRequest> => {
    const response = await publicApi.get(API_ENDPOINTS.BLOOD_REQUESTS.GET_BY_ID(id));
    return response.data;
};

export const updateBloodRequest = async (id: number, data: UpdateBloodRequestData): Promise<BloodRequest> => {
    const response = await api.put(API_ENDPOINTS.BLOOD_REQUESTS.UPDATE(id), data);
    return response.data;
};

export const deleteBloodRequest = async (id: number): Promise<void> => {
    await api.delete(API_ENDPOINTS.BLOOD_REQUESTS.DELETE(id));
}; 