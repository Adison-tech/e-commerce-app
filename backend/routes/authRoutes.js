// backend/routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a user
router.post(
    '/register',
    [
        body('username', 'Username is required').not().isEmpty(),
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    register
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post(
    '/login',
    [
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Password is required').exists(),
    ],
    login
);

// @route   GET /api/auth/profile
// @desc    Get user profile (protected route)
router.get('/profile', auth, (req, res) => {
    // req.user is attached by the auth middleware
    res.status(200).json(req.user);
});

// @route   GET /api/auth/admin
// @desc    Admin-only route
router.get('/admin', auth, authorizeRole('admin'), (req, res) => {
    res.status(200).json({ message: 'Welcome, admin!' });
});

module.exports = router;