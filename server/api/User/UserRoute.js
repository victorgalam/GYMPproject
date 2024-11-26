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

// נתיבי משתמש
router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.get('/get/statistic', userController.getStatistic);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUserById);

// נתיבים לפרטים אישיים
router.post('/me/personal-details', userController.createMyPersonalDetails);
router.put('/me/personal-details', userController.updateMyPersonalDetails);
router.get('/me/personal-details', userController.getMyPersonalDetails);

// נתיבי פרופיל משתמש
router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);

module.exports = router;