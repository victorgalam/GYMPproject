const express = require('express');
const router = express.Router();
const workoutController = require('./WorkoutController');
const { protect } = require('../../middleware/authMiddleware');

// הגנה על כל הנתיבים
router.use(protect);

// נתיבים בסיסיים
router.route('/')
    .post(workoutController.createWorkout)
    .get(workoutController.getUserWorkouts);

// נתיב לאימונים קבועים
router.post('/recurring', workoutController.createRecurringWorkout);

// נתיב לאימונים עתידיים
router.get('/upcoming', workoutController.getUpcomingWorkouts);

// נתיבים לאימון ספציפי
router.route('/:id')
    .get(workoutController.getWorkout)
    .patch(workoutController.updateWorkout)
    .delete(workoutController.deleteWorkout);

module.exports = router;
