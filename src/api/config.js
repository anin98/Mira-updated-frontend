export const API_CONFIG = {
  BASE_URL: 'https://api.grayscale-technologies.com/api',
  CHAT_URL: 'https://mira-chat.grayscale-technologies.com',
  CLIENT_KEY: import.meta.env.VITE_CLIENT_KEY,
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
    BASE: '/v1/companies/',
    GET: (id) => `/v1/companies/${id}/`,
    UPDATE: (id) => `/v1/companies/${id}/`,
  },
  ORDERS: {
    LIST: '/v1/orders/',
    GET: (id) => `/v1/orders/${id}/`,
  },
  PRODUCTS: {
    LIST: '/v1/products/',
    MY_PRODUCTS: '/v1/products/my_products/',
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
