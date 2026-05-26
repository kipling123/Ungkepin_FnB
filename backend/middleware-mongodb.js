import jwt from 'jsonwebtoken';
import { Session } from './database-mongodb.js';

export function authMiddleware() {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split('Bearer ')[1];

      if (!token) {
        console.warn('[Auth Middleware] No token provided');
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Verify token exists in database and not expired
      const session = await Session.findOne({
        token,
        expiresAt: { $gt: new Date() },
      });

      if (!session) {
        console.warn('[Auth Middleware] Token expired or invalid');
        return res.status(401).json({ error: 'Token expired or invalid' });
      }

      req.userId = decoded.userId;
      req.user = { id: decoded.userId };
      next();
    } catch (err) {
      console.error('[Auth Middleware] Error:', err.message);
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}

export function errorHandler(err, req, res, next) {
  console.error('[Error Handler]', err);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error',
  });
}

export class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}
