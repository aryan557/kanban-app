const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/auth');

// Create a new group
router.post('/create', authMiddleware, groupController.createGroup);

// Join an existing group
router.post('/join', authMiddleware, groupController.joinGroup);

// List groups the user belongs to
router.get('/my', authMiddleware, groupController.listUserGroups);

module.exports = router; 