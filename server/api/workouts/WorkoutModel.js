const mongoose = require('mongoose');

const exerciseInWorkoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sets: {
        type: Number,
        required: true,
        min: 1
    },
    reps: {
        type: Number,
        required: true,
        min: 1
    },
    weight: {
        type: Number,
        required: true,
        min: 0
    },
    notes: String
});

const workoutSchema = new mongoose.Schema({
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
    exercises: [exerciseInWorkoutSchema],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    frequency: {
        type: String,
        enum: ['one-time', 'recurring'],
        default: 'one-time'
    },
    schedulePattern: {
        type: String,
        enum: ['daily', 'alternate', 'ab'],
        required: function() {
            return this.frequency === 'recurring';
        }
    },
    workoutType: {
        type: String,
        enum: ['A', 'B', 'regular'],
        default: 'regular'
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    }
}, {
    timestamps: true
});

// אינדקסים
workoutSchema.index({ userId: 1, startDate: 1 });
workoutSchema.index({ frequency: 1, userId: 1 });

// וירטואלים
workoutSchema.virtual('formattedStartDate').get(function() {
    return this.startDate.toLocaleDateString();
});

workoutSchema.virtual('formattedEndDate').get(function() {
    return this.endDate.toLocaleDateString();
});

// מתודות סטטיות
workoutSchema.statics.findUserWorkouts = async function(userId) {
    try {
        return await this.find({ userId }).sort({ startDate: -1 });
    } catch (error) {
        throw new Error('שגיאה בקבלת האימונים: ' + error.message);
    }
};

// מתודות של המסמך
workoutSchema.methods.updateStatus = async function(newStatus) {
    this.status = newStatus;
    return this.save();
};

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
