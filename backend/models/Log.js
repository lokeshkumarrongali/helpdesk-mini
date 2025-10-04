const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  action: { type: String, required: true },     // e.g. 'created', 'status_changed', 'comment_added'
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: false });

module.exports = mongoose.model('Log', logSchema);

