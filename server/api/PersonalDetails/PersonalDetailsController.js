const PersonalDetails = require('./PersonalDetailsModel');

const personalDetailsController = {
    // יצירת פרטים אישיים חדשים
    create: async (req, res) => {
        try {
            // בדיקה אם כבר קיימים פרטים אישיים למשתמש
            const existingDetails = await PersonalDetails.findOne({ userId: req.user._id });
            if (existingDetails) {
                return res.status(400).json({
                    status: "fail",
                    message: "פרטים אישיים כבר קיימים למשתמש זה"
                });
            }

            // יצירת פרטים אישיים חדשים
            const personalDetails = await PersonalDetails.create({
                userId: req.user._id,
                ...req.body
            });

            res.status(201).json({
                status: "success",
                data: personalDetails
            });
        } catch (error) {
            console.error('Error in create personal details:', error);
            res.status(400).json({
                status: "fail",
                message: error.message
            });
        }
    },

    // עדכון פרטים אישיים
    update: async (req, res) => {
        try {
            const personalDetails = await PersonalDetails.findOneAndUpdate(
                { userId: req.user._id },
                req.body,
                { new: true, runValidators: true }
            );

            if (!personalDetails) {
                return res.status(404).json({
                    status: "fail",
                    message: "לא נמצאו פרטים אישיים למשתמש זה"
                });
            }

            res.status(200).json({
                status: "success",
                data: personalDetails
            });
        } catch (error) {
            console.error('Error in update personal details:', error);
            res.status(400).json({
                status: "fail",
                message: error.message
            });
        }
    },

    // קבלת פרטים אישיים של המשתמש המחובר
    getMyDetails: async (req, res) => {
        try {
            const personalDetails = await PersonalDetails.findOne({ userId: req.user._id });

            if (!personalDetails) {
                return res.status(404).json({
                    status: "fail",
                    message: "לא נמצאו פרטים אישיים"
                });
            }

            res.status(200).json({
                status: "success",
                data: personalDetails
            });
        } catch (error) {
            console.error('Error in get personal details:', error);
            res.status(500).json({
                status: "error",
                message: error.message
            });
        }
    },

    // קבלת פרטים אישיים לפי ID (למנהלים)
    getById: async (req, res) => {
        try {
            const personalDetails = await PersonalDetails.findById(req.params.id);

            if (!personalDetails) {
                return res.status(404).json({
                    status: "fail",
                    message: "לא נמצאו פרטים אישיים"
                });
            }

            res.status(200).json({
                status: "success",
                data: personalDetails
            });
        } catch (error) {
            console.error('Error in get personal details by id:', error);
            res.status(500).json({
                status: "error",
                message: error.message
            });
        }
    },

    // קבלת כל הפרטים האישיים (למנהלים)
    getAll: async (req, res) => {
        try {
            const personalDetails = await PersonalDetails.find();

            res.status(200).json({
                status: "success",
                results: personalDetails.length,
                data: personalDetails
            });
        } catch (error) {
            console.error('Error in get all personal details:', error);
            res.status(500).json({
                status: "error",
                message: error.message
            });
        }
    }
};

module.exports = personalDetailsController;
