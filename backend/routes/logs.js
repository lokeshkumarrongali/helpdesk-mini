const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const authMiddleware = require('../middleware/auth');

// POST /logs - Add a log entry
router.post('/', authMiddleware, async (req, res) => {
  const { ticket, action } = req.body;

  try {
    const log = new Log({
      ticket,
      action,
      actor: req.user.id,
      timestamp: new Date(),
    });
    await log.save();

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add log entry', error });
  }
});

// GET /logs/:ticketId - Get timeline logs for a ticket
router.get('/:ticketId', authMiddleware, async (req, res) => {
  try {
    const logs = await Log.find({ ticket: req.params.ticketId })
      .populate('actor', 'name email role')
      .sort({ timestamp: 1 }); // Chronological order

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch logs', error });
  }
});

module.exports = router;
