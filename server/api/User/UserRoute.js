// server/api/User/UserRoute.js
const express = require('express');
const router = express.Router();
const userController = require('./UserController');
const { protect } = require('../../middleware/authMiddleware');

// Middleware לרישום בקשות
router.use((req, res, next) => {
   console.log('User Router:', req.method, req.path);
   next();
});

// נתיב הרשמה
router.post('/register', userController.createRegister);

// נתיבי אימות
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// נתיבי פרטים אישיים - מוגנים
router.post('/me/personal-details', protect, userController.createMyPersonalDetails);
router.put('/me/personal-details', protect, userController.updateMyPersonalDetails);
router.get('/me/personal-details', protect, userController.getMyPersonalDetails);

// נתיבי פרופיל משתמש
router.get('/me', protect, userController.getProfile);
router.get('/me/data', protect, userController.getMyData);  // נתיב חדש לקבלת כל הנתונים
router.put('/me', protect, userController.updateProfile);

// נתיבי משתמש כלליים
router.get('/', protect, userController.getUsers);
router.post('/', protect, userController.createUser);
router.get('/get/statistic', protect, userController.getStatistic);
router.get('/:id', protect, userController.getUserById);
router.patch('/:id', protect, userController.updateUserById);
router.delete('/:id', protect, userController.deleteUserById);

module.exports = router;