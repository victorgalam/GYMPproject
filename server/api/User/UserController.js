const { User, Login } = require('./UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const userController = {
    // התחברות
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

            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'שם משתמש או סיסמה לא נכונים'
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
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
                    role: user.role // הוספת תפקיד לטוקן
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            const loginRecord = await Login.create({
                user: user._id,
                timestamp: new Date(),
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });
            
            res.status(200).json({
                status: 'success',
                data: {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    },
                    token,
                    loginRecord
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

    // אימות טוקן
    authenticateToken: async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    status: 'error',
                    message: 'לא נמצא טוקן הזדהות'
                });
            }

            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(403).json({
                        status: 'error',
                        message: 'טוקן לא תקין או פג תוקף'
                    });
                }
                req.user = decoded;
                next();
            });
        } catch (error) {
            console.error('Authentication error:', error);
            res.status(500).json({
                status: 'error',
                message: 'שגיאת אימות'
            });
        }
    },

    // בדיקת הרשאות מנהל
    isAdmin: async (req, res, next) => {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({
                    status: 'error',
                    message: 'אין הרשאות מתאימות'
                });
            }
            next();
        } catch (error) {
            console.error('Admin check error:', error);
            res.status(500).json({
                status: 'error',
                message: 'שגיאה בבדיקת הרשאות'
            });
        }
    },

    // קבלת כל המשתמשים
    getUsers: async (req, res) => {
        try {
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

    // יצירת משתמש חדש
    createUser: async (req, res) => {
        try {
            // בדיקת ולידציה
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 'error',
                    message: 'נתונים לא תקינים',
                    errors: errors.array()
                });
            }

            const { username, email, password, role = 'user' } = req.body;

            const existingUser = await User.findOne({
                $or: [{ username }, { email }]
            });

            if (existingUser) {
                return res.status(400).json({
                    status: 'error',
                    message: 'משתמש עם שם משתמש או אימייל זה כבר קיים'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = await User.create({
                username,
                email,
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

    // קבלת סטטיסטיקה
    getStatistic: async (req, res) => {
        try {
            const totalUsers = await User.countDocuments();
            const recentLogins = await Login.find()
                .sort({ timestamp: -1 })
                .limit(10)
                .populate('user', 'username email');

            const usersByRole = await User.aggregate([
                {
                    $group: {
                        _id: '$role',
                        count: { $sum: 1 }
                    }
                }
            ]);

            res.status(200).json({
                status: 'success',
                data: {
                    totalUsers,
                    recentLogins,
                    usersByRole
                }
            });
        } catch (error) {
            console.error('Get statistics error:', error);
            res.status(500).json({
                status: 'error',
                message: 'שגיאה בקבלת סטטיסטיקה'
            });
        }
    },

    // קבלת משתמש לפי ID
    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id).select('-password');
            
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'משתמש לא נמצא'
                });
            }

            // בדיקת הרשאות - רק מנהל או המשתמש עצמו יכולים לראות את הפרטים
            if (req.user.role !== 'admin' && req.user.id !== user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'אין הרשאות לצפייה בפרטי המשתמש'
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

    // עדכון משתמש לפי ID
    updateUserById: async (req, res) => {
        try {
            // בדיקת הרשאות - רק מנהל או המשתמש עצמו יכולים לעדכן
            if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'אין הרשאות לעדכון המשתמש'
                });
            }

            const { password, role, ...updateData } = req.body;
            
            // רק מנהל יכול לשנות תפקיד
            if (role && req.user.role !== 'admin') {
                return res.status(403).json({
                    status: 'error',
                    message: 'אין הרשאות לשינוי תפקיד'
                });
            }

            if (role) {
                updateData.role = role;
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

    // מחיקת משתמש לפי ID
    deleteUserById: async (req, res) => {
        try {
            // רק מנהל יכול למחוק משתמשים
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    status: 'error',
                    message: 'אין הרשאות למחיקת משתמש'
                });
            }

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
    }
};

module.exports = userController;