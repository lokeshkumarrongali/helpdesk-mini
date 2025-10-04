const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // for threaded comments
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);


