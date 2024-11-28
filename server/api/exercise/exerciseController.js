const CurrentExercise = require('./exerciseModel');

// קבלת האימונים של המשתמש המחובר
exports.getExercises = async function (req, res, next) {
    try {
        const exercises = await CurrentExercise.find({ userId: req.user._id });
        res.status(200).json({
            status: "success",
            results: exercises.length,
            data: exercises
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// קבלת כל האימונים (למנהלים בלבד)
exports.getAllExercises = async function (req, res, next) {
    try {
        const exercises = await CurrentExercise.find().populate('userId', 'name email');
        res.status(200).json({
            status: "success",
            results: exercises.length,
            data: exercises
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// קבלת אימון ספציפי
exports.getExerciseById = async function (req, res, next) {
    try {
        const exercise = await CurrentExercise.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!exercise) {
            return res.status(404).json({
                status: "fail",
                message: "האימון לא נמצא או שאין לך הרשאה לצפות בו"
            });
        }

        res.status(200).json({ status: "success", data: exercise });
    } catch (error) {
        res.status(404).json({ status: "fail", message: error.message });
    }
};

// יצירת אימון חדש
exports.createExercise = async function (req, res, next) {
    try {
        const exerciseData = {
            ...req.body,
            userId: req.user._id
        };

        const newExercise = await CurrentExercise.create(exerciseData);
        res.status(201).json({
            status: "success",
            data: newExercise
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// עדכון אימון
exports.updateExerciseById = async function (req, res, next) {
    try {
        const exercise = await CurrentExercise.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!exercise) {
            return res.status(404).json({
                status: "fail",
                message: "האימון לא נמצא או שאין לך הרשאה לערוך אותו"
            });
        }

        res.status(200).json({ status: "success", data: exercise });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// מחיקת אימון
exports.deleteExerciseById = async function (req, res, next) {
    try {
        const exercise = await CurrentExercise.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!exercise) {
            return res.status(404).json({
                status: "fail",
                message: "האימון לא נמצא או שאין לך הרשאה למחוק אותו"
            });
        }

        res.status(204).json({ status: "success", data: null });
    } catch (error) {
        res.status(404).json({ status: "fail", message: error.message });
    }
};

// סטטיסטיקות אישיות
exports.getStatistic = async function (req, res, next) {
    try {
        const stats = await CurrentExercise.aggregate([
            { $match: { userId: req.user._id } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgDuration: { $avg: '$duration' },
                    avgSets: { $avg: '$sets' },
                    avgReps: { $avg: '$reps' }
                }
            }
        ]);

        res.status(200).json({ status: "success", data: stats });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// סטטיסטיקות כלליות (למנהלים בלבד)
exports.getAllStats = async function (req, res, next) {
    try {
        const stats = await CurrentExercise.aggregate([
            {
                $group: {
                    _id: { category: '$category', userId: '$userId' },
                    count: { $sum: 1 },
                    avgDuration: { $avg: '$duration' },
                    avgSets: { $avg: '$sets' },
                    avgReps: { $avg: '$reps' }
                }
            },
            {
                $group: {
                    _id: '$_id.category',
                    userCount: { $sum: 1 },
                    totalExercises: { $sum: '$count' },
                    avgDuration: { $avg: '$avgDuration' },
                    avgSets: { $avg: '$avgSets' },
                    avgReps: { $avg: '$avgReps' }
                }
            }
        ]);

        res.status(200).json({ status: "success", data: stats });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// קבלת האימונים האחרונים של המשתמש
exports.getLatestExercises = async (req, res) => {
    try {
        const exercises = await CurrentExercise.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5);
        
        res.status(200).json({
            status: 'success',
            data: exercises
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בקבלת האימונים האחרונים'
        });
    }
};

// קבלת האימונים המועדפים
exports.getFavoriteExercises = async (req, res) => {
    try {
        const exercises = await CurrentExercise.find({ 
            userId: req.user._id,
            isFavorite: true 
        });
        
        res.status(200).json({
            status: 'success',
            data: exercises
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בקבלת האימונים המועדפים'
        });
    }
};

// קבלת סטטיסטיקות שבועיות
exports.getWeeklyStats = async (req, res) => {
    try {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        
        const stats = await CurrentExercise.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    createdAt: { $gte: startOfWeek }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$createdAt" },
                    count: { $sum: 1 },
                    totalDuration: { $sum: "$duration" }
                }
            }
        ]);
        
        res.status(200).json({
            status: 'success',
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בקבלת סטטיסטיקות שבועיות'
        });
    }
};

// קבלת סטטיסטיקות חודשיות
exports.getMonthlyStats = async (req, res) => {
    try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        
        const stats = await CurrentExercise.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    createdAt: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: { $dayOfMonth: "$createdAt" },
                    count: { $sum: 1 },
                    totalDuration: { $sum: "$duration" }
                }
            }
        ]);
        
        res.status(200).json({
            status: 'success',
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בקבלת סטטיסטיקות חודשיות'
        });
    }
};

// קבלת התקדמות לפי קבוצת שרירים
exports.getMuscleGroupProgress = async (req, res) => {
    try {
        const { muscleGroup } = req.params;
        
        const progress = await CurrentExercise.find({
            userId: req.user._id,
            muscleGroup
        }).sort({ createdAt: 1 });
        
        res.status(200).json({
            status: 'success',
            data: progress
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בקבלת נתוני התקדמות'
        });
    }
};

// קבלת אימונים של משתמש ספציפי (למנהלים)
exports.getUserExercises = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const exercises = await CurrentExercise.find({ userId })
            .populate('userId', 'username name');
        
        res.status(200).json({
            status: 'success',
            data: exercises
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בקבלת אימוני המשתמש'
        });
    }
};

// קבלת משתמשים לא פעילים (למנהלים)
exports.getInactiveUsers = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const inactiveUsers = await CurrentExercise.aggregate([
            {
                $group: {
                    _id: "$userId",
                    lastActivity: { $max: "$createdAt" }
                }
            },
            {
                $match: {
                    lastActivity: { $lt: thirtyDaysAgo }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            }
        ]);
        
        res.status(200).json({
            status: 'success',
            data: inactiveUsers
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בקבלת משתמשים לא פעילים'
        });
    }
};
