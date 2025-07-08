const ActionLog = require('../models/ActionLog');

exports.getRecentActions = async (req, res) => {
  try {
    const actions = await ActionLog.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('user', 'username email')
      .populate('task', 'title');
    res.json(actions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 