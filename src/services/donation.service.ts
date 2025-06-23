import api from './api.service';
import { API_ENDPOINTS } from './api.config';
import axios from 'axios';

export interface Donation {
  donation_id: number;
  user_id: number;
  unit_id: number | null;
  donation_date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  component: 'Whole Blood' | 'Platelets' | 'Plasma' | 'Red Cells';
  location: string;
  quantity: number;
  notes?: string;
}

export interface CreateDonationPayload {
  donation_date: string;
  location: string;
  component: string;
  quantity: number;
  notes?: string;
}

export class DonationService {
  static async createMemberDonation(payload: CreateDonationPayload): Promise<Donation> {
    try {
      const response = await api.post<Donation>(API_ENDPOINTS.DONATION.CREATE_MEMBER_REQUEST, payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error creating member donation request:', error.message);
      }
      throw error;
    }
  }

  static async getAllDonations(): Promise<Donation[]> {
    try {
      const response = await api.get<Donation[]>(API_ENDPOINTS.DONATION.GET_ALL);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching all donations:', error.message);
      }
      throw error;
    }
  }

  static async getDonationsByUserId(userId: number): Promise<Donation[]> {
    try {
      const response = await api.get<Donation[]>(API_ENDPOINTS.DONATION.GET_BY_USER_ID(userId));
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error fetching donations for user id ${userId}:`, error.message);
      }
      throw error;
    }
  }

  static async updateDonationStatus(donationId: number, status: 'Approved' | 'Rejected'): Promise<Donation> {
    try {
      const response = await api.patch<Donation>(API_ENDPOINTS.DONATION.UPDATE_STATUS(donationId), { status });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error updating status for donation ${donationId}:`, error.message);
      }
      throw error;
    }
  }

  static async updateDonation(donation: Donation): Promise<Donation> {
    try {
      const response = await api.put<Donation>(API_ENDPOINTS.DONATION.UPDATE(donation.donation_id), donation);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error updating donation ${donation.donation_id}:`, error.message);
      }
      throw error;
    }
  }
}

export default DonationService; 