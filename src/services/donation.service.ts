import api from './api.service';
import { API_ENDPOINTS } from './api.config';

export interface Donation {
  id: number;
  user_id: number;
  unit_id: number;
  donation_date: string;
  location: string;
  blood_type: string;
  quantity: number;
  status: string;
}

export interface DonationHistory {
  id: number;
  user_id: number;
  donation_date: string;
  location: string;
  quantity: number;
  notes: string;
}

export interface CreateDonationRequest {
  unit_id: number;
  donation_date: string;
  location: string;
  blood_type: string;
  quantity: number;
  status: string;
}

export class DonationService {
  static async createMemberDonationRequest(data: CreateDonationRequest): Promise<Donation> {
    try {
      const response = await api.post(API_ENDPOINTS.DONATION.CREATE_MEMBER_REQUEST, data);
      return response.data;
    } catch (error) {
      console.error('Error creating member donation request:', error);
      throw error;
    }
  }

  static async getAllDonations(): Promise<Donation[]> {
    try {
      const response = await api.get(API_ENDPOINTS.DONATION.GET_ALL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all donations:', error);
      throw error;
    }
  }

  static async getDonationsByUserId(userId: number): Promise<Donation[]> {
    try {
      const response = await api.get(API_ENDPOINTS.DONATION.GET_BY_USER_ID(userId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching donations for user id ${userId}:`, error);
      throw error;
    }
  }

  static async getMemberDonationHistory(): Promise<DonationHistory[]> {
    try {
      const response = await api.get(API_ENDPOINTS.DONATION_HISTORY.GET_MEMBER_HISTORY);
      return response.data;
    } catch (error) {
      console.error('Error fetching member donation history:', error);
      throw error;
    }
  }
}

export default DonationService; 