// server/api/User/UserRoute.js
const express = require('express');
const router = express.Router();
const userController = require('./UserController');
const { protect, restrictTo } = require('../../middleware/authMiddleware');

// Middleware לרישום בקשות
router.use((req, res, next) => {
   console.log('User Router:', req.method, req.path);
   next();
});

// נתיב הרשמה
router.post('/register', userController.createRegister);

// נתיבי אימות
router.post('/login', userController.login);
router.post('/google-auth', userController.googleAuth);
router.post('/google-auth-new', userController.googleAuth); // הוספת נתיב Google Auth
router.post('/logout', userController.logout);

// נתיבי אדמין
router.post('/admin/register', userController.adminRegister);
router.post('/admin/login', userController.adminLogin);

// נתיבי פרטים אישיים - מוגנים
router.post('/me/personal-details', protect, userController.createMyPersonalDetails);
router.put('/me/personal-details', protect, userController.updateMyPersonalDetails);
router.get('/me/personal-details', protect, userController.getMyPersonalDetails);

// נתיבי פרופיל משתמש
router.get('/me', protect, userController.getProfile);
router.get('/me/data', protect, userController.getMyData);  // נתיב חדש לקבלת כל הנתונים
router.put('/me', protect, userController.updateProfile);

// נתיבי משתמש כלליים
router.get('/', protect, restrictTo('admin'), userController.getUsers);
router.post('/', protect, restrictTo('admin'), userController.createUser);
router.get('/get/statistic', protect, restrictTo('admin'), userController.getStatistic);
router.get('/:id', protect, restrictTo('admin'), userController.getUserById);
router.patch('/:id', protect, restrictTo('admin'), userController.updateUserById);
router.delete('/:id', protect, restrictTo('admin'), userController.deleteUserById);

module.exports = router;