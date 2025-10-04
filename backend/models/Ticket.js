const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
  sla_deadline: { type: Date, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  version: { type: Number, default: 1 }, // For optimistic locking
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
