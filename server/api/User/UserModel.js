const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// סכמה לפרטים אישיים
const personalDetailsSchema = new mongoose.Schema({
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
});

// סכמת המשתמש המורחבת
const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: false, 
        trim: true, 
        maxlength: 100 
    },
    username: { 
        type: String,
        required: [true, 'שם משתמש הוא שדה חובה'],
        unique: true,
        trim: true
    },
    email: { 
        type: String, 
        required: [true, 'אימייל הוא שדה חובה'], 
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'נא להזין כתובת אימייל תקינה']
    },
    password: {
        type: String,
        required: [true, 'סיסמה היא שדה חובה'],
        minlength: [8, 'סיסמה חייבת להכיל לפחות 8 תווים'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'trainer'],
        default: 'user'
    },
    personalDetails: personalDetailsSchema,
    googleId: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    picture: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    join: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true 
});

// סכמה מורחבת ללוגים
const loginSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    ip: {
        type: String
    },
    userAgent: {
        type: String
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        default: 'success'
    }
});

// הצפנת סיסמה לפני שמירה
userSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// השוואת סיסמאות
userSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) {
        return false;
    }
    return await bcrypt.compare(candidatePassword, this.password);
};

// מתודה לעדכון זמן התחברות אחרון
userSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    this.loginAttempts = 0;
    return this.save();
};

// מתודה להגדלת מספר ניסיונות התחברות
userSchema.methods.incrementLoginAttempts = function() {
    this.loginAttempts += 1;
    return this.save();
};

const User = mongoose.model('User', userSchema);
const Login = mongoose.model('Login', loginSchema);

module.exports = { User, Login };