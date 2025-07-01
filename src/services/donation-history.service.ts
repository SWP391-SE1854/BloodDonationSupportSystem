import api from './api.service';
import { API_ENDPOINTS } from './api.config';
import axios from 'axios';

export interface DonationHistoryRecord {
  donation_id: number;
  user_id: number;
  unit_id: number | null;
  donation_date: string;
  status: string;
  component: string;
  location: string;
  quantity: number;
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

  static async getMemberHistory(): Promise<DonationHistoryRecord[]> {
    try {
      const response = await api.get(API_ENDPOINTS.DONATION_HISTORY.GET_MEMBER_HISTORY);
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
}

export default DonationHistoryService; 