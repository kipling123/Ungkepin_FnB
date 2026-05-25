import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { runAsync, getAsync, allAsync } from '../database.js';

export function createOrderRoutes(db) {
  const router = Router();

  // Create order
  router.post('/orders', async (req, res, next) => {
    try {
      const { product, quantity, subtotal, deliveryType, deliveryPrice, total, address, fullName, phone } = req.body;
      const userId = req.userId;

      if (!product || !quantity || !total) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const orderId = uuidv4();
      
      await runAsync(
        db,
        `INSERT INTO orders 
        (id, userId, productId, productName, productImage, quantity, subtotal, deliveryType, deliveryPrice, total, address, fullName, paymentStatus)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          userId,
          product.id || 'MENU_ITEM',
          product.name,
          product.image || null,
          quantity,
          subtotal,
          deliveryType,
          deliveryPrice,
          total,
          address,
          fullName || null,
          'PENDING',
        ]
      );

      // Create payment record
      const paymentId = uuidv4();
      await runAsync(
        db,
        `INSERT INTO payments (id, orderId, amount, status)
        VALUES (?, ?, ?, ?)`,
        [paymentId, orderId, total, 'PENDING']
      );

      res.status(201).json({
        success: true,
        orderId,
        paymentId,
        amount: total,
        qrisData: generateQRISData(orderId, total), // Simulated QRIS data
      });
    } catch (err) {
      next(err);
    }
  });

  // Get user's orders
  router.get('/orders', async (req, res, next) => {
    try {
      const userId = req.userId;

      const orders = await allAsync(
        db,
        'SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC',
        [userId]
      );

      res.json({ orders });
    } catch (err) {
      next(err);
    }
  });

  // Get specific order
  router.get('/orders/:orderId', async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const userId = req.userId;

      const order = await getAsync(
        db,
        'SELECT * FROM orders WHERE id = ? AND userId = ?',
        [orderId, userId]
      );

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const payment = await getAsync(
        db,
        'SELECT * FROM payments WHERE orderId = ?',
        [orderId]
      );

      res.json({ order, payment });
    } catch (err) {
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
