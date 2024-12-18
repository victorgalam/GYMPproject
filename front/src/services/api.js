import axios from 'axios';
import { apiConfig } from '../config';
import { authService } from './authService';

// Create axios instance with default config
const api = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          authService.logout();
          window.location.href = '/login';
          break;
        case 403:
          console.error('גישה נדחתה:', error.response.data);
          break;
        default:
          console.error('שגיאת API:', error.response.data);
      }
    } else {
      console.error('שגיאת רשת:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
