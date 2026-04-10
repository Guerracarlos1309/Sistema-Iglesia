/**
 * Custom fetch utility to manage API calls
 * Automatically appends the base URL and authorization tokens
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Centralized API Endpoints for easy management
 */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    ME: '/auth/me',
  },
  ANNOUNCEMENTS: {
    LIST: '/announcements',
    ADMIN: '/announcements/admin',
    CREATE: '/announcements',
    ITEM: (id) => `/announcements/${id}`,
  },
  REPORTS: {
    STATS: '/reports/stats',
    FINANCE: '/reports/finance',
  },
  MEMBERS: {
    BASE: '/members',
    ITEM: (id) => `/members/${id}`,
  },
  GROUPS: {
    BASE: '/groups',
    ITEM: (id) => `/groups/${id}`,
    REPORTS: '/group_reports',
  },
  LOCATIONS: {
    BASE: '/locations',
    ITEM: (id) => `/locations/${id}`,
  },
  MEETINGS: {
    BASE: '/meetings',
    ITEM: (id) => `/meetings/${id}`,
    CONFIRM: '/participation',
  },
  FINANCES: {
    BASE: '/finances',
    ITEM: (id) => `/finances/${id}`,
  },
  USERS: {
    BASE: '/users',
    ITEM: (id) => `/users/${id}`,
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    ITEM: (id) => `/notifications/${id}`,
  },
  LOOKUPS: {
    MEMBER_STATUSES: '/lookups/member-statuses',
    GROWTH_STEPS: '/lookups/growth-steps',
    GROUP_TYPES: '/lookups/group-types',
    ANNOUNCEMENT_CATEGORIES: '/lookups/announcement-categories',
    TRANSACTION_CATEGORIES: '/lookups/transaction-categories',
    PAYMENT_METHODS: '/lookups/payment-methods',
    GENDERS: '/lookups/genders',
    MARITAL_STATUSES: '/lookups/marital-statuses',
    RELATIONSHIP_TYPES: '/lookups/relationship-types',
  }
};

export const helpFetch = () => {
  const customFetch = async (endpoint, options = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    // Default headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Attach token if exists
    const token = localStorage.getItem('token');
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const controller = new AbortController();
    options.signal = controller.signal;

    options.method = options.method || 'GET';
    options.headers = options.headers
      ? { ...defaultHeaders, ...options.headers }
      : defaultHeaders;

    if (options.body && typeof options.body !== 'string' && !(options.body instanceof FormData)) {
      options.body = JSON.stringify(options.body);
    }

    setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      let response = await fetch(url, options);

      // handle Token Expired (401)
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        
        // If it's specifically an expired token, try to refresh
        if (errorData.code === 'TOKEN_EXPIRED') {
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (refreshToken) {
            try {
              const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: refreshToken })
              });

              if (refreshRes.ok) {
                const { token: newToken } = await refreshRes.json();
                localStorage.setItem('token', newToken);
                
                // Retry the original request with new token
                options.headers.Authorization = `Bearer ${newToken}`;
                response = await fetch(url, options);
              } else {
                // Refresh failed, logout
                localStorage.clear();
                window.location.href = '/login';
                throw { status: 401, message: 'Sesión expirada. Por favor inicie sesión de nuevo.' };
              }
            } catch (refreshErr) {
              localStorage.clear();
              window.location.href = '/login';
              throw { status: 401, message: 'Sesión expirada' };
            }
          }
        } else {
          // If not expired but another 401 (invalid/none), just throw
          throw {
            status: 401,
            statusText: response.statusText,
            message: errorData.message || 'No autorizado',
          };
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          statusText: response.statusText,
          message: errorData.message || 'Error en la solicitud',
        };
      }

      return await response.json();
    } catch (err) {
      if (err.name === 'AbortError') {
        throw { status: 408, statusText: 'Timeout', message: 'La solicitud tardó demasiado' };
      }
      throw err;
    }
  };

  return {
    get: (url, options = {}) => customFetch(url, { ...options, method: 'GET' }),
    post: (url, body, options = {}) => customFetch(url, { ...options, method: 'POST', body }),
    put: (url, body, options = {}) => customFetch(url, { ...options, method: 'PUT', body }),
    del: (url, options = {}) => customFetch(url, { ...options, method: 'DELETE' }),
  };
};
