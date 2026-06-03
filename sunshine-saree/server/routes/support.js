const express = require('express');
const router = express.Router();
const {
  createTicket,
  getMyTickets,
  getAllTickets,
  replyToTicket,
  updateTicketStatus,
} = require('../controllers/supportController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Optional auth for ticket creation (works for guests too)
const optionalAuth = async (req, res, next) => {
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Token invalid but that's ok for optional auth
    }
  }
  next();
};

router.post('/', optionalAuth, createTicket);
router.get('/my-tickets', verifyToken, getMyTickets);
router.get('/', verifyToken, isAdmin, getAllTickets);
router.put('/:id/reply', verifyToken, isAdmin, replyToTicket);
router.put('/:id/status', verifyToken, isAdmin, updateTicketStatus);

module.exports = router;
