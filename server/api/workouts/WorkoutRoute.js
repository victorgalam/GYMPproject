const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/authMiddleware');
const WorkoutController = require('./WorkoutController');
const mongoose = require('mongoose');

// מיידלוור לאימות עדכון אימון
const validateWorkoutUpdate = (req, res, next) => {
    const { title, description, exercises, startDate, endDate, duration } = req.body;

    // בדיקת נוכחות שדות חובה
    if (!title) {
        return res.status(400).json({
            status: 'error',
            message: 'כותרת האימון הינה שדה חובה'
        });
    }

    // בדיקת תקינות תרגילים
    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'יש להוסיף לפחות תרגיל אחד לאימון'
        });
    }

    // בדיקת תקינות תאריכים
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
            status: 'error',
            message: 'תאריכי האימון אינם תקינים'
        });
    }

    if (start > end) {
        return res.status(400).json({
            status: 'error',
            message: 'תאריך ההתחלה חייב להיות לפני תאריך הסיום'
        });
    }

    // בדיקת משך האימון
    if (!duration || duration <= 0) {
        return res.status(400).json({
            status: 'error',
            message: 'משך האימון חייב להיות גדול מ-0'
        });
    }

    // בדיקת תקינות תרגילים
    const invalidExercises = exercises.filter(exercise => 
        !exercise.name || 
        (exercise.sets === undefined || exercise.sets < 0) ||
        (exercise.reps === undefined || exercise.reps < 0)
    );

    if (invalidExercises.length > 0) {
        return res.status(400).json({
            status: 'error',
            message: 'קיימים תרגילים שאינם תקינים - חסרים פרטים חיוניים או ערכים שליליים'
        });
    }

    next();
};

// נתיבים לניהול אימונים
router.post('/', protect, WorkoutController.createWorkout);
router.post('/recurring', protect, WorkoutController.createRecurringWorkout);
router.get('/my', protect, WorkoutController.getUserWorkouts);
router.get('/recurring', protect, WorkoutController.getUserRecurringWorkouts);

// Delete all workouts route
router.delete('/deleteAll', protect, WorkoutController.deleteAllWorkouts);

// נתיבים לאימון ספציפי
router.route('/:id')
    .get(protect, WorkoutController.getWorkoutById)
    .put(protect, validateWorkoutUpdate, WorkoutController.updateWorkout)
    .delete(protect, WorkoutController.deleteWorkout);

module.exports = router;