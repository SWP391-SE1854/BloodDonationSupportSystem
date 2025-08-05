import api from './api.service';
import { API_ENDPOINTS } from './api.config';

export interface BloodBag {
  id: number;
  bagId: string;
  donorName: string;
  bloodType: string;
  volume: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  dateCollected: string;
  component: string;
  donationId: number;
  expirationDate: string;
  testResults?: {
    hiv: boolean;
    hepatitis: boolean;
    syphilis: boolean;
    malaria: boolean;
  };
}

export interface BloodBagApprovalRequest {
  bagId: number;
  action: 'approve' | 'reject';
  reason?: string;
  component?: string;
}

export class BloodBagApprovalService {
  static async getPendingBloodBags(): Promise<BloodBag[]> {
    try {
      const response = await api.get<BloodBag[]>(API_ENDPOINTS.BLOOD_BAG_APPROVAL.GET_PENDING);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending blood bags:', error);
      throw error;
    }
  }

  static async approveBloodBag(request: BloodBagApprovalRequest): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.BLOOD_BAG_APPROVAL.APPROVE, request);
    } catch (error) {
      console.error('Error approving blood bag:', error);
      throw error;
    }
  }

  static async rejectBloodBag(request: BloodBagApprovalRequest): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.BLOOD_BAG_APPROVAL.REJECT, request);
    } catch (error) {
      console.error('Error rejecting blood bag:', error);
      throw error;
    }
  }

  static async getBloodBagById(id: number): Promise<BloodBag> {
    try {
      const response = await api.get<BloodBag>(API_ENDPOINTS.BLOOD_BAG_APPROVAL.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching blood bag:', error);
      throw error;
    }
  }
} 