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
    DELETE: '/blog',
  },

  // Donation endpoints
  DONATION: {
    CREATE_MEMBER_REQUEST: '/donation/member',
    GET_ALL: '/donation/all',
    GET_BY_STATUS: '/donation/status',
    UPDATE: '/donation/staff',
    GET_MEMBER_DONATIONS: '/donation/users',
    GET_MY_DONATIONS: (status?: string) => `/donation/my-donations${status ? `?status=${status}` : ''}`,
    CANCEL_MEMBER_DONATION: (id: number) => `/donation/member/cancel/${id}`,
    CREATE_HISTORY: '/donation/history',
  },
  
  // Donation History endpoints
  DONATION_HISTORY: {
    GET_MEMBER_HISTORY: '/donation-history/member',
    GET_ALL_HISTORY: '/donation-history/admin/all',
    GET_HISTORY_BY_ID: (id: number) => `/donation-history/admin/${id}`,
    GET_USER_HISTORY: (userId: number) => `/donation-history/staff/user/${userId}`,
    DELETE_HISTORY: (id: number) => `/donation-history/admin/${id}`,
    GET_MEMBER_HISTORY_WITH_STATUS: (status?: string) => `/donation-history/member${status ? `?status=${status}` : ''}`,
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
    UPDATE: '/blood-inventory/update-blood',
    DELETE: (id: number) => `/blood-inventory/delete-blood?id=${id}`,
    ADD_BLOOD: '/blood-inventory/add-blood',
    GET_USERNAME_BY_UNIT_ID: (unitId: number) => `/blood-inventory/username/${unitId}`,
  },

  NOTIFICATIONS: {
    GET_MY_NOTIFICATIONS: '/notifications/my-notifications',
    CREATE: '/notifications/create',
    DISMISS: (id: string) => `/notifications/${id}/dismiss`,
    SEND_PROBLEM_REPORT: '/notification/send'
  },
};
