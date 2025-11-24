const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// @route   GET api/users/:id/profile
// @desc    Get user profile by ID
// @access  Public
router.get('/:id/profile', userController.getUserProfile);

module.exports = router;
