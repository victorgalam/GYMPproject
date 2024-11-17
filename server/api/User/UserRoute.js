// server/api/User/UserRoute.js
const express = require('express');
const router = express.Router();
const userController = require('./UserController');

// Debug middleware
router.use((req, res, next) => {
    console.log('User Router:', req.method, req.path);
    next();
});

// Auth routes
router.post('/login', userController.login);

// User routes
router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.get('/get/statistic', userController.getStatistic);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUserById);

module.exports = router;