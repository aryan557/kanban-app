const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.post('/', auth, taskController.createTask);
router.get('/', auth, taskController.getTasks);
router.put('/:taskId/smart-assign', auth, taskController.smartAssign);
router.put('/:taskId', auth, taskController.updateTask);
router.delete('/:taskId', auth, taskController.deleteTask);

module.exports = router; 