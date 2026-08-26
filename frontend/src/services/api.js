// Axios API service configuration
/**
 * Axios API Service Client Instance.
 * Configures base API route path `/api`, auth token interceptors, and error handling.
 */
import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request interceptor to attach JWT token to outgoing Axios requests.
 * Reads the token from localStorage and appends it to Authorization headers.
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bookticket_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor for handling 401 unauthorized errors globally.
 * Clears the authentication token and evicts user session datasets from
 * localStorage if credentials expire or become invalid.
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('bookticket_token');
      localStorage.removeItem('bookticket_user');
    }
    return Promise.reject(error);
  }
);

export default API;
