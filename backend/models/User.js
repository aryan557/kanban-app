const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }], // max 5, enforce in logic
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 