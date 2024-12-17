require('dotenv').config();

const config = {
    // Server Configuration
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Database Configuration
    DB_URI: process.env.MONGODB_URI || process.env.DB_URI,

    // JWT Configuration
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',

    // API Keys and Secrets
    API_KEYS: process.env.API_KEYS ? process.env.API_KEYS.split(',') : [],

    // CORS Configuration
    CORS_ORIGIN: process.env.NODE_ENV === 'production'
        ? ['https://young-ocean-77806-2eafe9f964ec.herokuapp.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
        
    // Frontend URL
    FRONTEND_URL: process.env.NODE_ENV === 'production'
        ? 'https://young-ocean-77806-2eafe9f964ec.herokuapp.com'
        : 'http://localhost:3000'
};

// Validate required configuration
const requiredConfigs = ['DB_URI', 'JWT_SECRET'];
for (const configKey of requiredConfigs) {
    if (!config[configKey]) {
        console.error(`Missing required configuration: ${configKey}`);
        process.exit(1);
    }
}

module.exports = config;
