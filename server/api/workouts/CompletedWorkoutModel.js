const mongoose = require('mongoose');

const completedExerciseSchema = new mongoose.Schema({
    exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    sets: [{
        reps: {
            type: Number,
            required: true,
            default: 0
        },
        weight: {
            type: Number,
            required: true,
            default: 0
        },
        completed: {
            type: Boolean,
            default: true
        }
    }],
    notes: String
});

const completedWorkoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workoutId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workout',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    exercises: [completedExerciseSchema],
    startTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,  // בדקות
        default: 0
    },
    totalVolume: {
        type: Number,  // סך כל המשקל * חזרות
        default: 0
    }
}, {
    timestamps: true
});

// חישוב משך האימון והנפח הכולל לפני שמירה
completedWorkoutSchema.pre('save', function(next) {
    // חישוב משך האימון בדקות
    if (this.startTime && this.endTime) {
        this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60));
    }

    // חישוב הנפח הכולל
    this.totalVolume = this.exercises.reduce((total, exercise) => {
        return total + exercise.sets.reduce((setTotal, set) => {
            return setTotal + (set.weight * set.reps);
        }, 0);
    }, 0);

    next();
});

const CompletedWorkout = mongoose.model('CompletedWorkout', completedWorkoutSchema);

module.exports = CompletedWorkout;
