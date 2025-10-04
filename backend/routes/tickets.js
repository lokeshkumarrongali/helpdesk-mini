const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, ticketController.getTickets);
router.post('/', authMiddleware, ticketController.createTicket);
router.get('/:id', authMiddleware, ticketController.getTicketById);
router.patch('/:id', authMiddleware, ticketController.updateTicket);
router.delete('/:id', authMiddleware, ticketController.deleteTicket);

module.exports = router;
