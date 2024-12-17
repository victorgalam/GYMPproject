const config = {
  API_BASE_URL: process.env.NODE_ENV === 'production'
    ? 'https://young-ocean-77806-2eafe9f964ec.herokuapp.com'  // Production URL
    : 'http://localhost:3000'  // Development URL
};

export default config;
export const API_BASE_URL = config.API_BASE_URL;
