// API Base Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production'
    ? 'https://young-ocean-77806-2eafe9f964ec.herokuapp.com'
    : 'http://localhost:3000');

// API Configuration Object
export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Other configurations can be added here
const config = {
  API_BASE_URL,
  apiConfig
};

export default config;
