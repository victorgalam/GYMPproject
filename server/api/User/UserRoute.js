// userRouter.js
const express = require('express');
const userRouter = express.Router();
const userController = require('./UserController');

userRouter.get('/', userController.getUsers);
userRouter.post('/', userController.createUser);
userRouter.get('/:id', userController.getUserById);
userRouter.patch('/:id', userController.updateUserById);
userRouter.delete('/:id', userController.deleteUserById);
userRouter.get('/get/statistic', userController.getStatistic);


module.exports = userRouter;
