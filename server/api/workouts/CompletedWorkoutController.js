const CompletedWorkout = require('./CompletedWorkoutModel');
const Workout = require('./WorkoutModel');

class CompletedWorkoutController {
    // שמירת אימון שהושלם
    static async completeWorkout(req, res) {
        try {
            console.log('1');
            const { workoutId } = req.params;
            const { exercises, endTime } = req.body;
            
            console.log('2');

            // מציאת האימון המקורי
            const originalWorkout = await Workout.findById(workoutId);
            if (!originalWorkout) {
                return res.status(404).json({ message: 'האימון לא נמצא' });
            }

            // חישוב משך האימון בדקות
            const startTime = originalWorkout.startDate;
            const duration = Math.round((new Date(endTime) - new Date(startTime)) / 1000 / 60);
            console.log('3');
            
            // חישוב נפח האימון הכולל (משקל * חזרות לכל תרגיל)
            let totalVolume = 0;
            exercises.forEach(exercise => {
                exercise.sets.forEach(set => {
                    totalVolume += set.weight * set.reps;
                });
            });

            console.log('4');
            // יצירת אימון שהושלם
            const completedWorkout = new CompletedWorkout({
                userId: originalWorkout.userId,
                title: originalWorkout.title,
                description: originalWorkout.description,
                exercises: exercises,
                startTime: startTime,
                endTime: endTime,
                duration: duration,
                totalVolume: totalVolume
            });
            console.log('4.5');
            console.log({                userId: originalWorkout.userId,
                title: originalWorkout.title,
                description: originalWorkout.description,
                exercises: exercises,
                startTime: startTime,
                endTime: endTime,
                duration: duration,
                totalVolume: 1
});

            await completedWorkout.save();
            console.log('5');

            // מחיקת האימון המקורי
            await Workout.findByIdAndDelete(workoutId);
            console.log('6');

            res.status(201).json({
                message: 'האימון הושלם בהצלחה',
                completedWorkout
            });

        } catch (error) {
            console.error('שגיאה בהשלמת האימון:', error);
            res.status(500).json({ message: 'שגיאת שרת בהשלמת האימון', error: error.message });
        }
    }

    // קבלת כל האימונים שהושלמו של משתמש
    static async getUserCompletedWorkouts(req, res) {
        try {
            console.log('=== Debug Complete Workout 2 ===!!!!!!!');
            const userId = req.user._id;
            const completedWorkouts = await CompletedWorkout.findUserCompletedWorkouts(userId);
            res.json(completedWorkouts);
        } catch (error) {
            console.error('שגיאה בקבלת אימונים שהושלמו:', error);
            res.status(500).json({ message: 'שגיאת שרת בקבלת אימונים שהושלמו', error: error.message });
        }
    }

    // קבלת סטטיסטיקות אימונים
    static async getUserStats(req, res) {
        try {
            console.log('=== Debug Complete Workout 2 ===!!!!!!!')
            const userId = req.user._id;
            const { startDate, endDate } = req.query;

            const stats = await CompletedWorkout.getUserStats(
                userId,
                new Date(startDate || '1970-01-01'),
                new Date(endDate || Date.now())
            );

            res.json(stats[0] || {
                totalWorkouts: 0,
                avgDuration: 0,
                totalVolume: 0,
                avgVolumePerWorkout: 0
            });
        } catch (error) {
            console.error('שגיאה בקבלת סטטיסטיקות:', error);
            res.status(500).json({ message: 'שגיאת שרת בקבלת סטטיסטיקות', error: error.message });
        }
    }
}

module.exports = CompletedWorkoutController;
