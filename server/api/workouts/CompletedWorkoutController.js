const CompletedWorkout = require('./CompletedWorkoutModel');
const Workout = require('./WorkoutModel');

class CompletedWorkoutController {
    static async completeWorkout(req, res) {
        try {
            console.log('=== Complete Workout Debug ===');
            const { workoutId } = req.params;
            const { exercises, startTime, endTime } = req.body;
            const userId = req.user._id;
            
            console.log('Request Data:', { workoutId, exercises, startTime, endTime, userId });

            // מציאת האימון המקורי
            const originalWorkout = await Workout.findById(workoutId);
            if (!originalWorkout) {
                return res.status(404).json({ message: 'האימון לא נמצא' });
            }

            // וידוא שהאימון שייך למשתמש
            if (originalWorkout.userId.toString() !== userId.toString()) {
                return res.status(403).json({ message: 'אין הרשאה לסיים אימון זה' });
            }

            // עיבוד התרגילים
            const processedExercises = exercises.map(exercise => ({
                exerciseId: exercise.exerciseId,
                name: exercise.name,
                sets: exercise.sets.map(set => ({
                    reps: parseInt(set.reps) || 0,
                    weight: parseInt(set.weight) || 0,
                    completed: true
                }))
            }));

            console.log('Processed exercises:', processedExercises);

            // יצירת אימון שהושלם
            const completedWorkout = new CompletedWorkout({
                userId,
                workoutId,
                title: originalWorkout.title,
                description: originalWorkout.description,
                exercises: processedExercises,
                startTime: startTime || new Date(),
                endTime: endTime || new Date()
            });

            console.log('Saving completed workout:', completedWorkout);

            await completedWorkout.save();
            
            // מחיקת האימון המקורי
            await Workout.findByIdAndDelete(workoutId);
            console.log('Original workout deleted');

            res.status(201).json({
                message: 'האימון הושלם בהצלחה ונמחק מהרשימה',
                completedWorkout
            });

        } catch (error) {
            console.error('שגיאה בהשלמת האימון:', error);
            res.status(500).json({ 
                message: 'שגיאת שרת בהשלמת האימון',
                error: error.message
            });
        }
    }

    // קבלת כל האימונים שהושלמו עבור משתמש
    static async getUserCompletedWorkouts(req, res) {
        try {
            const userId = req.user._id;
            const completedWorkouts = await CompletedWorkout.find({ userId })
                .sort({ endTime: -1 });
            
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
