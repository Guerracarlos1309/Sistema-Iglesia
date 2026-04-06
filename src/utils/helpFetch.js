/**
 * Custom fetch utility to manage API calls
 * Automatically appends the base URL and authorization tokens
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const helpFetch = () => {
  const customFetch = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Default options
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

    options.body = JSON.stringify(options.body) || false;
    if (!options.body) delete options.body;

    setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          statusText: response.statusText,
          message: errorData.message || 'Ocurrió un error en la solicitud',
        };
      }

      return await response.json();
    } catch (err) {
      if (err.name === 'AbortError') {
        throw { status: 408, statusText: 'Request Timeout', message: 'La solicitud tardó demasiado' };
      }
      throw err;
    }
  };

  const get = (url, options = {}) => customFetch(url, { ...options, method: 'GET' });
  const post = (url, options = {}) => customFetch(url, { ...options, method: 'POST' });
  const put = (url, options = {}) => customFetch(url, { ...options, method: 'PUT' });
  const del = (url, options = {}) => customFetch(url, { ...options, method: 'DELETE' });

  return { get, post, put, del };
};
