const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
        minlength: [6, 'סיסמה חייבת להכיל לפחות 6 תווים'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { 
    timestamps: true 
});

// הצפנת סיסמה לפני שמירה
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// השוואת סיסמאות
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// מודל Login בסיסי
const loginSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);
const Login = mongoose.model('Login', loginSchema);

module.exports = { User, Login };