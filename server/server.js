const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { corsMiddleware, errorHandler } = require('./middleware/corsMiddleware');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set JSON Content-Type for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Routes
const userRoutes = require('./api/User/UserRoute');
const workoutRoutes = require('./api/workouts/WorkoutRoute');
const completedWorkoutRoutes = require('./api/workouts/CompletedWorkoutRoute');

app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/completed-workouts', completedWorkoutRoutes);

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../front/build')));

// API 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'API endpoint not found'
  });
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/build', 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});