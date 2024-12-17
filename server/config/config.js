require('dotenv').config();

module.exports = {
    // Server Configuration
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Database Configuration
    DB_URI: process.env.DB_URI,

    // JWT Configuration
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',

    // API Keys and Secrets
    API_KEYS: process.env.API_KEYS ? process.env.API_KEYS.split(',') : [],

    // CORS Configuration
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
};
