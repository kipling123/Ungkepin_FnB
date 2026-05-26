import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Order, Payment } from '../database-mongodb.js';

export function createOrderRoutes() {
  const router = Router();

  // Create order
  router.post('/', async (req, res, next) => {
    try {
      const { product, quantity, subtotal, deliveryType, deliveryPrice, total, address, fullName, phone } = req.body;
      const userId = req.userId;

      if (!product || !quantity || !total) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      console.log(`[Orders] Creating order for user: ${userId}`);

      const orderId = uuidv4();

      const order = new Order({
        _id: orderId,
        userId,
        productId: product.id || 'MENU_ITEM',
        productName: product.name,
        productImage: product.image || null,
        quantity,
        subtotal,
        deliveryType,
        deliveryPrice,
        total,
        address,
        fullName: fullName || null,
        paymentStatus: 'PENDING',
      });

      await order.save();

      // Create payment record
      const paymentId = uuidv4();
      const payment = new Payment({
        _id: paymentId,
        orderId,
        amount: total,
        status: 'PENDING',
      });

      await payment.save();

      console.log(`[Orders] Order created: ${orderId}`);

      res.status(201).json({
        success: true,
        orderId,
        paymentId,
        amount: total,
        qrisData: generateQRISData(orderId, total),
      });
    } catch (err) {
      console.error('[Orders] Create error:', err);
      next(err);
    }
  });

  // Get user's orders
  router.get('/', async (req, res, next) => {
    try {
      const userId = req.userId;

      const orders = await Order.find({ userId }).sort({ createdAt: -1 });

      res.json({ orders });
    } catch (err) {
      console.error('[Orders] Get all error:', err);
      next(err);
    }
  });

  // Get specific order
  router.get('/:orderId', async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const userId = req.userId;

      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Verify order belongs to user
      if (order.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const payment = await Payment.findOne({ orderId });

      console.log(`[Orders] Order fetched: ${orderId}`);

      res.json({ order, payment });
    } catch (err) {
      console.error('[Orders] Get one error:', err);
      next(err);
    }
  });

  return router;
}

// Simulate QRIS data generation
function generateQRISData(orderId, amount) {
  return {
    qrString: `00020126360014com.midtrans.www01189360010301000000000000${orderId}5204581553031765802ID5913UNGKEEPIN6009JAKARTA62620105${amount}63041D45`,
    merchantId: 'UNGKEPIN_001',
    orderId: orderId,
    amount: amount,
  };
}
