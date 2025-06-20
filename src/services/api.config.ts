import { API_BASE_URL } from '@/config/api';

export const API_TIMEOUT = 30000;

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `/auth/login`,
    REGISTER: `/auth/register`,
    FIREBASE_LOGIN: `/auth/firebase-login`,
    VERIFY_EMAIL: `/auth/verify-email`,
    RESET_PASSWORD: `/auth/send-reset-password`,
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
  
  // Blog Post endpoints
  BLOG_POST: {
    GET_ALL: '/blogpost/all',
    GET_BY_ID: (id: number) => `/blogpost/${id}`,
    CREATE: '/blogpost/new',
    UPDATE: (id: number) => `/blogpost/update/${id}`,
    DELETE: (id: number) => `/blogpost/delete/${id}`,
  },

  // Donation endpoints
  DONATION: {
    CREATE_MEMBER_REQUEST: '/donation/member',
    GET_ALL: '/donation/all',
    GET_BY_USER_ID: (userId: number) => `/donation/users?userId=${userId}`,
  },
  
  // Donation History endpoints
  DONATION_HISTORY: {
    GET_MEMBER_HISTORY: '/donation-history/member',
  },
  
  // Blood Request endpoints
  BLOOD_REQUEST: {
    GET_ALL: '/bloodrequest/all',
    GET_BY_ID: (id: number) => `/bloodrequest/${id}`,
    CREATE: '/bloodrequest/new',
    UPDATE: (id: number) => `/bloodrequest/update/${id}`,
    DELETE: (id: number) => `/bloodrequest/delete/${id}`,
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

  // Campaign endpoints
  GET_CAMPAIGNS: '/campaign',
  GET_CAMPAIGN_BY_ID: (id: number) => `/campaign/${id}`,
  CREATE_CAMPAIGN: '/campaign',
  UPDATE_CAMPAIGN: (id: number) => `/campaign/${id}`,
  DELETE_CAMPAIGN: (id: number) => `/campaign/${id}`,

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