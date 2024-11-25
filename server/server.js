require('dotenv').config(); // חייב להיות בהתחלה
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Body:', req.body);
    next();
});

// Routes
const userRouter = require('./api/User/UserRoute');
app.use('/api/users', userRouter);

// MongoDB connection
const OPT = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(process.env.MONGODB_URI, OPT)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// Error handling - כולל טיפול בשגיאות JWT
app.use((err, req, res, next) => {
    console.error(err.stack);

    // טיפול בשגיאות JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: 'error',
            message: 'טוקן לא תקין'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'error',
            message: 'פג תוקף הטוקן'
        });
    }

    // שגיאות אחרות
    res.status(500).json({
        status: 'error',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    console.log('404 - Not Found:', req.method, req.path);
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`CORS enabled for: ${process.env.CLIENT_URL}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});

module.exports = app;