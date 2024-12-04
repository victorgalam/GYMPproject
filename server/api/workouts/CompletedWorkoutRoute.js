const express = require('express');
const router = express.Router();
const CompletedWorkoutController = require('./CompletedWorkoutController');
const auth = require('../../middleware/auth');  // וודא שיש לך middleware אימות

// השלמת אימון
router.post('/complete/:workoutId', auth, CompletedWorkoutController.completeWorkout);

// קבלת כל האימונים שהושלמו של המשתמש
router.get('/completed', auth, CompletedWorkoutController.getUserCompletedWorkouts);

// קבלת סטטיסטיקות אימונים
router.get('/stats', auth, CompletedWorkoutController.getUserStats);

module.exports = router;
