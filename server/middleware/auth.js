const jwt = require('jsonwebtoken');
const {User} = require('../api/User/UserModel');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        console.log('Authenticated user:', user);
        console.log(next);
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ status: "fail", message: "אנא התחבר למערכת" });
    }
};

module.exports = auth;
