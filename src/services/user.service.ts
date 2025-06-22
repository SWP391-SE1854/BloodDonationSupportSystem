import api from './api.service';
import { API_ENDPOINTS } from './api.config';
import { jwtDecode } from 'jwt-decode';

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
}

export interface UpdateUserProfile {
  name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  address?: string;
  city?: string;
  district?: string;
  role?: string;
}

interface JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  exp: number;
  iss: string;
  aud: string;
}

export class UserService {
  // Helper method to get user ID from JWT token
  private static getUserIdFromToken(): number {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log('JWT Token decoded:', decoded);
      
      // Try to parse the nameidentifier field as a number
      const userId = parseInt(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
      if (!isNaN(userId)) {
        return userId;
      }
      
      // If nameidentifier is not a number, it might be a string ID or email
      console.log('NameIdentifier field is not a number, trying alternative approach');
      
      // For now, let's use a placeholder ID since the C# controller gets the real ID from the token
      // The controller doesn't actually use the URL parameter, it gets the user ID from the JWT token
      return 1; // Placeholder ID - the controller will use the token's user ID anyway
      
    } catch (error) {
      console.error('Failed to decode token:', error);
      throw new Error('Invalid authentication token');
    }
  }

  // Alternative method to get user ID from profile data
  private static async getUserIdFromProfile(): Promise<number> {
    try {
      const profile = await this.getMemberProfile();
      return profile.user_id;
    } catch (error) {
      console.error('Failed to get user ID from profile:', error);
      throw new Error('Could not retrieve user ID');
    }
  }

  // Get member profile
  static async getMemberProfile(): Promise<UserProfile> {
    try {
      const response = await api.get(API_ENDPOINTS.USER.GET_MEMBER_PROFILE);
      return response.data;
    } catch (error) {
      console.error('Error fetching member profile:', error);
      throw error;
    }
  }

  // Update member profile
  static async updateMemberProfile(profileData: UpdateUserProfile): Promise<UserProfile> {
    try {
      // Try to get user ID from token first, fallback to profile data
      let userId: number;
      try {
        userId = this.getUserIdFromToken();
      } catch (error) {
        console.log('Failed to get user ID from token, trying profile data:', error);
        userId = await this.getUserIdFromProfile();
      }
      
      const response = await api.put(API_ENDPOINTS.USER.UPDATE_MEMBER_PROFILE(userId), profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating member profile:', error);
      throw error;
    }
  }

  // Get staff profile
  static async getStaffProfile(): Promise<UserProfile> {
    try {
      console.log('Calling staff profile endpoint:', API_ENDPOINTS.USER.GET_STAFF_PROFILE);
      const response = await api.get(API_ENDPOINTS.USER.GET_STAFF_PROFILE);
      console.log('Staff profile response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching staff profile:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      // Fallback: try to use member profile endpoint if staff endpoint fails
      console.log('Staff profile endpoint failed, trying member profile as fallback...');
      try {
        const fallbackResponse = await api.get(API_ENDPOINTS.USER.GET_MEMBER_PROFILE);
        console.log('Fallback member profile response:', fallbackResponse.data);
        return fallbackResponse.data;
      } catch (fallbackError: any) {
        console.error('Fallback also failed:', fallbackError);
        throw error; // Throw the original error
      }
    }
  }

  // Update staff profile
  static async updateStaffProfile(profileData: UpdateUserProfile): Promise<UserProfile> {
    try {
      console.log('Calling staff profile update endpoint:', API_ENDPOINTS.USER.UPDATE_STAFF_PROFILE);
      const response = await api.put(API_ENDPOINTS.USER.UPDATE_STAFF_PROFILE, profileData);
      console.log('Staff profile update response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating staff profile:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      // Fallback: try to use member profile update endpoint if staff endpoint fails
      console.log('Staff profile update endpoint failed, trying member profile update as fallback...');
      try {
        let userId: number;
        try {
          userId = this.getUserIdFromToken();
        } catch (tokenError) {
          console.log('Failed to get user ID from token, trying profile data:', tokenError);
          userId = await this.getUserIdFromProfile();
        }
        
        const fallbackResponse = await api.put(API_ENDPOINTS.USER.UPDATE_MEMBER_PROFILE(userId), profileData);
        console.log('Fallback member profile update response:', fallbackResponse.data);
        return fallbackResponse.data;
      } catch (fallbackError: any) {
        console.error('Fallback also failed:', fallbackError);
        throw error; // Throw the original error
      }
    }
  }

  // Get all members (for staff)
  static async getAllMembers(): Promise<UserProfile[]> {
    try {
      const response = await api.get(API_ENDPOINTS.USER.GET_ALL_MEMBERS);
      return response.data;
    } catch (error) {
      console.error('Error fetching all members:', error);
      throw error;
    }
  }

  // Get all users (for admin)
  static async getAllUsers(): Promise<UserProfile[]> {
    try {
      const response = await api.get(API_ENDPOINTS.USER.GET_ALL_USERS);
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  // Get user by ID (for admin)
  static async getUserById(id: number): Promise<UserProfile> {
    try {
      const response = await api.get(API_ENDPOINTS.USER.GET_USER_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  // Update user (for admin)
  static async updateUser(id: number, profileData: UpdateUserProfile): Promise<UserProfile> {
    try {
      const response = await api.put(API_ENDPOINTS.USER.UPDATE_USER(id), profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Get profile based on user role
  static async getProfileByRole(role: string): Promise<UserProfile> {
    switch (role.toLowerCase()) {
      case 'member':
      case 'donor':
        return this.getMemberProfile();
      case 'staff':
        return this.getStaffProfile();
      default:
        throw new Error(`Unsupported role: ${role}`);
    }
  }

  // Update profile based on user role
  static async updateProfileByRole(role: string, profileData: UpdateUserProfile): Promise<UserProfile> {
    switch (role.toLowerCase()) {
      case 'member':
      case 'donor':
        return this.updateMemberProfile(profileData);
      case 'staff':
        return this.updateStaffProfile(profileData);
      default:
        throw new Error(`Unsupported role: ${role}`);
    }
  }
}

export default UserService; 