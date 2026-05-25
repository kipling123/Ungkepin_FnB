import jwt from 'jsonwebtoken';
import { getAsync } from './database.js';

export function authMiddleware(db) {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split('Bearer ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Verify token exists in database
      const session = await getAsync(db, 'SELECT * FROM sessions WHERE token = ? AND expiresAt > datetime("now")', [token]);
      
      if (!session) {
        return res.status(401).json({ error: 'Token expired or invalid' });
      }

      req.userId = decoded.userId;
      req.user = { id: decoded.userId };
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}

export function errorHandler(err, req, res, next) {
  console.error('Error:', err);
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
