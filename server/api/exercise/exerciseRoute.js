const express = require('express');
const router = express.Router();
const exerciseController = require('./exerciseController');
const { protect, restrictTo } = require('../../middleware/authMiddleware');

// Middleware לרישום בקשות
router.use((req, res, next) => {
    console.log('Exercise Router:', req.method, req.path, new Date().toISOString());
    next();
});

// נתיבים למשתמש מחובר - ניהול אימונים אישיים
router.get('/my-exercises', protect, exerciseController.getExercises);
router.post('/', protect, exerciseController.createExercise);
router.get('/stats/me', protect, exerciseController.getStatistic);
router.get('/latest', protect, exerciseController.getLatestExercises);
router.get('/favorites', protect, exerciseController.getFavoriteExercises);

// נתיבים ספציפיים לאימון
router.route('/:id')
    .get(protect, exerciseController.getExerciseById)
    .patch(protect, exerciseController.updateExerciseById)
    .delete(protect, exerciseController.deleteExerciseById);

// נתיבי סטטיסטיקות ודוחות
router.get('/stats/weekly', protect, exerciseController.getWeeklyStats);
router.get('/stats/monthly', protect, exerciseController.getMonthlyStats);
router.get('/progress/:muscleGroup', protect, exerciseController.getMuscleGroupProgress);

// נתיבים למנהלים בלבד
router.get('/all', protect, restrictTo('admin'), exerciseController.getAllExercises);
router.get('/stats/all', protect, restrictTo('admin'), exerciseController.getAllStats);
router.get('/users/:userId/exercises', protect, restrictTo('admin'), exerciseController.getUserExercises);
router.get('/inactive', protect, restrictTo('admin'), exerciseController.getInactiveUsers);

module.exports = router;
