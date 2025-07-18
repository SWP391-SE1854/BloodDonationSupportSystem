export const API_TIMEOUT = 30000;

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FIREBASE_LOGIN: '/auth/firebase-login',
    VERIFY_EMAIL: '/auth/verify-email',
    RESET_PASSWORD: '/auth/send-reset-password',
    REFRESH_TOKEN: '/auth/refresh-token',
    GOOGLE_LOGIN: '/auth/google-login',
    GET_ADMIN_PROFILE: '/auth/admin-profile'
  },
  
  // User endpoints based on the C# controller
  USER: {
    // Member endpoints
    GET_MEMBER_PROFILE: '/user/member',
    UPDATE_MEMBER_PROFILE: '/user/member/modify_profile',
    
    // Staff endpoints
    GET_STAFF_PROFILE: '/user/staff',
    UPDATE_STAFF_PROFILE: '/user/staff',
    GET_ALL_MEMBERS: '/user/staff/all',
    
    // Admin endpoints
    GET_ALL_USERS: '/user/admin/all',
    GET_USER_BY_ID: (id: number) => `/user/admin/${id}`,
    UPDATE_USER: (id: number) => `/user/admin/${id}`,
    DELETE_USER: (id: number) => `/user/admin/${id}`,
  },
  
  // Blog Post endpoints
  BLOG_POST: {
    GET_ALL: '/blog/all',
    GET_BY_ID: (id: number) => `/blog/${id}`,
    CREATE: '/blog',
    UPDATE: (id: number) => `/blog/${id}`,
    DELETE: (id: number) => `/blog/${id}`,
  },

  // Donation endpoints
  DONATION: {
    CREATE_MEMBER_REQUEST: '/donation/member',
    GET_ALL: '/donation/all',
    GET_BY_STATUS: '/donation/status',
    UPDATE: '/donation/staff',
  },
  
  // Donation History endpoints
  DONATION_HISTORY: {
    GET_MEMBER_HISTORY: '/donation-history/member',
    GET_ALL_HISTORY: '/donation-history/admin/all',
    GET_HISTORY_BY_ID: (id: number) => `/donation-history/admin/${id}`,
    GET_USER_HISTORY: (userId: number) => `/donation-history/staff/user/${userId}`,
    DELETE_HISTORY: (id: number) => `/donation-history/admin/${id}`,
  },
  
  // Blood Request endpoints
  BLOOD_REQUEST: {
    GET_ALL: '/bloodrequest/all',
    GET_BY_ID: (id: number) => `/bloodrequest/${id}`,
    CREATE: '/bloodrequest/new',
    UPDATE: (id: number) => `/bloodrequest/update/${id}`,
    DELETE: (id: number) => `/bloodrequest/delete/${id}`,
    GET_MEMBER_REQUESTS: '/bloodrequest/member'
  },
  
  // Location endpoints
  LOCATION: {
    GET_ALL: '/location/all',
    CREATE: '/location/new',
    UPDATE_MEMBER: '/location/member/update',
    DETAILS: (id: string) => `/locations/${id}`,
    UPDATE: (id: string) => `/locations/${id}`,
    DELETE: (id: string) => `/locations/${id}`,
  },
  
  // Statistics endpoints
  STATISTICS: {
    DASHBOARD: '/statistics/dashboard',
    DONATIONS: '/statistics/donations',
    REQUESTS: '/statistics/requests',
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
  HEALTH_RECORD: {
    GET_ALL_HEALTH_RECORDS: '/healthrecord/all',
    GET_USER_HEALTH_RECORD: '/healthrecord/view',
    GET_HEALTH_RECORD_BY_USER_ID: (userId: string) => `/healthrecord/user/${userId}`,
    CREATE_HEALTH_RECORD: '/healthrecord/member',
    UPDATE_MY_RECORD: '/healthrecord/member',
    UPDATE_HEALTH_RECORD: (id: string) => `/healthrecord/${id}`,
  },

  // Notification endpoints
  SEND_NOTIFICATION: '/notification/send',
  GET_USER_NOTIFICATIONS: '/notification/member',
  MARK_NOTIFICATION_AS_READ: (id: string) => `/notification/member/${id}/read`,
  GET_ALL_ADMIN: '/notification/admin/all',
  DELETE_ADMIN: (id: number) => `/notification/admin/${id}`,
  CREATE_STAFF: '/notification/staff',

  BLOOD_INVENTORY: {
    GET_ALL: '/blood-inventory/all',
    GET_BY_ID: (id: number) => `/blood-inventory/${id}`,
    CREATE: '/blood-inventory/add-blood',
    UPDATE: (id: number) => `/blood-inventory/update-blood/${id}`,
    DELETE: (id: number) => `/blood-inventory/delete-blood?id=${id}`,
    ADD_BLOOD: '/blood-inventory/add-blood',
  },

  NOTIFICATIONS: {
    GET_MY_NOTIFICATIONS: '/notifications/my-notifications',
    CREATE: '/notifications/create',
    DISMISS: (id: string) => `/notifications/${id}/dismiss`,
    SEND_PROBLEM_REPORT: '/notification/send'
  },
}; 