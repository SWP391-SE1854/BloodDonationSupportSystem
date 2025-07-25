import api from './api.service';
import { API_ENDPOINTS } from './api.config';
import axios from 'axios';
import { Donation } from '@/types/api';
import { BloodInventoryService } from './blood-inventory.service';

const bloodTypeMap: { [key: string]: number } = {
  'A+': 1, 'A-': 2, 'B+': 3, 'B-': 4,
  'AB+': 5, 'AB-': 6, 'O+': 7, 'O-': 8,
};

// CreateDonationPayload is a subset of the full Donation object
export type CreateDonationPayload = {
  donation_date: string;
  donation_time: string;
  diseases?: string[];
  allergies?: string[];
  note?: string;
};

export class DonationService {
  static async createDonation(payload: CreateDonationPayload): Promise<Donation> {
    try {
      // Add the default location_id to the payload before sending
      const payloadWithLocation = {
        ...payload,
        location_id: 1, // Default location for the singular hospital
      };

      // The backend expects user_id from the token, and status/created_at are set server-side.
      const response = await api.post<Donation>(API_ENDPOINTS.DONATION.CREATE_MEMBER_REQUEST, payloadWithLocation);
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
      // This function will now only update the donation's status.
      // The inventory update logic will be handled separately after component separation.
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
      // Corrected endpoint to fetch member's donation history.
      const response = await api.get<{ $values: Donation[] }>(API_ENDPOINTS.DONATION_HISTORY.GET_MEMBER_HISTORY);
      return response.data?.$values || response.data || [];
    } catch (error) {
      console.error('Error fetching member donations:', error);
      throw error;
    }
  }
}

export default DonationService; 