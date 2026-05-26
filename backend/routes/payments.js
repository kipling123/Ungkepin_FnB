import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { runAsync, getAsync } from '../database.js';

export function createPaymentRoutes(db) {
  const router = Router();

  // Verify payment (simulate payment verification)
  router.post('/:orderId/verify', async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { transactionId } = req.body;
      const userId = req.userId;

      console.log(`[Payment Verify] orderId: ${orderId}, userId: ${userId}, transactionId: ${transactionId}`);

      // Verify order belongs to user
      const order = await getAsync(
        db,
        'SELECT * FROM orders WHERE id = ? AND userId = ?',
        [orderId, userId]
      );

      if (!order) {
        console.error(`[Payment Verify] Order not found: ${orderId}`);
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.paymentStatus === 'COMPLETED') {
        console.warn(`[Payment Verify] Order already paid: ${orderId}`);
        return res.status(400).json({ error: 'Order already paid' });
      }

      // Update payment status
      const now = new Date().toISOString();
      console.log(`[Payment Verify] Updating payment record for orderId: ${orderId}`);
      
      await runAsync(
        db,
        'UPDATE payments SET status = ?, transactionId = ?, verifiedAt = ? WHERE orderId = ?',
        ['COMPLETED', transactionId || `TXN_${Date.now()}`, now, orderId]
      );

      // Update order status
      console.log(`[Payment Verify] Updating order status for orderId: ${orderId}`);
      
      await runAsync(
        db,
        'UPDATE orders SET paymentStatus = ?, paidAt = ? WHERE id = ?',
        ['COMPLETED', now, orderId]
      );

      console.log(`[Payment Verify] Success for orderId: ${orderId}`);

      res.json({
        success: true,
        orderId,
        paymentStatus: 'COMPLETED',
        message: 'Payment verified successfully',
      });
    } catch (err) {
      console.error('[Payment Verify] Error:', err);
      next(err);
    }
  });

  // Check payment status
  router.get('/:orderId/status', async (req, res, next) => {
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

      res.json({
        orderId,
        paymentStatus: order.paymentStatus,
        orderStatus: order.paymentStatus === 'COMPLETED' ? 'PAID' : 'PENDING',
        payment,
      });
    } catch (err) {
      next(err);
    }
  });

  // Simulate QRIS payment (for testing - would be real payment gateway in production)
  router.post('/:orderId/qris/callback', async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      if (status === 'success') {
        const now = new Date().toISOString();
        await runAsync(
          db,
          'UPDATE payments SET status = ?, verifiedAt = ? WHERE orderId = ?',
          ['COMPLETED', now, orderId]
        );

        await runAsync(
          db,
          'UPDATE orders SET paymentStatus = ?, paidAt = ? WHERE id = ?',
          ['COMPLETED', now, orderId]
        );
      }

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
