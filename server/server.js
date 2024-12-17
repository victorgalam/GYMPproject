const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Enhanced startup logging
console.log('==== Server Startup ====');
console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('Current working directory:', process.cwd());

// Middleware
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://young-ocean-77806-2eafe9f964ec.herokuapp.com', 'https://young-ocean-77806.herokuapp.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Debug middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Serve static files from the React app
try {
    const staticPath = path.join(__dirname, '../front/build');
    console.log('Static path:', staticPath);
    if (!require('fs').existsSync(staticPath)) {
        console.error('Static path does not exist:', staticPath);
    }
    app.use(express.static(staticPath));
} catch (error) {
    console.error('Error setting up static files:', error);
}

// Routes
try {
    app.use('/api/users', require('./api/User/UserRoute'));
    app.use('/api/personal-details', require('./api/PersonalDetails/PersonalDetailsRoute'));
    app.use('/api/workouts', require('./api/workouts/WorkoutRoute'));
    app.use('/api/completed-workout', require('./api/workouts/CompletedWorkoutRoute'));
} catch (error) {
    console.error('Error setting up routes:', error);
}

// MongoDB connection with retry logic
const connectToMongoDB = async (retries = 5) => {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Attempting to connect to MongoDB (attempt ${i + 1}/${retries})...`);
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log("Connected to MongoDB successfully");
            return true;
        } catch (err) {
            console.error(`MongoDB connection attempt ${i + 1} failed:`, err);
            if (i === retries - 1) {
                console.error("All MongoDB connection attempts failed");
                return false;
            }
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
        }
    }
};

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '../front/build', 'index.html');
    console.log('Serving index.html from:', indexPath);
    if (require('fs').existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error('index.html not found at:', indexPath);
        res.status(404).send('Frontend build files not found');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    console.error('Stack trace:', err.stack);

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'error',
            message: err.name === 'JsonWebTokenError' ? 'Invalid token' : 'Token expired'
        });
    }

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start server only after attempting MongoDB connection
const startServer = async () => {
    const mongoConnected = await connectToMongoDB();
    if (!mongoConnected) {
        console.error("Could not start server due to MongoDB connection failure");
        process.exit(1);
    }

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log('Server initialization complete');
    });
};

startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
    });
});

module.exports = app;