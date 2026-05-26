import mongoose from 'mongoose';

// Define schemas
const userSchema = new mongoose.Schema({
  _id: String,
  phone: { type: String, unique: true, required: true },
  fullName: String,
  address: String,
  createdAt: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema({
  _id: String,
  userId: String,
  productId: String,
  productName: String,
  productImage: String,
  quantity: Number,
  subtotal: Number,
  deliveryType: String,
  deliveryPrice: { type: Number, default: 0 },
  total: Number,
  paymentStatus: { type: String, default: 'PENDING' },
  paymentMethod: String,
  address: String,
  fullName: String,
  createdAt: { type: Date, default: Date.now },
  paidAt: Date,
});

const paymentSchema = new mongoose.Schema({
  _id: String,
  orderId: { type: String, unique: true },
  amount: Number,
  method: String,
  transactionId: String,
  status: { type: String, default: 'PENDING' },
  verifiedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

const sessionSchema = new mongoose.Schema({
  _id: String,
  userId: String,
  token: { type: String, unique: true },
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now },
});

// Create models
const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const Session = mongoose.model('Session', sessionSchema);

export { User, Order, Payment, Session };

// Initialize MongoDB connection
export async function initializeDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ MongoDB connected successfully');
    return mongoose.connection;
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    throw err;
  }
}

export function getDatabase() {
  return mongoose.connection;
}

export async function closeDatabase() {
  await mongoose.disconnect();
}
