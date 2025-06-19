import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './api.config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface DonationHistory {
  id: number;
  userId: string;
  bloodBankId: number;
  donationDate: string;
  bloodType: string;
  units: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDonationHistoryRequest {
  bloodBankId: number;
  donationDate: string;
  bloodType: string;
  units: number;
  notes?: string;
}

export interface UpdateDonationHistoryRequest {
  donationDate?: string;
  bloodType?: string;
  units?: number;
  status?: string;
  notes?: string;
}

export const donationHistoryService = {
  async getDonationHistories(): Promise<DonationHistory[]> {
    const response = await api.get(API_ENDPOINTS.GET_DONATION_HISTORIES);
    return response.data;
  },

  async getDonationHistoryById(id: number): Promise<DonationHistory> {
    const response = await api.get(API_ENDPOINTS.GET_DONATION_HISTORY_BY_ID(id));
    return response.data;
  },

  async createDonationHistory(data: CreateDonationHistoryRequest): Promise<DonationHistory> {
    const response = await api.post(API_ENDPOINTS.CREATE_DONATION_HISTORY, data);
    return response.data;
  },

  async updateDonationHistory(id: number, data: UpdateDonationHistoryRequest): Promise<DonationHistory> {
    const response = await api.put(API_ENDPOINTS.UPDATE_DONATION_HISTORY(id), data);
    return response.data;
  },

  async deleteDonationHistory(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.DELETE_DONATION_HISTORY(id));
  },
}; 