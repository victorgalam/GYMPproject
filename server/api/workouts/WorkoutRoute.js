const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/authMiddleware');
const WorkoutController = require('./WorkoutController');

// נתיבים לניהול אימונים
router.post('/', protect, WorkoutController.createWorkout);
router.post('/recurring', protect, WorkoutController.createRecurringWorkout);
router.get('/my', protect, WorkoutController.getUserWorkouts);
router.get('/recurring', protect, WorkoutController.getUserRecurringWorkouts);

// נתיבים לאימון ספציפי
router.route('/:id')
    .get(protect, WorkoutController.getWorkoutById)
    .put(protect, WorkoutController.updateWorkout)
    .delete(protect, WorkoutController.deleteWorkout);

module.exports = router;