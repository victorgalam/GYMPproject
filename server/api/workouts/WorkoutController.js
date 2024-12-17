const Workout = require('./WorkoutModel');
const mongoose = require('mongoose');

// יצירת אימון חדש
const createWorkout = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            exercises, 
            startDate, 
            duration,
            frequency,
            schedulePattern,
            workoutType 
        } = req.body;
        
        const userId = req.user._id;

        // אם זה אימון קבוע, ניצור מספר אימונים
        if (frequency === 'recurring') {
            const workouts = await createRecurringWorkouts({
                userId,
                title,
                description,
                exercises,
                startDate: new Date(startDate),
                duration,
                schedulePattern,
                workoutType
            });

            res.status(201).json({
                status: 'success',
                data: workouts
            });
            return;
        }

        // אימון חד פעמי
        const endDateTime = new Date(startDate);
        endDateTime.setMinutes(endDateTime.getMinutes() + duration);

        const workout = new Workout({
            userId,
            title,
            description,
            exercises,
            startDate: new Date(startDate),
            endDate: endDateTime,
            duration,
            frequency: 'one-time',
            workoutType: 'regular'
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

// פונקציית עזר ליצירת אימונים מחזוריים
const createRecurringWorkouts = async (workoutData) => {
    const { 
        userId,
        title,
        description,
        exercises,
        startDate, 
        duration,
        schedulePattern,
        workoutType 
    } = workoutData;

    const workouts = [];
    let currentDate = new Date(startDate);
    
    // חישוב מרווח הימים בין אימונים והגדרת מספר האימונים הרצוי
    let interval = 1; // ברירת מחדל - כל יום
    let totalWorkouts = 30; // ברירת מחדל - 30 אימונים

    switch (schedulePattern) {
        case 'daily':
            interval = 1;
            totalWorkouts = 30; // אימון כל יום למשך 30 יום
            break;
        case 'alternate':
            interval = 2;
            totalWorkouts = 15; // 15 אימונים במשך 30 יום
            break;
        case 'ab':
            interval = 2;
            totalWorkouts = 30; // 30 אימונים (15 A + 15 B)
            break;
    }

    let workoutCount = 0;
    while (workoutCount < totalWorkouts) {
        const endDateTime = new Date(currentDate);
        endDateTime.setMinutes(endDateTime.getMinutes() + duration);

        // יצירת עותק של האימון עם תאריך עדכני
        const workout = new Workout({
            userId,
            title,
            description,
            exercises: exercises.map(ex => ({
                name: ex.name,
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight
            })),
            startDate: new Date(currentDate),
            endDate: endDateTime,
            duration,
            frequency: 'recurring',
            schedulePattern,
            workoutType: schedulePattern === 'ab' ? 
                (workoutCount % 2 === 0 ? 'A' : 'B') : 
                'regular'
        });

        await workout.save();
        workouts.push(workout);

        // קידום התאריך לאימון הבא
        currentDate.setDate(currentDate.getDate() + interval);
        workoutCount++;
    }

    return workouts;
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
        });

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
    console.log('=== START WORKOUT UPDATE ===');
    try {
        // לוג מפורט של הבקשה
        console.log('Update Request:', {
            workoutId: req.params.id,
            userId: req.user?._id,
            body: JSON.stringify(req.body, null, 2)
        });

        const { id } = req.params;
        const userId = req.user._id;

        // בדיקת תקינות ה-ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error('Invalid workout ID:', id);
            return res.status(400).json({
                status: 'error',
                message: 'מזהה אימון לא תקין'
            });
        }

        // חיפוש האימון הקיים
        const existingWorkout = await Workout.findOne({ _id: id, userId });
        if (!existingWorkout) {
            console.error('Workout not found:', { id, userId });
            return res.status(404).json({
                status: 'error',
                message: 'האימון לא נמצא'
            });
        }

        console.log('Found existing workout:', {
            id: existingWorkout._id,
            title: existingWorkout.title,
            exerciseCount: existingWorkout.exercises?.length
        });

        // בדיקת תקינות התאריכים
        const { startDate, endDate, title, exercises = [] } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({
                status: 'error',
                message: 'שם האימון הוא שדה חובה'
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.error('Invalid dates:', { startDate, endDate });
            return res.status(400).json({
                status: 'error',
                message: 'תאריכי האימון אינם תקינים'
            });
        }

        if (start > end) {
            return res.status(400).json({
                status: 'error',
                message: 'תאריך התחלה חייב להיות לפני תאריך סיום'
            });
        }

        // בדיקת תקינות התרגילים
        if (!Array.isArray(exercises)) {
            console.error('Exercises is not an array:', typeof exercises);
            return res.status(400).json({
                status: 'error',
                message: 'פורמט התרגילים אינו תקין'
            });
        }

        if (exercises.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'יש להוסיף לפחות תרגיל אחד לאימון'
            });
        }

        // עיבוד ובדיקת תקינות של כל תרגיל
        const processedExercises = exercises.map((exercise, index) => {
            if (!exercise?.name) {
                throw new Error(`תרגיל ${index + 1} חסר שם`);
            }

            // המרת מזהה התרגיל ל-ObjectId
            let exerciseId;
            try {
                exerciseId = exercise.id && mongoose.Types.ObjectId.isValid(exercise.id) 
                    ? new mongoose.Types.ObjectId(exercise.id)
                    : new mongoose.Types.ObjectId();
            } catch (error) {
                console.error(`Error converting exercise ID for exercise ${index}:`, error);
                exerciseId = new mongoose.Types.ObjectId();
            }

            // המרת ערכים למספרים ווידוא ערכים מינימליים
            const sets = Math.max(1, Number(exercise.sets) || 3);
            const reps = Math.max(1, Number(exercise.reps) || 10);
            const weight = Math.max(0, Number(exercise.weight) || 0);

            return {
                id: exerciseId,
                name: String(exercise.name).trim(),
                sets,
                reps,
                weight,
                notes: String(exercise.notes || '').trim()
            };
        });

        // הכנת נתוני העדכון
        const duration = Math.max(1, Math.ceil((end - start) / (1000 * 60)));
        const updateData = {
            title: String(title).trim(),
            description: String(req.body.description || '').trim(),
            exercises: processedExercises,
            startDate: start,
            endDate: end,
            duration,
            status: req.body.status || existingWorkout.status || 'scheduled'
        };

        console.log('Update data prepared:', {
            title: updateData.title,
            exerciseCount: updateData.exercises.length,
            startDate: updateData.startDate,
            endDate: updateData.endDate,
            duration: updateData.duration,
            status: updateData.status
        });

        // ביצוע העדכון
        const updatedWorkout = await Workout.findOneAndUpdate(
            { _id: id, userId },
            { $set: updateData },
            { 
                new: true,
                runValidators: true
            }
        ).exec();

        if (!updatedWorkout) {
            console.error('Update failed - workout not found after update');
            return res.status(500).json({
                status: 'error',
                message: 'שגיאה בעדכון האימון'
            });
        }

        console.log('Workout updated successfully:', {
            id: updatedWorkout._id,
            title: updatedWorkout.title,
            exerciseCount: updatedWorkout.exercises.length
        });

        res.json({
            status: 'success',
            data: updatedWorkout,
            message: 'האימון עודכן בהצלחה'
        });

    } catch (error) {
        console.error('Error in updateWorkout:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            requestBody: req.body
        });

        // שליחת הודעת שגיאה מפורטת יותר למשתמש
        const errorMessage = error.message.includes('תרגיל') 
            ? error.message 
            : 'שגיאה בעדכון האימון';

        res.status(500).json({
            status: 'error',
            message: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
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

// Delete all workouts for a user
const deleteAllWorkouts = async (req, res) => {
  try {
    const userId = req.user.id;
    await Workout.deleteMany({ userId });
    res.status(200).json({ message: 'כל האימונים נמחקו בהצלחה' });
  } catch (error) {
    console.error('Error deleting all workouts:', error);
    res.status(500).json({ error: 'שגיאה במחיקת האימונים' });
  }
};

module.exports = {
    createWorkout,
    createRecurringWorkout,
    getUserWorkouts,
    getUserRecurringWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
    deleteAllWorkouts
};
