import { API_BASE_URL } from '@/config/api';

export const API_BASE_URL = 'http://localhost:5081/api';
export const API_TIMEOUT = 30000;

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    FIREBASE_LOGIN: `${API_BASE_URL}/auth/firebase-login`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  },
  // User endpoints
  USER: {
    PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/users/change-password`,
  },
  // Donation endpoints
  DONATION: {
    LIST: `${API_BASE_URL}/donations`,
    CREATE: `${API_BASE_URL}/donations`,
    DETAILS: (id: string) => `${API_BASE_URL}/donations/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/donations/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/donations/${id}`,
  },
  // Blood request endpoints
  BLOOD_REQUEST: {
    LIST: `${API_BASE_URL}/blood-requests`,
    CREATE: `${API_BASE_URL}/blood-requests`,
    DETAILS: (id: string) => `${API_BASE_URL}/blood-requests/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/blood-requests/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/blood-requests/${id}`,
  },
  // Location endpoints
  LOCATION: {
    LIST: `${API_BASE_URL}/locations`,
    CREATE: `${API_BASE_URL}/locations`,
    DETAILS: (id: string) => `${API_BASE_URL}/locations/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/locations/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/locations/${id}`,
  },
  // Blood type endpoints
  BLOOD_TYPE: {
    LIST: `${API_BASE_URL}/blood-types`,
  },
  // Statistics endpoints
  STATISTICS: {
    DASHBOARD: `${API_BASE_URL}/statistics/dashboard`,
    DONATIONS: `${API_BASE_URL}/statistics/donations`,
    REQUESTS: `${API_BASE_URL}/statistics/requests`,
  },
  // User Management endpoints
  GET_CURRENT_USER_PROFILE: '/user/member',

  // New endpoints
  PROFILE: '/users/profile',
  USERS: '/users',
  DONORS: '/donors',
  BLOOD_REQUESTS: '/blood-requests',
  INVENTORY: '/inventory',
  STATS: '/stats',
  REPORTS: '/reports',
  NOTIFICATIONS: '/notifications',
  HEALTH_RECORDS: '/health-records',

  // Blood Bank endpoints
  GET_BLOOD_BANKS: '/bloodbank',
  GET_BLOOD_BANK_BY_ID: (id: number) => `/bloodbank/${id}`,
  CREATE_BLOOD_BANK: '/bloodbank',
  UPDATE_BLOOD_BANK: (id: number) => `/bloodbank/${id}`,
  DELETE_BLOOD_BANK: (id: number) => `/bloodbank/${id}`,

  // Blood Request endpoints
  GET_ALL_BLOOD_REQUESTS: '/bloodrequest/all',
  GET_BLOOD_REQUEST_BY_ID: (id: string) => `/bloodrequest/${id}`,
  CREATE_BLOOD_REQUEST: '/bloodrequest/new',
  UPDATE_BLOOD_REQUEST: (id: string) => `/bloodrequest/update/${id}`,
  DELETE_BLOOD_REQUEST: (id: string) => `/bloodrequest/delete/${id}`,

  // Campaign endpoints
  GET_CAMPAIGNS: '/campaign',
  GET_CAMPAIGN_BY_ID: (id: number) => `/campaign/${id}`,
  CREATE_CAMPAIGN: '/campaign',
  UPDATE_CAMPAIGN: (id: number) => `/campaign/${id}`,
  DELETE_CAMPAIGN: (id: number) => `/campaign/${id}`,

  // Donation History endpoints
  GET_DONATION_HISTORIES: '/donationhistory',
  GET_DONATION_HISTORY_BY_ID: (id: number) => `/donationhistory/${id}`,
  CREATE_DONATION_HISTORY: '/donationhistory',
  UPDATE_DONATION_HISTORY: (id: number) => `/donationhistory/${id}`,
  DELETE_DONATION_HISTORY: (id: number) => `/donationhistory/${id}`,

  // Donation endpoints
  GET_ALL_DONATIONS: '/donation/all',
  GET_USER_DONATIONS: '/donation/user',
  GET_DONATIONS_BY_USER_ID: (userId: string) => `/donation/user/${userId}`,
  CREATE_DONATION: '/donation/member',

  // Health Record endpoints
  GET_ALL_HEALTH_RECORDS: '/healthrecord/all',
  GET_USER_HEALTH_RECORD: '/healthrecord/view',
  GET_HEALTH_RECORD_BY_USER_ID: (userId: string) => `/healthrecord/user/${userId}`,
  CREATE_HEALTH_RECORD: '/healthrecord/member',
  UPDATE_HEALTH_RECORD: (id: string) => `/healthrecord/${id}`,

  // Notification endpoints
  SEND_NOTIFICATION: '/notification/send',
  GET_USER_NOTIFICATIONS: '/notification/member',
  MARK_NOTIFICATION_AS_READ: (id: string) => `/notification/member/${id}/read`,
}; 