const mongoose = require('mongoose');

const actionLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., 'created', 'updated', 'deleted', 'assigned', 'moved'
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  details: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ActionLog', actionLogSchema); 