import api from './api.service';
import { API_ENDPOINTS } from './api.config';
import axios from 'axios';
import { Donation } from '@/types/api';

// CreateDonationPayload is a subset of the full Donation object
export type CreateDonationPayload = {
  donation_date: string;
  start_time: string;
  end_time: string;
  blood_type?: string;
  status?: string;
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
      const response = await api.get<{ $values: Donation[] }>(API_ENDPOINTS.DONATION.GET_MEMBER_DONATIONS);
      return response.data?.$values || response.data || [];
    } catch (error) {
      console.error('Error fetching member donations:', error);
      throw error;
    }
  }

  static async cancelMemberDonation(id: number): Promise<void> {
    try {
      await api.put(API_ENDPOINTS.DONATION.CANCEL_MEMBER_DONATION(id));
    } catch (error) {
      console.error('Error cancelling member donation:', error);
      throw error;
    }
  }

  static async updateDonationStatus(donationId: number, status: Donation['status']): Promise<Donation> {
    try {
      console.log(`Updating donation ${donationId} status to ${status}...`);
      
      // First, get the current donation to have all the required fields
      const allDonations = await this.getAllDonations();
      const currentDonation = allDonations.find(d => d.donation_id === donationId);
      
      if (!currentDonation) {
        throw new Error(`Donation ${donationId} not found`);
      }
      
      // Create the donation object with the fields the backend expects
      const updatePayload = {
        donation_id: donationId,
        status: status,
        quantity: currentDonation.amount_ml || 0, // Map amount_ml to quantity
        start_time: currentDonation.start_time,
        end_time: currentDonation.end_time,
        note: currentDonation.note || ''
      };
      
      console.log(`Request payload:`, updatePayload);
      console.log(`API endpoint:`, API_ENDPOINTS.DONATION.UPDATE);
      
      const response = await api.put<Donation>(API_ENDPOINTS.DONATION.UPDATE, updatePayload);
      
      console.log(`Successfully updated donation status:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating donation status ${donationId}:`, error);
      if (axios.isAxiosError(error)) {
        console.error(`Axios error details for status update:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method,
          requestData: error.config?.data
        });
      }
      throw error;
    }
  }

  // New method to handle approval
  static async approveDonation(donationId: number): Promise<Donation> {
    try {
      console.log(`Attempting to approve donation ${donationId}...`);
      
      // Update the donation status to Approved
      const updatedDonation = await this.updateDonationStatus(donationId, 'Approved');
      
      console.log(`Successfully approved donation ${donationId}:`, updatedDonation);
      
      // Note: History creation is disabled due to missing backend endpoint
      // await this.createDonationHistoryEntry(donationId, 'Approved');
      
      return updatedDonation;
    } catch (error) {
      console.error(`Error approving donation ${donationId}:`, error);
      if (axios.isAxiosError(error)) {
        console.error(`Axios error details:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method
        });
      }
      throw error;
    }
  }

  // New method to handle rejection
  static async rejectDonation(donationId: number, reason?: string): Promise<Donation> {
    try {
      // Update the donation status to Rejected
      const updatedDonation = await this.updateDonationStatus(donationId, 'Rejected');
      
      // Note: History creation is disabled due to missing backend endpoint
      // await this.createDonationHistoryEntry(donationId, 'Rejected');
      
      return updatedDonation;
    } catch (error) {
      console.error(`Error rejecting donation ${donationId}:`, error);
      if (axios.isAxiosError(error)) {
        console.error(`Axios error details:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method
        });
      }
      throw error;
    }
  }

  // New method to handle cancellation
  static async cancelDonation(donationId: number): Promise<Donation> {
    try {
      // Update the donation status to Cancelled
      const updatedDonation = await this.updateDonationStatus(donationId, 'Cancelled');
      
      // Note: History creation is disabled due to missing backend endpoint
      // await this.createDonationHistoryEntry(donationId, 'Cancelled');
      
      return updatedDonation;
    } catch (error) {
      console.error(`Error cancelling donation ${donationId}:`, error);
      if (axios.isAxiosError(error)) {
        console.error(`Axios error details:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method
        });
      }
      throw error;
    }
  }

  // New method to create donation history entries
  static async createDonationHistoryEntry(donationId: number, status: string): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.DONATION.CREATE_HISTORY, {
        donation_id: donationId,
        status: status
      });
    } catch (error) {
      console.error(`Error creating donation history entry for ${donationId}:`, error);
      // Don't throw error here as the main operation (status update) should still succeed
    }
  }
}

export default DonationService;
