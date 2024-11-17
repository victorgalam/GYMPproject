const { User, Login } = require('./UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // צריך להתקין את החבילה

// נניח שיש לנו מפתח סודי בקובץ התצורה
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // רצוי לשמור במשתני סביבה

const userController = {
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

            // יצירת טוקן JWT
            const token = jwt.sign(
                { 
                    id: user._id,
                    username: user.username,
                    email: user.email 
                },
                JWT_SECRET,
                { expiresIn: '24h' } // תוקף הטוקן
            );

            // שמירת רשומת התחברות
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
                        email: user.email
                    },
                    token, // שליחת הטוקן ללקוח
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

    // Middleware לאימות טוקן
    authenticateToken: async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

            if (!token) {
                return res.status(401).json({
                    status: 'error',
                    message: 'לא נמצא טוקן הזדהות'
                });
            }

            jwt.verify(token, JWT_SECRET, (err, user) => {
                if (err) {
                    return res.status(403).json({
                        status: 'error',
                        message: 'טוקן לא תקין או פג תוקף'
                    });
                }
                req.user = user;
                next();
            });
        } catch (error) {
            console.error('Authentication error:', error);
            res.status(500).json({
                status: 'error',
                message: 'שגיאת אימות'
            });
        }
    }
};

module.exports = userController;