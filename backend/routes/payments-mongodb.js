import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Order, Payment } from '../database-mongodb.js';

export function createPaymentRoutes() {
  const router = Router();

  // Verify payment (simulate payment verification)
  router.post('/:orderId/verify', async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { transactionId } = req.body;
      const userId = req.userId;

      console.log(`[Payments] Verify request - orderId: ${orderId}, userId: ${userId}, transactionId: ${transactionId}`);

      // Verify order belongs to user
      const order = await Order.findById(orderId);

      if (!order) {
        console.error(`[Payments] Order not found: ${orderId}`);
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.userId !== userId) {
        console.error(`[Payments] Unauthorized access to order: ${orderId}`);
        return res.status(403).json({ error: 'Unauthorized' });
      }

      if (order.paymentStatus === 'COMPLETED') {
        console.warn(`[Payments] Order already paid: ${orderId}`);
        return res.status(400).json({ error: 'Order already paid' });
      }

      // Update payment status
      const now = new Date();
      console.log(`[Payments] Updating payment record for orderId: ${orderId}`);

      await Payment.updateOne(
        { orderId },
        {
          status: 'COMPLETED',
          transactionId: transactionId || `TXN_${Date.now()}`,
          verifiedAt: now,
        }
      );

      // Update order status
      console.log(`[Payments] Updating order status for orderId: ${orderId}`);

      await Order.updateOne(
        { _id: orderId },
        {
          paymentStatus: 'COMPLETED',
          paidAt: now,
        }
      );

      console.log(`[Payments] ✓ Payment verified successfully for orderId: ${orderId}`);

      res.json({
        success: true,
        orderId,
        paymentStatus: 'COMPLETED',
        message: 'Payment verified successfully',
      });
    } catch (err) {
      console.error('[Payments] Verify error:', err);
      next(err);
    }
  });

  // Check payment status
  router.get('/:orderId/status', async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const userId = req.userId;

      const order = await Order.findById(orderId);

      if (!order) {
        console.error(`[Payments] Order not found for status check: ${orderId}`);
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.userId !== userId) {
        console.error(`[Payments] Unauthorized status check for order: ${orderId}`);
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const payment = await Payment.findOne({ orderId });

      console.log(`[Payments] Status check - orderId: ${orderId}, status: ${order.paymentStatus}`);

      res.json({
        orderId,
        paymentStatus: order.paymentStatus,
        orderStatus: order.paymentStatus === 'COMPLETED' ? 'PAID' : 'PENDING',
        payment,
      });
    } catch (err) {
      console.error('[Payments] Status check error:', err);
      next(err);
    }
  });

  // Simulate QRIS payment callback
  router.post('/:orderId/qris/callback', async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      if (status === 'success') {
        const now = new Date();
        await Payment.updateOne(
          { orderId },
          {
            status: 'COMPLETED',
            verifiedAt: now,
          }
        );

        await Order.updateOne(
          { _id: orderId },
          {
            paymentStatus: 'COMPLETED',
            paidAt: now,
          }
        );

        console.log(`[Payments] QRIS callback success for orderId: ${orderId}`);
      }

      res.json({ success: true });
    } catch (err) {
      console.error('[Payments] QRIS callback error:', err);
      next(err);
    }
  });

  return router;
}
