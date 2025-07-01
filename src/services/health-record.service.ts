import api from './api.service';
import { API_ENDPOINTS } from './api.config';

export interface HealthRecord {
    record_id: number;
    user_id: number;
    weight: number;
    height: number;
    blood_type: string;
    allergies: string;
    medication: string;
    last_donation: string;
    eligibility_status: boolean | null;
    donation_count: number;
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

  static async updateUserDonationStats(userId: string, donationDate: string): Promise<HealthRecord> {
    const currentRecord = await this.getRecordByUserId(userId);
    const updatedRecord: HealthRecord = {
      ...currentRecord,
      donation_count: (currentRecord.donation_count || 0) + 1,
      last_donation: donationDate,
    };
    return this.updateRecord(userId, updatedRecord);
  }
}

export default HealthRecordService; 