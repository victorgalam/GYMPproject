// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../api/User/UserModel'); // התאם את הנתיב למודל שלך

exports.protect = async (req, res, next) => {
    try {
        // בדיקה האם יש token בהדר
        let token;
        
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        // אם אין token
        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'נא להתחבר כדי לגשת לעמוד זה'
            });
        }

        try {
            // אימות ה-token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // בדיקה האם המשתמש קיים
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return res.status(401).json({
                    status: 'fail',
                    message: 'המשתמש לא קיים במערכת'
                });
            }

            // הוספת המשתמש לבקשה
            req.user = currentUser;
            next();

        } catch (error) {
            return res.status(401).json({
                status: 'fail',
                message: 'טוקן לא תקין או פג תוקף'
            });
        }

    } catch (error) {
        console.error('Auth Error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'שגיאה בתהליך האימות'
        });
    }
};


