var CurrentExercise = require('./exerciseModel');

exports.createExercise = async function (req, res, next) {
    try {
        const newExercise = await CurrentExercise.create(req.body);
        res.status(201).json({
            status: "success",
            data: newExercise
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

exports.getExerciseById = function (req, res, next) {
    CurrentExercise.findById(req.params.id)
        .then(exercise => {
            res.status(200).json({ status: "success", data: exercise });
        })
        .catch(error => {
            res.status(404).json({ status: "fail", message: error.message });
        });
};

exports.updateExerciseById = function (req, res, next) {
    CurrentExercise.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        .then(updatedExercise => {
            res.status(200).json({ status: "success", data: updatedExercise });
        })
        .catch(error => {
            res.status(400).json({ status: "fail", message: error.message });
        });
};

exports.deleteExerciseById = function (req, res, next) {
    CurrentExercise.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).json({ status: "success", data: null });
        })
        .catch(error => {
            res.status(404).json({ status: "fail", message: error.message });
        });
};

exports.getExercises = async function (req, res, next) {
    try {
        const exercises = await CurrentExercise.find();
        res.status(200).json({ status: "success", data: exercises });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

exports.getStatistic = function (req, res, next) {
    // הוספת לוגיקה לסטטיסטיקות
};
