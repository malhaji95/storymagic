const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Protected routes
router.post('/', authenticateUser, orderController.createOrder);
router.get('/', authenticateUser, orderController.getUserOrders);
router.get('/:id', authenticateUser, orderController.getOrderById);
router.put('/:id/status', authenticateUser, orderController.updateOrderStatus);
router.post('/:id/payment', authenticateUser, orderController.processPayment);
router.get('/:id/items', authenticateUser, orderController.getOrderItems);

module.exports = router;
