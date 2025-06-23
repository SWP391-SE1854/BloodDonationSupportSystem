import api from './api.service';
import { API_ENDPOINTS } from './api.config';
import { jwtDecode } from 'jwt-decode';
import { UserProfile, UpdateUserProfile } from './user.service';
import axios from 'axios';

export interface DashboardStats {
  totalUsers: number;
  totalDonations: number;
  totalRequests: number;
  totalMembers: number;
  totalStaff: number;
  totalAdmins: number;
  recentDonations: Array<{
    id: number;
    donorName: string;
    bloodType: string;
    date: string;
  }>;
  recentRequests: Array<{
    id: number;
    requesterName: string;
    bloodType: string;
    date: string;
  }>;
}

interface JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  exp: number;
  iss: string;
  aud: string;
}

export class AdminService {
  // Helper method to get admin ID from JWT token
  private static getAdminIdFromToken(): number {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log('Admin JWT Token decoded:', decoded);
      
      // Try to parse the nameidentifier field as a number
      const adminId = parseInt(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
      if (!isNaN(adminId)) {
        return adminId;
      }
      
      // If nameidentifier is not a number, use placeholder ID since controller gets real ID from token
      console.log('NameIdentifier field is not a number, using placeholder ID');
      return 1; // Placeholder ID - the controller will use the token's admin ID anyway
      
    } catch (error) {
      console.error('Failed to decode admin token:', error);
      throw new Error('Invalid authentication token');
    }
  }

  // Get all users (admin only)
  static async getAllUsers(): Promise<UserProfile[]> {
    try {
      const response = await api.get<UserProfile[]>(API_ENDPOINTS.USER.GET_ALL_USERS);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching all users:', error.message);
      }
      throw error;
    }
  }

  // Get user by ID (admin only)
  static async getUserById(id: number): Promise<UserProfile> {
    try {
      const response = await api.get<UserProfile>(API_ENDPOINTS.USER.GET_USER_BY_ID(id));
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error fetching user ${id}:`, error.message);
      }
      throw error;
    }
  }

  // Update user (admin only)
  static async updateUser(id: number, profileData: UpdateUserProfile): Promise<UserProfile> {
    try {
      const response = await api.put<UserProfile>(API_ENDPOINTS.USER.UPDATE_USER(id), profileData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error updating user ${id}:`, error.message);
      }
      throw error;
    }
  }

  // Delete user (admin only) - if your backend supports it
  static async deleteUser(id: number): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.USER.DELETE_USER(id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error deleting user ${id}:`, error.message);
      }
      throw error;
    }
  }

  // Get admin profile
  static async getAdminProfile(): Promise<UserProfile> {
    try {
      const adminId = this.getAdminIdFromToken();
      const response = await api.get(API_ENDPOINTS.USER.GET_USER_BY_ID(adminId));
      return response.data;
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      throw error;
    }
  }

  // Update admin profile
  static async updateAdminProfile(profileData: UpdateUserProfile): Promise<UserProfile> {
    try {
      const adminId = this.getAdminIdFromToken();
      const response = await api.put(API_ENDPOINTS.USER.UPDATE_USER(adminId), profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating admin profile:', error);
      throw error;
    }
  }

  // Get users by role (admin only)
  static async getUsersByRole(role: string): Promise<UserProfile[]> {
    try {
      const allUsers = await this.getAllUsers();
      return allUsers.filter(user => user.role.toLowerCase() === role.toLowerCase());
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw error;
    }
  }

  // Get statistics for admin dashboard
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get(API_ENDPOINTS.STATISTICS.DASHBOARD);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      throw error;
    }
  }
}

export default AdminService; 