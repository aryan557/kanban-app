const Task = require('../models/Task');
const User = require('../models/User');
const ActionLog = require('../models/ActionLog');
const BoardAssignIndex = require('../models/BoardAssignIndex');

// Helper: log action
async function logAction(userId, action, taskId, details) {
  await ActionLog.create({ user: userId, action, task: taskId, details });
}

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, boardId } = req.body;
    // Validate title
    if (["Todo", "In Progress", "Done"].includes(title)) {
      return res.status(400).json({ message: 'Task title cannot match column names' });
    }
    const existing = await Task.findOne({ title, boardId });
    if (existing) {
      return res.status(400).json({ message: 'Task title must be unique per board' });
    }
    const task = await Task.create({
      title,
      description,
      priority,
      boardId,
    });
    await logAction(req.user.id, 'created', task._id, `Created task '${title}'`);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all tasks for a board
exports.getTasks = async (req, res) => {
  try {
    const { boardId } = req.query;
    const tasks = await Task.find({ boardId }).populate('assignedUser', 'username email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// In-memory last assigned index per board (for demo; use DB in production)
const lastAssignedIndexMap = {};

exports.smartAssign = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can smart assign tasks' });
    }
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Get all users with role 'user', sorted for consistent order
    const users = await User.find({ role: 'user' }).sort({ _id: 1 });
    if (users.length === 0) return res.status(400).json({ message: 'No users to assign' });

    // Persistent last assigned index per board
    const boardKey = task.boardId || 'default';
    let boardIndexDoc = await BoardAssignIndex.findOne({ boardId: boardKey });
    if (!boardIndexDoc) {
      boardIndexDoc = await BoardAssignIndex.create({ boardId: boardKey, lastIndex: -1 });
    }
    let lastIndex = boardIndexDoc.lastIndex;
    const nextIndex = (lastIndex + 1) % users.length;
    const nextUser = users[nextIndex];

    // Assign task
    task.assignedUser = nextUser._id;
    task.status = 'In Progress';
    await task.save();

    // Update last assigned index in DB
    boardIndexDoc.lastIndex = nextIndex;
    await boardIndexDoc.save();

    // Log action
    await ActionLog.create({
      user: req.user.id,
      action: 'smart-assigned',
      task: task._id,
      details: `Smart assigned to ${nextUser.username}`
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Smart assign failed', error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    if (req.body.assignedUser && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can assign tasks' });
    }
    const { taskId } = req.params;
    const updates = req.body;
    const allowedStatuses = ['Todo', 'In Progress', 'Done'];
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (updates.title) task.title = updates.title;
    if (updates.description !== undefined) task.description = updates.description;
    if (updates.priority) task.priority = updates.priority;
    if (updates.status && allowedStatuses.includes(updates.status)) task.status = updates.status;
    if (updates.assignedUser) task.assignedUser = updates.assignedUser;

    await task.save();
    await logAction(req.user.id, 'updated', task._id, `Updated task '${task.title}'`);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await logAction(req.user.id, 'deleted', taskId, `Deleted task '${task.title}'`);
    res.json({ message: 'Task deleted', task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err.message });
  }
}; 