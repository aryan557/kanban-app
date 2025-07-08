const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');
const auth = require('../middleware/auth');

router.get('/recent', auth, actionController.getRecentActions);

module.exports = router; 