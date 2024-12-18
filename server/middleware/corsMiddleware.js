const cors = require('cors');

const corsMiddleware = cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

const errorHandler = (err, req, res, next) => {
  console.error('Server error:', err);
  
  // Set response type to JSON
  res.setHeader('Content-Type', 'application/json');
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token or no token provided'
    });
  }

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
};

module.exports = { corsMiddleware, errorHandler };
