import api from './api.service';
import { API_ENDPOINTS } from './api.config';

export interface Location {
    location_id: number;
    name: string;
    address: string;
    city: string;
    district: string;
    latitude: number;
    longitude: number;
    operating_hours: string;
}

export class LocationService {
    static async getAllLocations(): Promise<Location[]> {
        try {
            const response = await api.get<Location[]>(API_ENDPOINTS.LOCATION.GET_ALL);
            return response.data;
        } catch (error) {
            console.error('Error fetching locations:', error);
            throw error;
        }
    }
} 