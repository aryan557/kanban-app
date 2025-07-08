const mongoose = require('mongoose');

const boardAssignIndexSchema = new mongoose.Schema({
  boardId: { type: String, required: true, unique: true },
  lastIndex: { type: Number, default: -1 },
});

module.exports = mongoose.model('BoardAssignIndex', boardAssignIndexSchema); 