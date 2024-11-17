const { User, Login } = require('./UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const userController = {
    // פונקציית התחברות קיימת
    login: async (req, res) => {
        // ... הקוד הקיים שלך
    },

    // Middleware אימות קיים
    authenticateToken: async (req, res, next) => {
        // ... הקוד הקיים שלך
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
            const { username, email, password } = req.body;

            // בדיקה אם המשתמש קיים
            const existingUser = await User.findOne({
                $or: [{ username }, { email }]
            });

            if (existingUser) {
                return res.status(400).json({
                    status: 'error',
                    message: 'משתמש עם שם משתמש או אימייל זה כבר קיים'
                });
            }

            // הצפנת סיסמה
            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = await User.create({
                ...req.body,
                password: hashedPassword
            });

            res.status(201).json({
                status: 'success',
                data: {
                    user: {
                        id: newUser._id,
                        username: newUser.username,
                        email: newUser.email
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

            res.status(200).json({
                status: 'success',
                data: {
                    totalUsers,
                    recentLogins
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
            const { password, ...updateData } = req.body;
            
            // אם יש עדכון סיסמה, נצפין אותה
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
            const user = await User.findByIdAndDelete(req.params.id);
            
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'משתמש לא נמצא'
                });
            }

            // מחיקת כל רשומות ההתחברות של המשתמש
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