import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './database-mongodb.js';
import { authMiddleware, errorHandler } from './middleware-mongodb.js';
import { createAuthRoutes } from './routes/auth-mongodb.js';
import { createOrderRoutes } from './routes/orders-mongodb.js';
import { createPaymentRoutes } from './routes/payments-mongodb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Initialize database
try {
  await initializeDatabase();
  console.log(`✓ CORS enabled for ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
} catch (err) {
  console.error('❌ Failed to initialize database');
  process.exit(1);
}

// Route untuk halaman utama (Mencegah "Cannot GET /")
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding-top: 50px;">
      <h1>🚀 Ungkepin Backend is Running!</h1>
      <p>Silakan akses API health check di: <a href="/api/health">/api/health</a></p>
    </div>
  `);
});

// Routes API
const apiRouter = express.Router();
app.use('/api', apiRouter);
app.use('/', apiRouter);

apiRouter.use('/auth', createAuthRoutes());
apiRouter.use('/orders', authMiddleware(), createOrderRoutes());
apiRouter.use('/payments', authMiddleware(), createPaymentRoutes());

// Health check
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ungkepin backend is running', database: 'MongoDB' });
});

// Error handling
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test' && process.env.VERCEL !== '1') {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Ungkepin backend running on http://localhost:${PORT}`);
    console.log(`✓ Database: MongoDB`);
    console.log(`✓ CORS enabled for ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
}

export default app;
