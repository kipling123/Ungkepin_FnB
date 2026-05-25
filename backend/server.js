import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, getDatabase } from './database.js';
import { authMiddleware, errorHandler } from './middleware.js';
import { createAuthRoutes } from './routes/auth.js';
import { createOrderRoutes } from './routes/orders.js';
import { createPaymentRoutes } from './routes/payments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Initialize database
await initializeDatabase();

// Get database connection
const db = getDatabase();

// Routes
app.use('/api', createAuthRoutes(db));
app.use('/api', authMiddleware(db), createOrderRoutes(db));
app.use('/api', authMiddleware(db), createPaymentRoutes(db));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ungkepin backend is running' });
});

// Error handling
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Ungkepin backend running on http://localhost:${PORT}`);
  console.log(`✓ Database initialized`);
  console.log(`✓ CORS enabled for ${process.env.CORS_ORIGIN}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} sudah dipakai. Tutup proses lain lalu coba lagi.`);
    process.exit(1);
  } else {
    throw err;
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) console.error('Error closing database:', err);
    console.log('\n✓ Database closed, server stopped');
    process.exit(0);
  });
});
