const express = require('express');
const router = express.Router();
const Ticket = require('./ticketsModel');
const authMiddleware = require('./authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const newTicket = new Ticket(req.body);
  try {
    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
