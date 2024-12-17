const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/users', require('./api/User/UserRoute'));
app.use('/api/personal-details', require('./api/PersonalDetails/PersonalDetailsRoute'));
app.use('/api/workouts', require('./api/workouts/WorkoutRoute'));
app.use('/api/completed-workout', require('./api/workouts/CompletedWorkoutRoute'));

// Serve static files from React app
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../front/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../front/build', 'index.html'));
    });
}

// Simple error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        
        // Start server only after successful DB connection
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });