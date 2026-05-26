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

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Initialize database
await initializeDatabase();

// Get database connection
const db = getDatabase();

// Route untuk halaman utama (Mencegah "Cannot GET /")
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding-top: 50px;">
      <h1>🚀 Ungkepin Backend is Running!</h1>
      <p>Silakan akses API health check di: <a href="/api/health">/api/health</a></p>
    </div>
  `);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ungkepin backend is running' });
});

// Routes API
app.use('/api', createAuthRoutes(db));
app.use('/api', authMiddleware(db), createOrderRoutes(db));
app.use('/api', authMiddleware(db), createPaymentRoutes(db));

// Error handling
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test' && process.env.VERCEL !== '1') {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Ungkepin backend running on http://localhost:${PORT}`);
    console.log(`✓ Database initialized`);
    console.log(`✓ CORS enabled for ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} sudah dipakai. Tutup proses lain lalu coba lagi.`);
      process.exit(1);
    } else {
      throw err;
    }
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) console.error('Error closing database:', err);
    console.log('\n✓ Database closed, server stopped');
    process.exit(0);
  });
});

export default app;