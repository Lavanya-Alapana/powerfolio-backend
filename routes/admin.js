const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const adminController = require('../controllers/adminController');

// Protect all routes with auth and admin middleware
router.use(auth, admin);

router.get('/stats', adminController.getStats);
router.get('/projects', adminController.getAllProjects);
router.put('/projects/:id/status', adminController.updateProjectStatus);
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
