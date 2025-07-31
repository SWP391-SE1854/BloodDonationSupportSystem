import api from './api.service';
import { API_ENDPOINTS } from './api.config';
import axios from 'axios';

export interface UserProfile {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  role: string;
  blood_type?: string;
  city: string;
  district: string;
  address: string;
}

// Type for the payload when updating a user's profile
export interface UpdateUserProfile {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  role: string;
  city: string;
  district: string;
  address: string;
}

export class UserService {
  static async getMemberProfile(): Promise<UserProfile> {
    try {
      const response = await api.get(API_ENDPOINTS.USER.GET_MEMBER_PROFILE);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching member profile:', error.message);
      }
      throw error;
    }
  }

  static async updateMemberProfile(data: { updatedUser: UpdateUserProfile }): Promise<UserProfile> {
    const response = await api.put<UserProfile>(API_ENDPOINTS.USER.UPDATE_MEMBER_PROFILE, data);
    return response.data;
  }
}

export default UserService; 