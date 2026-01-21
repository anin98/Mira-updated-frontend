export const API_CONFIG = {
  BASE_URL: 'https://api.grayscale-technologies.com/api',
  CHAT_URL: 'https://mira-chat.grayscale-technologies.com',
  CLIENT_KEY: '15f1d1cb-b6a0-4133-9f5a-643a3affe291',
  COMPANY_ID: '1',
}

export const ENDPOINTS = {
  AUTH: {
    REQUEST_OTP: '/auth/request-otp/',
    VERIFY_OTP: '/auth/verify-otp/',
  },
  CUSTOMERS: {
    BASE: '/v1/customers',
    GET: (id) => `/v1/customers/${id}/`,
    UPDATE: (id) => `/v1/customers/${id}/`,
  },
  COMPANIES: {
    BASE: '/v1/companies',
    GET: (id) => `/v1/companies/${id}/`,
    UPDATE: (id) => `/v1/companies/${id}/`,
  },
  DASHBOARD: {
    ANALYTICS: '/dashboard/analytics-summary/',
    ORDERS: '/dashboard/orders/',
    PRODUCTS: '/dashboard/products/',
    INBOX: '/dashboard/inbox/',
    AI_CONFIG: '/dashboard/ai-config/',
  },
  PAYMENTS: {
    GATEWAYS: '/payments/gateways/',
    METHODS: '/payments/methods/',
    INITIATE_MFS: '/payments/initiate-mfs-payment/',
  },
  CHAT: '/chat',
}
