// server/api/User/UserController.js
const { User, Login } = require('./UserModel');
const bcrypt = require('bcryptjs');

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

            // יצירת רשומת התחברות חדשה
            const loginRecord = await Login.create({
                user: user._id,
                lastLogin: new Date(),
                active: true
            });

            res.status(200).json({
                status: 'success',
                data: {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email
                    },
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

    // קבלת כל המשתמשים
    getUsers: async (req, res) => {
        try {
            const users = await User.find().select('-password');
            res.status(200).json({
                status: 'success',
                data: users
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // יצירת משתמש חדש
    createUser: async (req, res) => {
        try {
            const newUser = await User.create(req.body);
            const userWithoutPassword = newUser.toObject();
            delete userWithoutPassword.password;
            
            res.status(201).json({
                status: 'success',
                data: userWithoutPassword
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
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
                data: user
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // עדכון משתמש
    updateUserById: async (req, res) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            ).select('-password');

            if (!updatedUser) {
                return res.status(404).json({
                    status: 'error',
                    message: 'משתמש לא נמצא'
                });
            }

            res.status(200).json({
                status: 'success',
                data: updatedUser
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // מחיקת משתמש
    deleteUserById: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'משתמש לא נמצא'
                });
            }
            res.status(204).json({
                status: 'success',
                data: null
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // סטטיסטיקות
    getStatistic: async (req, res) => {
        try {
            const totalUsers = await User.countDocuments();
            const recentLogins = await Login.find()
                .sort({ lastLogin: -1 })
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
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};

module.exports = userController;