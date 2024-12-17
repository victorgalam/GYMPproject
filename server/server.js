const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

console.log('Starting server...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

// Middleware
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://young-ocean-77806.herokuapp.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
console.log('CORS enabled for origins:', corsOptions.origin);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    next();
});

// Serve static files from the React app
const staticPath = path.join(__dirname, '../front/build');
console.log('Static path:', staticPath);
app.use(express.static(staticPath));

// Routes
app.use('/api/users', require('./api/User/UserRoute'));
app.use('/api/personal-details', require('./api/PersonalDetails/PersonalDetailsRoute'));
// app.use('/api/exercise', require('./api/exercise/exerciseRoute'));
app.use('/api/workouts', require('./api/workouts/WorkoutRoute'));
app.use('/api/completed-workout', require('./api/workouts/CompletedWorkoutRoute')); // הוספת נתיב לאימונים שהושלמו

// MongoDB connection
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB successfully"))
.catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if can't connect to MongoDB
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    console.log('Serving index.html for path:', req.path);
    res.sendFile(path.join(__dirname, '../front/build', 'index.html'));
});

// Error handling - כולל טיפול בשגיאות JWT
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    console.error('Stack trace:', err.stack);

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
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Server initialization complete');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});

module.exports = app;