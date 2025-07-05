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
  city: string;
  district: string;
  address: string;
  status?: 'Active' | 'Disabled';
}

export interface UpdateUserProfile {
  name?: string;
  phone?: string;
  dob?: string;
  address?: string;
  city?: string;
  district?: string;
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

  static async updateMemberProfile(profileData: UpdateUserProfile): Promise<UserProfile> {
    try {
      const response = await api.put(API_ENDPOINTS.USER.UPDATE_MEMBER_PROFILE, profileData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error updating member profile:', error.message);
      }
      throw error;
    }
  }
}

export default UserService; 