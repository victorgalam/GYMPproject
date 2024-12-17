const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Log startup
console.log('Starting application...');

// Load environment variables
require('dotenv').config();
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);
console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  // Log more details about the connection error
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    code: err.code
  });
});

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV });
});

try {
  // Routes
  console.log('Loading routes...');
  const userRoutes = require('./server/api/User/UserRoute');
  const workoutRoutes = require('./server/api/workouts/WorkoutRoute');
  const completedWorkoutRoutes = require('./server/api/workouts/CompletedWorkoutRoute');

  // API Routes
  app.use('/api/users', userRoutes);
  app.use('/api/workouts', workoutRoutes);
  app.use('/api/completed-workouts', completedWorkoutRoutes);
  console.log('Routes loaded successfully');

  // Serve static files from React app
  const staticPath = path.join(__dirname, 'front/build');
  console.log('Static path:', staticPath);
  app.use(express.static(staticPath));

  // The "catchall" handler
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'front/build/index.html'));
  });
} catch (error) {
  console.error('Error during route setup:', error);
}

// Basic error handler
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Current directory:', __dirname);
  console.log('Available routes:', app._router.stack.filter(r => r.route).map(r => r.route.path));
});
