const Ticket = require('../models/Ticket');

// GET /tickets - search & paginate tickets with latest comment
exports.getTickets = async (req, res) => {
  const { search = '', page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const ticketsAggregate = [
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "ticket",
          pipeline: [
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            { $project: { content: 1 } }
          ],
          as: "latestComment"
        }
      },
      {
        $addFields: {
          latestCommentContent: { $arrayElemAt: ["$latestComment.content", 0] }
        }
      },
      {
        $match: {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { latestCommentContent: { $regex: search, $options: "i" } }
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) }
    ];

    const countAggregate = [
      ...ticketsAggregate.slice(0, 3), // lookup + addFields + match
      { $count: "total" }
    ];

    const [tickets, countResult] = await Promise.all([
      Ticket.aggregate(ticketsAggregate),
      Ticket.aggregate(countAggregate)
    ]);

    const total = countResult.length > 0 ? countResult[0].total : 0;

    // ✅ Always return tickets as array
    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      tickets: tickets || []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tickets", error });
  }
};

// POST /tickets - create new ticket
exports.createTicket = async (req, res) => {
  try {
    const { title, description, sla_deadline, assignedTo, status } = req.body;
    const ticket = new Ticket({ title, description, sla_deadline, assignedTo, status });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create ticket', error });
  }
};

// GET /tickets/:id - get ticket by id
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('assignedTo', 'name email');
    if (!ticket) {
      return res.json({ ticket: null, message: 'Ticket not found' }); // ✅ Consistent shape
    }
    res.json({ ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get ticket', error });
  }
};

// PATCH /tickets/:id - update ticket with optimistic locking
exports.updateTicket = async (req, res) => {
  const { version, ...updateFields } = req.body;

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.json({ ticket: null, message: 'Ticket not found' }); // ✅ Consistent
    }

    if (version !== ticket.version) {
      return res.status(409).json({ message: 'Conflict: Ticket was updated by another process' });
    }

    Object.keys(updateFields).forEach(field => {
      ticket[field] = updateFields[field];
    });

    ticket.version++;
    await ticket.save();

    res.json({ ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update ticket', error });
  }
};

// DELETE /tickets/:id - delete ticket
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.json({ ticket: null, message: 'Ticket not found' }); // ✅ Consistent
    }
    res.json({ message: 'Ticket deleted', ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete ticket', error });
  }
};
