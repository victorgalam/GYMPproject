const config = {
  API_BASE_URL: process.env.NODE_ENV === 'production'
    ? ''  // Empty string for same-origin requests in production
    : 'http://localhost:3000'
};

export default config;
