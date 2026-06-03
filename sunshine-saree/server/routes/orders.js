const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  trackOrder,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  addTrackingNumber,
  getOrderStats,
} = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/stats', verifyToken, isAdmin, getOrderStats);
router.get('/my-orders', verifyToken, getMyOrders);
router.get('/track/:orderId', trackOrder);
router.post('/', verifyToken, placeOrder);
router.get('/', verifyToken, isAdmin, getAllOrders);
router.get('/:id', verifyToken, getOrder);
router.put('/:id/status', verifyToken, isAdmin, updateOrderStatus);
router.put('/:id/tracking', verifyToken, isAdmin, addTrackingNumber);

module.exports = router;
