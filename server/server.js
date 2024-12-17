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
.catch(err => console.log('MongoDB Connection Error:', err));

// Routes
const userRoutes = require('./api/User/UserRoute');
const workoutRoutes = require('./api/workouts/WorkoutRoute');
const completedWorkoutRoutes = require('./api/workouts/CompletedWorkoutRoute');

app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/completed-workouts', completedWorkoutRoutes);

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../front/public')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});