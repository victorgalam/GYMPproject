const express = require('express');
const router = express.Router();
const { createWorkout, getUserWorkouts } = require('./WorkoutController');
const auth = require('../../middleware/auth'); // מניח שיש לך middleware אימות

router.post('/', auth, createWorkout);
router.get('/', auth, getUserWorkouts);

module.exports = router;
