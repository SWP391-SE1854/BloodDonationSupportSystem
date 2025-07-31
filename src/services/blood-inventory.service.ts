import api from './api.service';
import { API_ENDPOINTS } from './api.config';
import { BloodInventoryUnit } from '@/types/api';

type InventoryResponse = BloodInventoryUnit[] | { $values: BloodInventoryUnit[] };

export class BloodInventoryService {
    static async getAll(): Promise<BloodInventoryUnit[]> {
        const response = await api.get<InventoryResponse>(API_ENDPOINTS.BLOOD_INVENTORY.GET_ALL);
        const data = response.data;

        if (data && '$values' in data && Array.isArray(data.$values)) {
            return data.$values;
        }
        if (Array.isArray(data)) {
            return data;
        }
        
        console.warn("Unexpected data format for blood inventory:", data);
        return [];
    }

    static async create(payload: Partial<BloodInventoryUnit>): Promise<BloodInventoryUnit> {
        const response = await api.post<BloodInventoryUnit>(API_ENDPOINTS.BLOOD_INVENTORY.CREATE, payload);
        return response.data;
    }

    static async createFromDonation(donationId: number, bloodTypeString: string, components: Array<{ component: string; quantity: number }>): Promise<void> {
        const creationPromises = components.map(comp => {
            const payload: Partial<BloodInventoryUnit> = {
                donation_id: donationId,
                blood_type: bloodTypeString, // Use the string directly
                component: comp.component,
                quantity: comp.quantity,
                status: 'Available',
                expiration_date: new Date(new Date().setDate(new Date().getDate() + 42)).toISOString(),
            };
            return this.create(payload);
        });

        await Promise.all(creationPromises);
    }

    static async update(id: number, unitData: Partial<BloodInventoryUnit>): Promise<BloodInventoryUnit> {
        const response = await api.put(API_ENDPOINTS.BLOOD_INVENTORY.UPDATE, unitData, {
            params: { id }
        });
        return response.data;
    }

    static async delete(id: number): Promise<void> {
        await api.delete(API_ENDPOINTS.BLOOD_INVENTORY.DELETE(id));
    }
} 