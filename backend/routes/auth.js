import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { runAsync, getAsync } from '../database.js';

export function createAuthRoutes(db) {
  const router = Router();

  // Register / Login (mobile doesn't need password - just phone + name)
  router.post('/auth/login', async (req, res, next) => {
    try {
      const { phone, fullName } = req.body;

      if (!phone || !fullName) {
        return res.status(400).json({ error: 'Phone and fullName required' });
      }

      // Check if user exists
      let user = await getAsync(db, 'SELECT * FROM users WHERE phone = ?', [phone]);

      if (!user) {
        // Create new user
        const userId = uuidv4();
        await runAsync(db, 'INSERT INTO users (id, phone, fullName) VALUES (?, ?, ?)', [
          userId,
          phone,
          fullName,
        ]);
        user = { id: userId, phone, fullName };
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user.id, phone: user.phone },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Store session
      const sessionId = uuidv4();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      await runAsync(
        db,
        'INSERT INTO sessions (id, userId, token, expiresAt) VALUES (?, ?, ?, ?)',
        [sessionId, user.id, token, expiresAt]
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          phone: user.phone,
          fullName: user.fullName,
        },
      });
    } catch (err) {
      next(err);
    }
  });

  // Verify token
  router.post('/auth/verify', async (req, res, next) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ error: 'Token required' });
      }

      const session = await getAsync(
        db,
        'SELECT * FROM sessions WHERE token = ? AND expiresAt > datetime("now")',
        [token]
      );

      if (!session) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      const user = await getAsync(db, 'SELECT * FROM users WHERE id = ?', [session.userId]);

      res.json({
        valid: true,
        user: {
          id: user.id,
          phone: user.phone,
          fullName: user.fullName,
        },
      });
    } catch (err) {
      next(err);
    }
  });

  // Logout
  router.post('/auth/logout', async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split('Bearer ')[1];

      if (token) {
        await runAsync(db, 'DELETE FROM sessions WHERE token = ?', [token]);
      }

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
