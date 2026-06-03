const SupportTicket = require('../models/SupportTicket');

// @desc    Create support ticket
// @route   POST /api/support
// @access  Public
const createTicket = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const ticket = await SupportTicket.create({
      user: req.user?._id || undefined,
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's tickets
// @route   GET /api/support/my-tickets
// @access  Private
const getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tickets (admin)
// @route   GET /api/support
// @access  Admin
const getAllTickets = async (req, res) => {
  try {
    let query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }

    const tickets = await SupportTicket.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reply to ticket (admin)
// @route   PUT /api/support/:id/reply
// @access  Admin
const replyToTicket = async (req, res) => {
  try {
    const { reply } = req.body;
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      {
        adminReply: reply,
        status: 'In Progress',
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update ticket status (admin)
// @route   PUT /api/support/:id/status
// @access  Admin
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getAllTickets,
  replyToTicket,
  updateTicketStatus,
};
