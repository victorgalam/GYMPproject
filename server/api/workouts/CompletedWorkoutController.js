const CompletedWorkout = require('./CompletedWorkoutModel');
const Workout = require('./WorkoutModel');

class CompletedWorkoutController {
    // שמירת אימון שהושלם
    static async completeWorkout(req, res) {
        try {
            console.log('=== Complete Workout Debug ===');
            const { workoutId } = req.params;
            const { exercises, endTime } = req.body;
            const userId = req.user._id;
            
            console.log('Request Data:', { workoutId, exercises, endTime, userId });

            // מציאת האימון המקורי
            const originalWorkout = await Workout.findById(workoutId);
            if (!originalWorkout) {
                return res.status(404).json({ message: 'האימון לא נמצא' });
            }

            // וידוא שהאימון שייך למשתמש
            if (originalWorkout.userId.toString() !== userId.toString()) {
                return res.status(403).json({ message: 'אין הרשאה לסיים אימון זה' });
            }

            // עיבוד התרגילים והוספת מזהים חסרים
            const processedExercises = exercises.map(exercise => {
                // וידוא שיש exerciseId תקין
                if (!exercise.exerciseId) {
                    console.warn('Missing exerciseId for exercise:', exercise);
                    // אם אין exerciseId, ננסה למצוא את התרגיל המקורי
                    const originalExercise = originalWorkout.exercises.find(e => e.name === exercise.name);
                    if (originalExercise) {
                        exercise.exerciseId = originalExercise.id;
                    }
                }

                return {
                    exerciseId: exercise.exerciseId,
                    name: exercise.name,
                    sets: exercise.sets.map(set => ({
                        reps: set.reps || 0,
                        weight: set.weight || 0,
                        completed: true
                    }))
                };
            });

            console.log('Processed exercises:', processedExercises);

            // חישוב משך האימון בדקות
            const startTime = originalWorkout.startDate;
            const duration = Math.round((new Date(endTime) - new Date(startTime)) / 1000 / 60);
            
            // חישוב נפח האימון הכולל
            let totalVolume = 0;
            processedExercises.forEach(exercise => {
                exercise.sets.forEach(set => {
                    totalVolume += set.weight * set.reps;
                });
            });

            // יצירת אימון שהושלם
            const completedWorkout = new CompletedWorkout({
                userId,
                title: originalWorkout.title,
                description: originalWorkout.description,
                exercises: processedExercises,
                startTime,
                endTime,
                duration,
                totalVolume
            });

            console.log('Saving completed workout:', completedWorkout);

            await completedWorkout.save();
            console.log('Workout saved successfully');

            // מחיקת האימון המקורי
            await Workout.findByIdAndDelete(workoutId);
            console.log('Original workout deleted');

            res.status(201).json({
                message: 'האימון הושלם בהצלחה',
                completedWorkout
            });

        } catch (error) {
            console.error('שגיאה בהשלמת האימון:', error);
            res.status(500).json({ 
                message: 'שגיאת שרת בהשלמת האימון',
                error: error.message,
                stack: error.stack // רק בסביבת פיתוח
            });
        }
    }

    // קבלת כל האימונים שהושלמו עבור משתמש
    static async getUserCompletedWorkouts(req, res) {
        try {
            console.log('מנסה להביא אימונים שהושלמו עבור משתמש:', req.user._id);
            const userId = req.user._id;
            const completedWorkouts = await CompletedWorkout.find({ userId })
                .sort({ endTime: -1 });
            
            console.log('נמצאו אימונים:', completedWorkouts.length);
            res.json(completedWorkouts);
        } catch (error) {
            console.error('שגיאה בקבלת אימונים שהושלמו:', error);
            res.status(500).json({ 
                message: 'שגיאת שרת בקבלת אימונים שהושלמו',
                error: error.message 
            });
        }
    }

    // קבלת סטטיסטיקות אימונים
    static async getWorkoutStats(req, res) {
        try {
            const userId = req.user._id;
            const { startDate, endDate } = req.query;

            const stats = await CompletedWorkout.getUserStats(userId, startDate, endDate);
            res.json(stats);
        } catch (error) {
            console.error('שגיאה בקבלת סטטיסטיקות אימונים:', error);
            res.status(500).json({ 
                message: 'שגיאת שרת בקבלת סטטיסטיקות',
                error: error.message 
            });
        }
    }
}

module.exports = CompletedWorkoutController;
