import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User, Session } from '../database-mongodb.js';

export function createAuthRoutes() {
  const router = Router();

  // Register / Login (mobile doesn't need password - just phone + name)
  router.post('/login', async (req, res, next) => {
    try {
      const { phone, fullName } = req.body;

      if (!phone || !fullName) {
        return res.status(400).json({ error: 'Phone and fullName required' });
      }

      console.log(`[Auth] Login attempt for phone: ${phone}`);

      // Check if user exists
      let user = await User.findOne({ phone });

      if (!user) {
        // Create new user
        const userId = uuidv4();
        user = new User({
          _id: userId,
          phone,
          fullName,
        });
        await user.save();
        console.log(`[Auth] New user created: ${userId}`);
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user._id, phone: user.phone },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Store session
      const sessionId = uuidv4();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const session = new Session({
        _id: sessionId,
        userId: user._id,
        token,
        expiresAt,
      });
      await session.save();

      console.log(`[Auth] Session created for user: ${user._id}`);

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          phone: user.phone,
          fullName: user.fullName,
        },
      });
    } catch (err) {
      console.error('[Auth] Login error:', err);
      next(err);
    }
  });

  // Verify token
  router.post('/verify', async (req, res, next) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ error: 'Token required' });
      }

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check session exists and not expired
      const session = await Session.findOne({
        token,
        expiresAt: { $gt: new Date() },
      });

      if (!session) {
        return res.status(401).json({ error: 'Token expired or invalid' });
      }

      const user = await User.findById(decoded.userId);

      res.json({
        success: true,
        user: {
          id: user._id,
          phone: user.phone,
          fullName: user.fullName,
        },
      });
    } catch (err) {
      console.error('[Auth] Verify error:', err);
      res.status(401).json({ error: 'Invalid token' });
    }
  });

  // Logout
  router.post('/logout', async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split('Bearer ')[1];

      if (token) {
        await Session.deleteOne({ token });
        console.log(`[Auth] Session deleted`);
      }

      res.json({ success: true, message: 'Logged out' });
    } catch (err) {
      console.error('[Auth] Logout error:', err);
      next(err);
    }
  });

  return router;
}
