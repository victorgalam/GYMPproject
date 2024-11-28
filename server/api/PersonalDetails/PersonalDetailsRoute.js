const express = require('express');
const router = express.Router();
const personalDetailsController = require('./PersonalDetailsController');
const { protect, restrictTo } = require('../../middleware/authMiddleware');

// Middleware לרישום בקשות
router.use((req, res, next) => {
    console.log('Personal Details Router:', req.method, req.path);
    next();
});

// נתיבים למשתמש מחובר
router.post('/', protect, personalDetailsController.create);
router.put('/', protect, personalDetailsController.update);
router.get('/me', protect, personalDetailsController.getMyDetails);

// נתיבים למנהלים בלבד
router.get('/', protect, restrictTo('admin'), personalDetailsController.getAll);
router.get('/:id', protect, restrictTo('admin'), personalDetailsController.getById);

module.exports = router;
