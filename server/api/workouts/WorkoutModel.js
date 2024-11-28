const mongoose = require('mongoose');

const exerciseInWorkoutSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
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
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurrence: {
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly'],
            required: function() { return this.isRecurring; }
        },
        interval: {
            type: Number,
            min: 1,
            default: 1,
            required: function() { return this.isRecurring; }
        },
        daysOfWeek: [{
            type: Number,
            min: 0,
            max: 6
        }],
        endDate: Date
    },
    googleCalendarEventId: String,
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    }
}, {
    timestamps: true
});

// אינדקסים
workoutSchema.index({ userId: 1, startDate: 1 });
workoutSchema.index({ isRecurring: 1, userId: 1 });

// וירטואלים
workoutSchema.virtual('formattedStartDate').get(function() {
    return this.startDate.toLocaleDateString();
});

workoutSchema.virtual('formattedEndDate').get(function() {
    return this.endDate.toLocaleDateString();
});

// מתודות סטטיות
workoutSchema.statics.findUserWorkouts = async function(userId) {
    return this.find({ userId })
        .sort({ startDate: -1 })
        .populate('exercises.id');
};

// מתודות של המסמך
workoutSchema.methods.updateStatus = async function(newStatus) {
    this.status = newStatus;
    return this.save();
};

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
