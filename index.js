const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  // Don't exit the process, just log the error
});

// Routes
const userRoutes = require('./server/api/User/UserRoute');
const workoutRoutes = require('./server/api/workouts/WorkoutRoute');
const completedWorkoutRoutes = require('./server/api/workouts/CompletedWorkoutRoute');

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/completed-workouts', completedWorkoutRoutes);

// Serve static files from React app
app.use(express.static(path.join(__dirname, 'front/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'front/build/index.html'));
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
