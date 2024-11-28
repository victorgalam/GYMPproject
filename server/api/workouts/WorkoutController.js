const Workout = require('./WorkoutModel');
const mongoose = require('mongoose');

// יצירת אימון חדש
const createWorkout = async (req, res) => {
    try {
        const { title, description, exercises, startDate, endDate, duration } = req.body;
        const userId = req.user._id;

        exercises.forEach(exercise => {
            exercise["id"] = new mongoose.Types.ObjectId();
        });

        const workout = new Workout({
            userId,
            title,
            description,
            exercises,
            startDate,
            endDate,
            duration
        });

        await workout.save();

        res.status(201).json({
            status: 'success',
            data: workout
        });
    } catch (error) {
        console.error('שגיאה בשמירת האימון:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בשמירת האימון',
            error: error.message
        });
    }
};

// יצירת אימון מחזורי
const createRecurringWorkout = async (req, res) => {
    try {
        const {
            title,
            description,
            exercises,
            startDate,
            endDate,
            duration,
            recurrence
        } = req.body;

        exercises.forEach(exercise => {
            exercise["id"] = new mongoose.Types.ObjectId();
        });
        
        const userId = req.user._id;

        const workout = new Workout({
            userId,
            title,
            description,
            exercises,
            startDate,
            endDate,
            duration,
            isRecurring: true,
            recurrence
        });

        await workout.save();

        res.status(201).json({
            status: 'success',
            data: workout
        });
    } catch (error) {
        console.error('שגיאה בשמירת האימון המחזורי:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בשמירת האימון המחזורי',
            error: error.message
        });
    }
};

// קבלת כל האימונים של המשתמש
const getUserWorkouts = async (req, res) => {
    try {
        const userId = req.user._id;
        const workouts = await Workout.findUserWorkouts(userId);
        
        res.json({
            status: 'success',
            data: workouts
        });
    } catch (error) {
        console.error('שגיאה בקבלת האימונים:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בקבלת האימונים',
            error: error.message
        });
    }
};

// קבלת האימונים המחזוריים של המשתמש
const getUserRecurringWorkouts = async (req, res) => {
    try {
        const userId = req.user._id;
        const workouts = await Workout.find({ 
            userId, 
            isRecurring: true 
        }).sort({ startDate: -1 });
        
        res.json({
            status: 'success',
            data: workouts
        });
    } catch (error) {
        console.error('שגיאה בקבלת האימונים המחזוריים:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בקבלת האימונים המחזוריים',
            error: error.message
        });
    }
};

// קבלת אימון ספציפי
const getWorkoutById = async (req, res) => {
    try {
        const workout = await Workout.findOne({
            _id: req.params.id,
            userId: req.user._id
        }).populate('exercises.id');

        if (!workout) {
            return res.status(404).json({
                status: 'error',
                message: 'האימון לא נמצא'
            });
        }

        res.json({
            status: 'success',
            data: workout
        });
    } catch (error) {
        console.error('שגיאה בקבלת האימון:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בקבלת האימון',
            error: error.message
        });
    }
};

// עדכון אימון
const updateWorkout = async (req, res) => {
    try {
        const workout = await Workout.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user._id
            },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!workout) {
            return res.status(404).json({
                status: 'error',
                message: 'האימון לא נמצא'
            });
        }

        res.json({
            status: 'success',
            data: workout
        });
    } catch (error) {
        console.error('שגיאה בעדכון האימון:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בעדכון האימון',
            error: error.message
        });
    }
};

// מחיקת אימון
const deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!workout) {
            return res.status(404).json({
                status: 'error',
                message: 'האימון לא נמצא'
            });
        }

        res.json({
            status: 'success',
            message: 'האימון נמחק בהצלחה'
        });
    } catch (error) {
        console.error('שגיאה במחיקת האימון:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה במחיקת האימון',
            error: error.message
        });
    }
};

module.exports = {
    createWorkout,
    createRecurringWorkout,
    getUserWorkouts,
    getUserRecurringWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout
};
