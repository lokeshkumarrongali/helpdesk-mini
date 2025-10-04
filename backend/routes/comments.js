const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/auth');

// POST /comments - Add a comment to a ticket
router.post('/', authMiddleware, async (req, res) => {
  const { ticket, content, parentComment } = req.body;

  try {
    const comment = new Comment({
      ticket,
      author: req.user.id,
      content,
      parentComment: parentComment || null,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error });
  }
});

// GET /comments/:ticketId - Get all comments for a ticket
router.get('/:ticketId', authMiddleware, async (req, res) => {
  try {
    const comments = await Comment.find({ ticket: req.params.ticketId })
      .populate('author', 'name email')
      .sort({ createdAt: 1 }); // Oldest first
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments', error });
  }
});

module.exports = router;
