import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'database.sqlite');

// Singleton — satu koneksi dipakai sepanjang hidup server
let dbInstance = null;

export function getDatabase() {
  if (!dbInstance) {
    dbInstance = new sqlite3.Database(DB_PATH, (err) => {
      if (err) console.error('❌ Failed to open database:', err.message);
    });
  }
  return dbInstance;
}

export function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const db = getDatabase();

    // db.serialize() memastikan query dieksekusi berurutan (sequential)
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          phone TEXT UNIQUE NOT NULL,
          fullName TEXT NOT NULL,
          address TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Users table error:', err.message);
      });

      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          productId TEXT NOT NULL,
          productName TEXT NOT NULL,
          productImage TEXT,
          quantity INTEGER NOT NULL,
          subtotal REAL NOT NULL,
          deliveryType TEXT,
          deliveryPrice REAL DEFAULT 0,
          total REAL NOT NULL,
          paymentStatus TEXT DEFAULT 'PENDING',
          paymentMethod TEXT,
          address TEXT,
          fullName TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          paidAt DATETIME,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `, (err) => {
        if (err) console.error('Orders table error:', err.message);
      });

      db.run(`
        CREATE TABLE IF NOT EXISTS payments (
          id TEXT PRIMARY KEY,
          orderId TEXT NOT NULL UNIQUE,
          amount REAL NOT NULL,
          method TEXT,
          transactionId TEXT,
          status TEXT DEFAULT 'PENDING',
          verifiedAt DATETIME,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (orderId) REFERENCES orders(id)
        )
      `, (err) => {
        if (err) console.error('Payments table error:', err.message);
      });

      // Tabel terakhir — resolve/reject dipanggil di sini
      db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          token TEXT NOT NULL UNIQUE,
          expiresAt DATETIME,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `, (err) => {
        if (err) {
          console.error('Sessions table error:', err.message);
          reject(err);
        } else {
          // Migration: tambah kolom fullName jika belum ada (untuk database lama)
          db.run(`ALTER TABLE orders ADD COLUMN fullName TEXT`, (alterErr) => {
            if (alterErr && !alterErr.message.includes('duplicate column name')) {
              console.error('Migration warning:', alterErr.message);
            } else if (!alterErr) {
              console.log('✓ Migration: kolom fullName ditambahkan ke tabel orders');
            }
            console.log('✓ Database initialized successfully');
            resolve();
          });
        }
      });
    });
  });
}

export function runAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

export function getAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function allAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
