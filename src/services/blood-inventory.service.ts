import api from './api.service';
import { API_ENDPOINTS } from './api.config';
import { BloodInventoryUnit } from '@/types/api';

export class BloodInventoryService {
    static async getAll(): Promise<BloodInventoryUnit[]> {
        const response = await api.get(API_ENDPOINTS.BLOOD_INVENTORY.GET_ALL);
        return response.data;
    }

    static async create(payload: { newUnit: Partial<BloodInventoryUnit> }): Promise<BloodInventoryUnit> {
        const response = await api.post<BloodInventoryUnit>(API_ENDPOINTS.BLOOD_INVENTORY.CREATE, payload);
        return response.data;
    }

    static async update(id: number, unitData: Partial<BloodInventoryUnit>): Promise<BloodInventoryUnit> {
        const response = await api.put(API_ENDPOINTS.BLOOD_INVENTORY.UPDATE(id), unitData);
        return response.data;
    }

    static async delete(id: number): Promise<void> {
        await api.delete(API_ENDPOINTS.BLOOD_INVENTORY.DELETE(id));
    }
} 