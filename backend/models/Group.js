const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema); 