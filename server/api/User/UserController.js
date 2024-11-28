const { User, Login } = require('./UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');

// קריאת משתני הסביבה
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// בדיקת קיום המפתח הסודי
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in environment variables');
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const userController = {
    // הרשמה - נשאר ללא שינוי כי לא דורש אותנטיקציה
    createRegister: async (req, res) => {
        try {
            const newRegister = await User.create(req.body);
            res.status(201).json({
                status: "success",
                data: newRegister
            });
        } catch (error) {
            res.status(400).json({ 
                status: "fail", 
                message: error.message 
            });
        }
    },

    // התחברות - נשאר ללא שינוי כי לא דורש אותנטיקציה
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            console.log('Login attempt for:', username);

            const user = await User.findOne({
                $or: [
                    { username: username },
                    { email: username }
                ]
            }).select('+password');

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({
                    status: 'error',
                    message: 'שם משתמש או סיסמה לא נכונים'
                });
            }

            const token = jwt.sign(
                { 
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            // תיעוד ההתחברות
            await Login.create({
                user: user._id,
                timestamp: new Date(),
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });
            
            // שליחת תגובה עם הטוקן
            res.status(200).json({
                status: 'success',
                data: {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    },
                    token
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                status: 'error',
                message: 'שגיאת התחברות'
            });
        }
    },

    // נמחק את authenticateToken כי הוא עבר ל-middleware

    // נמחק את isAdmin כי הוא עבר ל-middleware

    createMyPersonalDetails: async (req, res) => {
        try {
            console.log('Starting createMyPersonalDetails');
            console.log('Request body:', req.body);
            console.log('User from middleware:', req.user);

            // בדיקת תקינות הבקשה
            if (!req.body || Object.keys(req.body).length === 0) {
                console.log('No data received in request body');
                return res.status(400).json({
                    status: "fail",
                    message: "לא התקבלו פרטים לעדכון"
                });
            }

            // שימוש ב-req.user שמגיע מה-middleware
            console.log('Attempting to update user with ID:', req.user._id);
            const details = await User.findByIdAndUpdate(
                req.user._id,
                { personalDetails: req.body },
                { 
                    new: true, 
                    runValidators: true 
                }
            );

            console.log('Update result:', details);

            if (!details) {
                console.log('User not found after update');
                return res.status(404).json({
                    status: "fail",
                    message: "משתמש לא נמצא"
                });
            }

            console.log('Successfully updated personal details');
            res.status(200).json({
                status: "success",
                data: details.personalDetails
            });

        } catch (error) {
            console.error('Detailed error in createMyPersonalDetails:', {
                error: error.message,
                stack: error.stack,
                user: req?.user,
                body: req?.body
            });
            res.status(500).json({
                status: "error",
                message: "שגיאה בעדכון הפרטים",
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },
   
    updateMyPersonalDetails: async (req, res) => {
        try {
            const details = await User.findByIdAndUpdate(
                req.user._id,
                { personalDetails: req.body },
                { new: true, runValidators: true }
            );

            if (!details) {
                return res.status(404).json({
                    status: "error",
                    message: "משתמש לא נמצא"
                });
            }

            res.status(200).json({ 
                status: "success", 
                data: details.personalDetails 
            });
        } catch (error) {
            console.error('Update personal details error:', error);
            res.status(400).json({ 
                status: "fail", 
                message: error.message 
            });
        }
    },

    getMyPersonalDetails: async (req, res) => {
        try {
            const user = await User.findById(req.user._id);
            if (!user || !user.personalDetails) {
                return res.status(404).json({
                    status: "error",
                    message: "לא נמצאו פרטים אישיים"
                });
            }
            res.status(200).json({ 
                status: "success", 
                data: user.personalDetails 
            });
        } catch (error) {
            console.error('Get personal details error:', error);
            res.status(400).json({ 
                status: "fail", 
                message: error.message 
            });
        }
    },

    // ניהול משתמשים - עכשיו מוגן על ידי middleware
    getUsers: async (req, res) => {
        try {
            // בדיקת הרשאות admin כבר נעשית ב-middleware
            const users = await User.find().select('-password');
            res.status(200).json({
                status: 'success',
                data: { users }
            });
        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({
                status: 'error',
                message: 'שגיאה בקבלת רשימת משתמשים'
            });
        }
    },

    createUser: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 'error',
                    message: 'נתונים לא תקינים',
                    errors: errors.array()
                });
            }

            // הגנה נוספת - רק admin יכול להגדיר תפקידים
            const role = req.user.role === 'admin' ? req.body.role : 'user';
            
            const hashedPassword = await bcrypt.hash(req.body.password, 12);
            const newUser = await User.create({
                ...req.body,
                password: hashedPassword,
                role
            });

            res.status(201).json({
                status: 'success',
                data: {
                    user: {
                        id: newUser._id,
                        username: newUser.username,
                        email: newUser.email,
                        role: newUser.role
                    }
                }
            });
        } catch (error) {
            console.error('Create user error:', error);
            res.status(500).json({
                status: 'error',
                message: 'שגיאה ביצירת משתמש'
            });
        }
    },

    getStatistic: async (req, res) => {
        try {
            // בדיקת הרשאות admin כבר נעשית ב-middleware
            const [totalUsers, recentLogins, usersByRole] = await Promise.all([
                User.countDocuments(),
                Login.find()
                    .sort({ timestamp: -1 })
                    .limit(10)
                    .populate('user', 'username email'),
                User.aggregate([
                    { $group: { _id: '$role', count: { $sum: 1 } } }
                ])
            ]);

            res.status(200).json({
                status: 'success',
                data: { totalUsers, recentLogins, usersByRole }
            });
        } catch (error) {
            console.error('Get statistics error:', error);
            res.status(500).json({
                status: 'error',
                message: 'שגיאה בקבלת סטטיסטיקה'
            });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id).select('-password');
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'משתמש לא נמצא'
                });
            }

            res.status(200).json({
                status: 'success',
                data: { user }
            });
        } catch (error) {
            console.error('Get user by ID error:', error);
            res.status(500).json({
                status: 'error',
                message: 'שגיאה בקבלת פרטי משתמש'
            });
        }
    },

    updateUserById: async (req, res) => {
        try {
            const { password, ...updateData } = req.body;
            
            // רק admin יכול לעדכן תפקידים
            if (updateData.role && req.user.role !== 'admin') {
                delete updateData.role;
            }

            if (password) {
                updateData.password = await bcrypt.hash(password, 12);
            }

            const user = await User.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'משתמש לא נמצא'
                });
            }

            res.status(200).json({
                status: 'success',
                data: { user }
            });
        } catch (error) {
            console.error('Update user error:', error);
            res.status(500).json({
                status: 'error',
                message: 'שגיאה בעדכון משתמש'
            });
        }
    },

    deleteUserById: async (req, res) => {
        try {
            // בדיקת הרשאות admin כבר נעשית ב-middleware
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'משתמש לא נמצא'
                });
            }

            await Login.deleteMany({ user: req.params.id });

            res.status(200).json({
                status: 'success',
                message: 'משתמש נמחק בהצלחה'
            });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({
                status: 'error',
                message: 'שגיאה במחיקת משתמש'
            });
        }
    },

    logout: async (req, res) => {
        try {
            // נבצע פעולות נוספות אם נדרש (למשל, רישום ה-logout)
            res.status(200).json({
                status: 'success',
                message: 'התנתקת בהצלחה'
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                status: 'error',
                message: 'שגיאה בהתנתקות'
            });
        }
    },

    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user._id).select('-password');
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'משתמש לא נמצא'
                });
            }
            res.status(200).json({
                status: 'success',
                data: { user }
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                status: 'error',
                message: 'שגיאה בקבלת פרופיל'
            });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const { password, role, ...updateData } = req.body;
            
            if (password) {
                updateData.password = await bcrypt.hash(password, 12);
            }

            const user = await User.findByIdAndUpdate(
                req.user._id,
                updateData,
                { new: true, runValidators: true }
            ).select('-password');

            res.status(200).json({
                status: 'success',
                data: { user }
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                status: 'error',
                message: 'שגיאה בעדכון פרופיל'
            });
        }
    },

    // קבלת כל הנתונים של המשתמש המחובר
    getMyData: async (req, res) => {
        try {
            console.log('Getting user data for:', req.user._id);
            const user = await User.findById(req.user._id);
            
            if (!user) {
                return res.status(404).json({
                    status: "fail",
                    message: "משתמש לא נמצא"
                });
            }

            console.log('User data:', {
                id: user._id,
                username: user.username,
                personalDetails: user.personalDetails
            });

            res.status(200).json({
                status: "success",
                data: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    personalDetails: user.personalDetails
                }
            });
        } catch (error) {
            console.error('Error in getMyData:', error);
            res.status(500).json({
                status: "error",
                message: "שגיאה בקבלת נתוני המשתמש"
            });
        }
    },

    googleAuth: async (req, res) => {
        try {
            console.log('Google Auth Request Body:', req.body);
            
            const { email, name, picture, sub } = req.body;
            console.log('Received user info:', { email, name, picture, sub });

            if (!email || !name || !sub) {
                console.error('Missing required fields:', { email, name, sub });
                return res.status(400).json({
                    status: 'error',
                    message: 'חסרים פרטי משתמש'
                });
            }

            // חיפוש או יצירת משתמש
            let user = await User.findOne({ email });
            console.log('Existing user:', user);
            
            if (!user) {
                console.log('Creating new user...');
                // יצירת משתמש חדש
                user = await User.create({
                    email,
                    name,
                    picture,
                    googleId: sub,
                    username: email // שימוש באימייל כשם משתמש
                });
                console.log('Created new user:', user);
            } else {
                console.log('Updating existing user...');
                // עדכון פרטי משתמש קיים
                user.name = name;
                user.picture = picture;
                user.googleId = sub;
                await user.save();
                console.log('Updated user:', user);
            }

            // יצירת JWT
            const jwtPayload = { 
                id: user._id,
                email: user.email,
                name: user.name
            };
            console.log('Creating JWT with payload:', jwtPayload);
            
            const jwtToken = jwt.sign(
                jwtPayload,
                JWT_SECRET,
                { expiresIn: '1d' }
            );

            const response = {
                status: 'success',
                token: jwtToken,
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        picture: user.picture
                    }
                }
            };
            console.log('Sending response:', response);

            res.status(200).json(response);
        } catch (error) {
            console.error('Google auth error:', error);
            res.status(401).json({
                status: 'error',
                message: error.message || 'שגיאה באימות משתמש Google'
            });
        }
    }
};

module.exports = userController;