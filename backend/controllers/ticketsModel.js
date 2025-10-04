const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  created_by: String,
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  status: { type: String, enum: ['Open', 'Pending', 'Closed'], default: 'Open' },
  date_created: { type: Date, default: Date.now },
  category: String
});

module.exports = mongoose.model('Ticket', ticketSchema);
