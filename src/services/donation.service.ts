import api from './api.service';
import { API_ENDPOINTS } from './api.config';
import axios from 'axios';
import { Donation } from '@/types/api';

// CreateDonationPayload is a subset of the full Donation object
export type CreateDonationPayload = {
  donation_date: string;
  donation_time: string;
  diseases: string[];
  allergies: string[];
  note?: string;
};

export class DonationService {
  static async createDonation(payload: CreateDonationPayload): Promise<Donation> {
    try {
      // The backend expects user_id from the token, and status/created_at are set server-side.
      const response = await api.post<Donation>(API_ENDPOINTS.DONATION.CREATE_MEMBER_REQUEST, payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error creating donation request:', error.message);
      }
      throw error;
    }
  }

  static async getAllDonations(): Promise<Donation[]> {
    try {
      const response = await api.get<{ $values: Donation[] }>(API_ENDPOINTS.DONATION.GET_ALL);
      return response.data.$values || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching all donations:', error.message);
      }
      throw error;
    }
  }

  static async updateDonation(donation: Partial<Donation> & { donation_id: number }): Promise<Donation> {
    try {
      // The update endpoint for staff is a static path. The donation object in the body contains the ID.
      const response = await api.put<Donation>(API_ENDPOINTS.DONATION.UPDATE, donation);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error updating donation ${donation.donation_id}:`, error.message);
      }
      throw error;
    }
  }

  static async getDonationsByStatus(status?: string): Promise<Donation[]> {
    try {
      const response = await api.get<{ $values: Donation[] }>(API_ENDPOINTS.DONATION.GET_BY_STATUS, {
        params: { status }
      });
      return response.data.$values || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching donations by status:', error.message);
      }
      throw error;
    }
  }

  static async getMemberDonations(): Promise<Donation[]> {
    try {
      const response = await api.get<{ $values: Donation[] }>(API_ENDPOINTS.DONATIONS.GET_MEMBER_DONATIONS);
      return response.data?.$values || response.data || [];
    } catch (error) {
      console.error('Error fetching member donations:', error);
      throw error;
    }
  }
}

export default DonationService; 