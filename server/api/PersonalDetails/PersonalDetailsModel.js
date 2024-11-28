const mongoose = require('mongoose');

const personalDetailsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    age: { 
        type: Number, 
        min: [0, 'הגיל חייב להיות מספר חיובי']
    },
    height: { 
        type: Number, 
        min: [0, 'הגובה חייב להיות מספר חיובי']
    },
    weight: { 
        type: Number, 
        min: [0, 'המשקל חייב להיות מספר חיובי']
    },
    experience: {
        type: String,
        enum: ['מתחיל', 'מתקדם', 'מקצועי']
    },
    goals: [{
        type: String
    }],
    preferredTime: {
        type: String
    },
    daysPerWeek: {
        type: Number,
        min: [1, 'מינימום יום אחד בשבוע'],
        max: [7, 'מקסימום 7 ימים בשבוע']
    },
    medicalConditions: {
        type: String
    }
}, {
    timestamps: true // מוסיף שדות createdAt ו-updatedAt
});

// אינדקס על userId לחיפוש מהיר
personalDetailsSchema.index({ userId: 1 });

const PersonalDetails = mongoose.model('PersonalDetails', personalDetailsSchema);

module.exports = PersonalDetails;
