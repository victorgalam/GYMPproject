const mongoose = require('mongoose');

const completedExerciseSchema = new mongoose.Schema({
    exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
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
            min: 0
        },
        weight: {
            type: Number,
            required: true,
            min: 0
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
    title: {
        type: String,
        required: true
    },
    description: String,
    exercises: [completedExerciseSchema],
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,  // בדקות
        required: true
    },
    totalVolume: {
        type: Number,  // סך כל המשקל * חזרות
        required: true
    }
}, {
    timestamps: true  // יוסיף אוטומטית createdAt ו-updatedAt
});

// מתודות סטטיות
completedWorkoutSchema.statics.findUserCompletedWorkouts = function(userId) {
    return this.find({ userId }).sort({ endTime: -1 });
};

// מתודה לחישוב סטטיסטיקות
completedWorkoutSchema.statics.getUserStats = async function(userId, startDate, endDate) {
    const query = { 
        userId,
        endTime: { 
            $gte: startDate, 
            $lte: endDate 
        }
    };

    return await this.aggregate([
        { $match: query },
        { 
            $group: {
                _id: null,
                totalWorkouts: { $sum: 1 },
                avgDuration: { $avg: "$duration" },
                totalVolume: { $sum: "$totalVolume" },
                avgVolumePerWorkout: { $avg: "$totalVolume" }
            }
        }
    ]);
};

const CompletedWorkout = mongoose.model('CompletedWorkout', completedWorkoutSchema);

module.exports = CompletedWorkout;
