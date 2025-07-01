import api from './api.service';
import { API_ENDPOINTS } from './api.config';
import { UserProfile, UpdateUserProfile } from './user.service';
import axios from 'axios';

type UserListResponse = UserProfile[] | { $values: UserProfile[] };

export class StaffService {
  static async getStaffProfile(): Promise<UserProfile> {
    try {
      const response = await api.get<UserProfile>(API_ENDPOINTS.USER.GET_STAFF_PROFILE);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching staff profile:', error.message);
      }
      throw error;
    }
  }

  static async updateStaffProfile(profileData: UpdateUserProfile): Promise<UserProfile> {
    try {
      const response = await api.put<UserProfile>(API_ENDPOINTS.USER.UPDATE_STAFF_PROFILE, profileData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error updating staff profile:', error.message);
      }
      throw error;
    }
  }

  static async getAllMembers(): Promise<UserProfile[]> {
    try {
      const response = await api.get<UserListResponse>(API_ENDPOINTS.USER.GET_ALL_MEMBERS);
      const data = response.data;
      if (data && !Array.isArray(data) && data.$values) {
        return data.$values;
      }
      if (Array.isArray(data)) {
        return data;
      }
      console.error("Unexpected response format from getAllMembers:", data);
      return [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching all members:', error.message);
      }
      throw error;
    }
  }
} 