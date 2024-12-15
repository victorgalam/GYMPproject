const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['חזה', 'גב', 'כתפיים', 'רגליים', 'ידיים', 'בטן', 'אחר']
    },
    defaultSets: {
        type: Number,
        default: 3,
        min: 1
    },
    defaultReps: {
        type: Number,
        default: 10,
        min: 1
    },
    defaultWeight: {
        type: Number,
        default: 0,
        min: 0
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// עדכון תאריך העדכון האחרון לפני שמירה
exerciseSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
