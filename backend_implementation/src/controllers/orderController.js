const { Order, OrderItem, CustomizedBook, User } = require('../models');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { customizedBookId, format, quantity } = req.body;
    
    // Check if customized book exists
    const customizedBook = await CustomizedBook.findByPk(customizedBookId);
    if (!customizedBook) {
      return res.status(404).json({ message: 'Customized book not found' });
    }
    
    // Determine price based on format
    let price;
    switch (format) {
      case 'digital':
        price = 9.99;
        break;
      case 'paperback':
        price = 19.99;
        break;
      case 'hardcover':
        price = 29.99;
        break;
      default:
        price = 9.99;
    }
    
    // Calculate total amount
    const totalAmount = price * (quantity || 1);
    
    // Create order
    const order = await Order.create({
      user_id: req.user.id,
      total_amount: totalAmount,
      status: 'pending'
    });
    
    // Create order item
    const orderItem = await OrderItem.create({
      order_id: order.id,
      customized_book_id: customizedBookId,
      format,
      price,
      quantity: quantity || 1
    });
    
    res.status(201).json({
      order,
      items: [orderItem]
    });
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: OrderItem,
        include: [{ model: CustomizedBook }]
      }],
      order: [['created_at', 'DESC']]
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findOne({
      where: { id, user_id: req.user.id },
      include: [{
        model: OrderItem,
        include: [{ model: CustomizedBook }]
      }]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error in getOrderById:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!['pending', 'paid', 'fulfilled', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findOne({
      where: { id, user_id: req.user.id }
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    await order.save();
    
    res.json(order);
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Process payment for an order
exports.processPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, paymentDetails } = req.body;
    
    const order = await Order.findOne({
      where: { id, user_id: req.user.id }
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order is not in pending status' });
    }
    
    // In a real application, this would integrate with a payment gateway
    // For this implementation, we'll simulate a successful payment
    
    // Generate a fake payment ID
    const paymentId = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    
    // Update order
    order.payment_id = paymentId;
    order.status = 'paid';
    await order.save();
    
    res.json({
      order,
      payment: {
        id: paymentId,
        amount: order.total_amount,
        status: 'completed',
        method: paymentMethod
      }
    });
  } catch (error) {
    console.error('Error in processPayment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get order items for an order
exports.getOrderItems = async (req, res) => {
  try {
    const { id } = req.params;
    
    const orderItems = await OrderItem.findAll({
      where: { order_id: id },
      include: [{ model: CustomizedBook }]
    });
    
    res.json(orderItems);
  } catch (error) {
    console.error('Error in getOrderItems:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
