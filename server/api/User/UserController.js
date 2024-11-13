var CurrentUser = require('./UserModel');

// יצירת משתמש חדש
exports.createUser = async function (req, res, next) {
    try {
        const newUser = await CurrentUser.create(req.body);
        res.status(201).json({
            status: "success",
            data: newUser
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// קריאת משתמש לפי ID
exports.getUserById = function (req, res, next) {
    CurrentUser.findById(req.params.id)
        .then(user => {
            res.status(200).json({ status: "success", data: user });
        })
        .catch(error => {
            res.status(404).json({ status: "fail", message: error.message });
        });
};

// עדכון משתמש לפי ID
exports.updateUserById = function (req, res, next) {
    CurrentUser.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        .then(updatedUser => {
            res.status(200).json({ status: "success", data: updatedUser });
        })
        .catch(error => {
            res.status(400).json({ status: "fail", message: error.message });
        });
};

// מחיקת משתמש לפי ID
exports.deleteUserById = function (req, res, next) {
    CurrentUser.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).json({ status: "success", data: null });
        })
        .catch(error => {
            res.status(404).json({ status: "fail", message: error.message });
        });
};

// קריאת כל המשתמשים
exports.getUsers = async function (req, res, next) {
    try {
        const users = await CurrentUser.find();
        res.status(200).json({ status: "success", data: users });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// סטטיסטיקות משתמשים
exports.getStatistic = function (req, res, next) {
    // הוספת לוגיקה לסטטיסטיקות
};

