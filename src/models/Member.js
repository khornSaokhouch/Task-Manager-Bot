const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true, // helps identify users reliably
    unique: true
  },
  name: { type: String, required: true },
  username: String,
  role: { type: String, enum: ['Admin', 'Member'], default: 'Member' },
  skills: [String],
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  tasksAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
