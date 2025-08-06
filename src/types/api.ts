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
  address?: string;
  city?: string;
  district?: string;
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
  quantity_cc: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  contactPhone: string;
  assignedDonorId?: string;
  location_donate?: string;
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
  blood_type: number | string; // Can be string for creation, number when read
  component: string; // e.g., 'Whole Blood', 'Red Cells', 'Platelets'
  status: 'Available' | 'Reserved' | 'Expired' | 'Used' | 'Pending Approval' | 'Approved';
  quantity: number; // in cc
  expiration_date: string; // ISO 8601 format
  rejection_reason?: string; // Reason for rejection
  parent_unit_id?: number; // ID of parent unit when split
  created_at?: string;
  updated_at?: string;
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

export interface BlogPost {
  blog_id: number;
  user_id: number;
  date: string;
  title: string;
  image?: string;
  content: string;
  User?: {
    name?: string;
  };
}

export interface Donation {
    donation_id: number;
    user_id: string;
    donation_date: string;
    start_time: string;
    end_time: string;
    blood_type?: string;
    note?: string;
    status: 'Pending' | 'Approved' | 'Completed' | 'Rejected' | 'Cancelled' | 'Processed' | 'CheckedIn';
    location?: string;
    component?: string;
    rejection_reason?: string;
    amount_ml?: number;
}

export interface WrappedResponse<T> {
  $values: T;
}

export interface Notification {
  id: string; // unified id
  title: string;
  message: string;
  sent_date: string;
  type: 'event' | 'alert' | 'info' | 'request' | 'system';
  createdAt: string;
  read: boolean;
  link?: string;
  // Optionally include legacy fields for compatibility
  notification_id?: string;
  read_status?: boolean;
  created_at?: string;
  donation_request_id?: number;
}
