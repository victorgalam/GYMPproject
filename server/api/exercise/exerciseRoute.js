const express = require('express');
const exerciseRouter = express.Router();
const exerciseController = require('./ExerciseController');

exerciseRouter.get('/', exerciseController.getExercises);
exerciseRouter.post('/', exerciseController.createExercise);
exerciseRouter.get('/:id', exerciseController.getExerciseById);
exerciseRouter.patch('/:id', exerciseController.updateExerciseById);
exerciseRouter.delete('/:id', exerciseController.deleteExerciseById);
exerciseRouter.get('/get/statistic', exerciseController.getStatistic);

module.exports = exerciseRouter;
