var CurrentRegister = require('./registerModel');

// פונקציה ליצירת משתמש חדש
exports.createRegister = async function (req, res, next) {
    try {
        const newRegister = await CurrentRegister.create(req.body);
        res.status(201).json({
            status: "success",
            data: newRegister
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};
