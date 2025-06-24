export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'user';
  dateOfBirth?: string;
  bloodType?: string;
  location?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName?: string;
  role?: 'admin' | 'user';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodType: string;
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  unitsNeeded: number;
  hospital: string;
  requestTime: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  contactPhone: string;
  assignedDonorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Donor {
  id: string;
  name: string;
  bloodType: string;
  lastDonation: string;
  eligibleDate: string;
  phone: string;
  location: string;
  totalDonations: number;
  status: 'Available' | 'Not Eligible';
  createdAt: string;
  updatedAt: string;
}

export interface BloodInventory {
  type: string;
  units: number;
  lowStock: boolean;
  expiring: number;
  lastUpdated: string;
}

// This is the new, correct data structure for blood inventory
export interface BloodInventoryUnit {
  unit_id: number;
  donation_id: number;
  blood_type: string; // This is a foreign key ID
  status: 'Available' | 'Reserved' | 'Expired' | 'Used';
  quantity: number; // in ml
  expiration_date: string; // ISO 8601 format
}

export interface DashboardStats {
  pendingRequests: number;
  availableDonors: number;
  bloodUnits: number;
  successRate: number;
}

export interface MonthlyReport {
  totalDonations: number;
  emergencyRequests: number;
  successRate: number;
  period: string;
}

export interface DonorStatistics {
  activeDonors: number;
  newRegistrations: number;
  retentionRate: number;
  period: string;
}

export interface SystemLog {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}