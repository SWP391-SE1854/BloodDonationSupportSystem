import api from './api.service';
import { API_ENDPOINTS } from './api.config';
import { DonationComponent, calculateNextEligibleDate, DonationHistoryEntry } from '@/utils/donationConstants';
import { DonationHistoryService } from './donation-history.service';

export interface HealthRecord {
    record_id: number;
    user_id: number;
    weight: number;
    height: number;
    blood_type: string;
    heart_rate: number;
    medication: string;
    last_donation: string;
    last_donation_type?: string;
    eligibility_status: boolean | null;
    donation_count: number;
    rejection_reason?: string;
}

export class HealthRecordService {
  static async getMyRecord(): Promise<HealthRecord> {
    const response = await api.get(API_ENDPOINTS.HEALTH_RECORD.GET_USER_HEALTH_RECORD);
    return response.data;
  }

  static async createMyRecord(data: Partial<HealthRecord>): Promise<HealthRecord> {
    const response = await api.post(API_ENDPOINTS.HEALTH_RECORD.CREATE_HEALTH_RECORD, data);
    return response.data;
  }

  static async updateMyRecord(data: Partial<HealthRecord>): Promise<HealthRecord> {
    const response = await api.put(API_ENDPOINTS.HEALTH_RECORD.UPDATE_MY_RECORD, data);
    return response.data;
  }

  static async getAllRecords(): Promise<HealthRecord[]> {
    const response = await api.get(API_ENDPOINTS.HEALTH_RECORD.GET_ALL_HEALTH_RECORDS);
    return response.data;
  }
  
  static async getRecordByUserId(userId: string): Promise<HealthRecord> {
    const response = await api.get(API_ENDPOINTS.HEALTH_RECORD.GET_HEALTH_RECORD_BY_USER_ID(userId));
    return response.data;
  }

  static async updateRecord(id: string, data: Partial<HealthRecord>): Promise<HealthRecord> {
    const response = await api.put(API_ENDPOINTS.HEALTH_RECORD.UPDATE_HEALTH_RECORD(id), data);
    return response.data;
  }

  static async updateUserDonationStats(userId: string, donationDate: string, component: DonationComponent): Promise<HealthRecord> {
    try {
      // First get the current record and donation history
      const [currentRecord, donationHistory] = await Promise.all([
        this.getRecordByUserId(userId),
        DonationHistoryService.getMemberHistory()
      ]);

      // Create history entry for the new donation
      const newDonation: DonationHistoryEntry = {
        donation_id: 0, // This will be set by the backend
        user_id: parseInt(userId),
        donation_date: donationDate,
        component: component,
        status: 'Completed'
      };

      // Combine existing history with new donation
      const updatedHistory = [...(Array.isArray(donationHistory) ? donationHistory : []), newDonation];
      
      // Calculate next eligible date based on full history
      const nextEligibleDate = calculateNextEligibleDate(updatedHistory);
      const isCurrentlyEligible = nextEligibleDate ? new Date() >= nextEligibleDate : true;
      
      // Update the record
      const updateData: Partial<HealthRecord> = {
        donation_count: (currentRecord.donation_count || 0) + 1,
        last_donation: donationDate,
        last_donation_type: component,
        eligibility_status: isCurrentlyEligible,
        // Preserve all other fields
        weight: currentRecord.weight,
        height: currentRecord.height,
        blood_type: currentRecord.blood_type,
        heart_rate: currentRecord.heart_rate,
        medication: currentRecord.medication
      };

      // Update the record using the record_id
      return await this.updateRecord(currentRecord.record_id.toString(), updateData);
    } catch (error) {
      console.error('Error updating user donation stats:', error);
      throw error;
    }
  }
}

export default HealthRecordService; 