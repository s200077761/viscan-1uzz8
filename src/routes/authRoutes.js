const express = require('express');
const router = express.Router();
const { register, login, verify, protect } = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/verify', protect, verify);

module.exports = router;
