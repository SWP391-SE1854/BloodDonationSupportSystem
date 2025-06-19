import { API_BASE_URL } from '@/config/api';

export const API_TIMEOUT = 30000;

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `/auth/login`,
    REGISTER: `/auth/register`,
    FIREBASE_LOGIN: `/auth/firebase-login`,
    VERIFY_EMAIL: `/auth/verify-email`,
    RESET_PASSWORD: `/auth/reset-password`,
    REFRESH_TOKEN: `/auth/refresh-token`,
  },
  
  // User endpoints based on the C# controller
  USER: {
    // Member endpoints - using the actual C# controller structure
    GET_MEMBER_PROFILE: `/user/member`,
    UPDATE_MEMBER_PROFILE: (id: number) => `/user/member/${id}`,
    
    // Staff endpoints
    GET_STAFF_PROFILE: `/user/staff`,
    UPDATE_STAFF_PROFILE: `/user/staff`,
    GET_ALL_MEMBERS: `/user/staff/all`,
    
    // Admin endpoints
    GET_ALL_USERS: `/user/admin/all`,
    GET_USER_BY_ID: (id: number) => `/user/admin/${id}`,
    UPDATE_USER: (id: number) => `/user/admin/${id}`,
    DELETE_USER: (id: number) => `/user/admin/${id}`,
  },
  
  // Donation endpoints
  DONATION: {
    LIST: `/donations`,
    CREATE: `/donations`,
    DETAILS: (id: string) => `/donations/${id}`,
    UPDATE: (id: string) => `/donations/${id}`,
    DELETE: (id: string) => `/donations/${id}`,
  },
  
  // Blood request endpoints
  BLOOD_REQUEST: {
    LIST: `/blood-requests`,
    CREATE: `/blood-requests`,
    DETAILS: (id: string) => `/blood-requests/${id}`,
    UPDATE: (id: string) => `/blood-requests/${id}`,
    DELETE: (id: string) => `/blood-requests/${id}`,
  },
  
  // Location endpoints
  LOCATION: {
    LIST: `/locations`,
    CREATE: `/locations`,
    DETAILS: (id: string) => `/locations/${id}`,
    UPDATE: (id: string) => `/locations/${id}`,
    DELETE: (id: string) => `/locations/${id}`,
  },
  
  // Blood type endpoints
  BLOOD_TYPE: {
    LIST: `/blood-types`,
  },
  
  // Statistics endpoints
  STATISTICS: {
    DASHBOARD: `/statistics/dashboard`,
    DONATIONS: `/statistics/donations`,
    REQUESTS: `/statistics/requests`,
  },

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