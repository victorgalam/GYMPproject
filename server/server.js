const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
console.log('CORS enabled for origins:', corsOptions.origin.join(', '));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    next();
});

// Routes
app.use('/api/users', require('./api/User/UserRoute'));
app.use('/api/personal-details', require('./api/PersonalDetails/PersonalDetailsRoute'));
app.use('/api/exercise', require('./api/exercise/exerciseRoute'));
app.use('/api/workouts', require('./api/workouts/WorkoutRoute'));

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

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});

module.exports = app;