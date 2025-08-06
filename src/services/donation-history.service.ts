import api from './api.service';
import { API_ENDPOINTS } from './api.config';
import axios from 'axios';

import { User, BloodInventoryUnit } from '@/types/api';

export interface DonationHistoryRecord {
  history_id: number;
  user_id: number;
  unit_id: number | null;
  donation_date: string;
  status: string;
  blood_type?: string; // Add blood_type field
  user?: User; // Nested user object
  bloodInventory?: BloodInventoryUnit; // Nested bloodInventory object
}

export class DonationHistoryService {
  static async getUserHistory(userId: number): Promise<DonationHistoryRecord[]> {
    try {
      const response = await api.get(API_ENDPOINTS.DONATION_HISTORY.GET_USER_HISTORY(userId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching history for user ${userId}:`, error);
      throw error;
    }
  }

  static async getMemberHistory(status?: string): Promise<DonationHistoryRecord[]> {
    try {
      const endpoint = status 
        ? API_ENDPOINTS.DONATION_HISTORY.GET_MEMBER_HISTORY_WITH_STATUS(status)
        : API_ENDPOINTS.DONATION_HISTORY.GET_MEMBER_HISTORY;
      
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching member donation history:', error.message);
      }
      throw error;
    }
  }

  static async deleteHistoryRecord(id: number): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.DONATION_HISTORY.DELETE_HISTORY(id));
    } catch (error) {
      console.error(`Error deleting history record ${id}:`, error);
      throw error;
    }
  }

  // New method to get blood type for a user from health record
  static async getUserBloodType(userId: number): Promise<string | null> {
    try {
      const response = await api.get(API_ENDPOINTS.HEALTH_RECORD.GET_HEALTH_RECORD_BY_USER_ID(userId.toString()));
      return response.data?.blood_type || null;
    } catch (error) {
      console.error(`Error fetching blood type for user ${userId}:`, error);
      return null;
    }
  }

  // New method to enrich donation history with blood type information
  static async getMemberHistoryWithBloodType(): Promise<DonationHistoryRecord[]> {
    try {
      const history = await this.getMemberHistory();
      
      // Enrich each history record with blood type if not already present
      const enrichedHistory = await Promise.all(
        history.map(async (record) => {
          if (!record.blood_type && record.user_id) {
            try {
              const bloodType = await this.getUserBloodType(record.user_id);
              return { ...record, blood_type: bloodType || undefined };
            } catch (error) {
              console.error(`Error fetching blood type for donation ${record.history_id}:`, error);
              return record;
            }
          }
          return record;
        })
      );
      
      return enrichedHistory;
    } catch (error) {
      console.error('Error fetching member donation history with blood type:', error);
      throw error;
    }
  }
}

export default DonationHistoryService;
