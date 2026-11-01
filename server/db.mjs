import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Persistent SQLite database file in the project directory
const DB_PATH = path.join(__dirname, '..', 'senior_upi.sqlite');

export const db = new DatabaseSync(DB_PATH);

// Initialize Tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      upi_id TEXT NOT NULL,
      balance REAL NOT NULL,
      pin TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'en',
      sound_enabled INTEGER NOT NULL DEFAULT 1,
      high_amount_threshold REAL NOT NULL DEFAULT 3000,
      max_transaction_limit REAL NOT NULL DEFAULT 5000,
      face_id_enrolled INTEGER NOT NULL DEFAULT 0,
      face_template TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS biometric_credentials (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      credential_type TEXT NOT NULL, -- 'webauthn_fingerprint', 'optical_face_id'
      public_key TEXT,
      template_data TEXT,
      device_name TEXT,
      counter INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      upi_id TEXT NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      icon_name TEXT NOT NULL,
      color TEXT NOT NULL,
      bg TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      amount REAL NOT NULL,
      is_received INTEGER NOT NULL,
      status TEXT NOT NULL,
      category TEXT NOT NULL,
      icon_name TEXT NOT NULL,
      color TEXT NOT NULL,
      bg TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS biometric_audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp INTEGER NOT NULL,
      method TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT
    );
  `);

  // Seed default user if not exists
  const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get('user_1');
  if (!existingUser) {
    db.prepare(`
      INSERT INTO users (
        id, name, upi_id, balance, pin, language, sound_enabled,
        high_amount_threshold, max_transaction_limit, face_id_enrolled, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'user_1',
      'Senior User',
      'user@okaxis',
      2560,
      '1234',
      'en',
      1,
      3000,
      5000,
      0,
      Date.now()
    );
  }

  // Seed contacts if empty
  const contactCount = db.prepare('SELECT COUNT(*) as count FROM contacts').get().count;
  if (contactCount === 0) {
    const defaultContacts = [
      ['1', 'Ravi Sharma', 'ravi@okaxis', 'Saved', 'Other Expenses', 'User', 'text-blue-600', 'bg-blue-100'],
      ['2', 'Priya (Daughter)', 'priya@okhdfc', 'Saved', 'Shopping', 'User', 'text-pink-600', 'bg-pink-100'],
      ['3', 'Electricity Board', 'bescom@sbi', 'Bill', 'Utilities and Bills', 'Lightbulb', 'text-yellow-600', 'bg-yellow-100'],
      ['4', 'Apollo Pharmacy', 'apollo@icici', 'Saved', 'Healthcare', 'HeartPulse', 'text-red-600', 'bg-red-100'],
      ['5', 'Local Grocery', 'store@ybl', 'Saved', 'Food and Groceries', 'ShoppingBag', 'text-emerald-600', 'bg-emerald-100'],
      ['6', 'Milk Vendor', 'milk@paytm', 'Saved', 'Food and Groceries', 'User', 'text-orange-600', 'bg-orange-100'],
      ['7', 'City Bus & Metro', 'metro@sbi', 'Bill', 'Transportation', 'Building2', 'text-cyan-600', 'bg-cyan-100']
    ];

    const insertContact = db.prepare(`
      INSERT INTO contacts (id, name, upi_id, type, category, icon_name, color, bg)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const c of defaultContacts) {
      insertContact.run(...c);
    }
  }

  // Seed transactions if empty
  const txCount = db.prepare('SELECT COUNT(*) as count FROM transactions').get().count;
  if (txCount === 0) {
    const NOW = new Date('2026-11-01T20:00:00Z').getTime();
    const DAY = 24 * 60 * 60 * 1000;

    const defaultTxs = [
      ['tx-nov-1', 'user_1', 'Local Grocery', 'UPI Payment', '01 Nov, 2026, 10:30 AM', NOW - 2 * 60 * 60 * 1000, 650, 0, 'Completed', 'Food and Groceries', 'ShoppingBag', 'text-emerald-600', 'bg-emerald-100'],
      ['tx-nov-2', 'user_1', 'Milk Vendor', 'UPI Payment', '01 Nov, 2026, 07:15 AM', NOW - 6 * 60 * 60 * 1000, 350, 0, 'Completed', 'Food and Groceries', 'User', 'text-orange-600', 'bg-orange-100'],
      ['tx-nov-3', 'user_1', 'State Bank Pension', 'Received', '01 Nov, 2026, 06:00 AM', NOW - 8 * 60 * 60 * 1000, 2500, 1, 'Completed', 'Other Expenses', 'Building2', 'text-green-600', 'bg-green-100'],
      ['tx-nov-4', 'user_1', 'Apollo Pharmacy', 'UPI Payment', '01 Nov, 2026, 01:20 PM', NOW - 4 * 60 * 60 * 1000, 420, 0, 'Completed', 'Healthcare', 'HeartPulse', 'text-red-600', 'bg-red-100'],
      ['tx-nov-5', 'user_1', 'City Auto Rickshaw', 'UPI Payment', '01 Nov, 2026, 03:45 PM', NOW - 3 * 60 * 60 * 1000, 180, 0, 'Completed', 'Transportation', 'Building2', 'text-cyan-600', 'bg-cyan-100'],
      ['tx-nov-6', 'user_1', 'Water Supply Board', 'Bill Payment', '01 Nov, 2026, 04:30 PM', NOW - 2 * 60 * 60 * 1000, 320, 0, 'Pending', 'Utilities and Bills', 'Lightbulb', 'text-yellow-600', 'bg-yellow-100'],
      ['tx-nov-7', 'user_1', 'Book Depot', 'UPI Payment', '01 Nov, 2026, 05:10 PM', NOW - 1 * 60 * 60 * 1000, 400, 0, 'Failed', 'Shopping', 'ShoppingBag', 'text-purple-600', 'bg-purple-100'],
      
      ['tx-oct-1', 'user_1', 'Supermarket Groceries', 'UPI Payment', '28 Oct, 2026', NOW - 4 * DAY, 1450, 0, 'Completed', 'Food and Groceries', 'ShoppingBag', 'text-emerald-600', 'bg-emerald-100'],
      ['tx-oct-2', 'user_1', 'Electricity Board', 'Bill Payment', '24 Oct, 2026', NOW - 8 * DAY, 1200, 0, 'Completed', 'Utilities and Bills', 'Lightbulb', 'text-yellow-600', 'bg-yellow-100'],
      ['tx-oct-3', 'user_1', 'Health Checkup Clinic', 'UPI Payment', '20 Oct, 2026', NOW - 12 * DAY, 850, 0, 'Completed', 'Healthcare', 'HeartPulse', 'text-red-600', 'bg-red-100'],
      ['tx-oct-4', 'user_1', 'Diwali Gifts & Sweets', 'UPI Payment', '18 Oct, 2026', NOW - 14 * DAY, 950, 0, 'Completed', 'Shopping', 'ShoppingBag', 'text-purple-600', 'bg-purple-100'],
      ['tx-oct-5', 'user_1', 'Metro Smart Card', 'UPI Payment', '14 Oct, 2026', NOW - 18 * DAY, 500, 0, 'Completed', 'Transportation', 'Building2', 'text-cyan-600', 'bg-cyan-100'],
      ['tx-oct-6', 'user_1', 'Movie Cinema with Family', 'UPI Payment', '10 Oct, 2026', NOW - 22 * DAY, 450, 0, 'Completed', 'Entertainment', 'Film', 'text-pink-600', 'bg-pink-100'],
      ['tx-oct-7', 'user_1', 'Sita', 'Received', '08 Oct, 2026', NOW - 24 * DAY, 1000, 1, 'Completed', 'Other Expenses', 'User', 'text-pink-600', 'bg-pink-100'],

      ['tx-sep-1', 'user_1', 'Monthly Grocery Stock', 'UPI Payment', '25 Sep, 2026', NOW - 37 * DAY, 2100, 0, 'Completed', 'Food and Groceries', 'ShoppingBag', 'text-emerald-600', 'bg-emerald-100'],
      ['tx-sep-2', 'user_1', 'Electricity Board', 'Bill Payment', '18 Sep, 2026', NOW - 44 * DAY, 1150, 0, 'Completed', 'Utilities and Bills', 'Lightbulb', 'text-yellow-600', 'bg-yellow-100'],
      ['tx-sep-3', 'user_1', 'Pharmacy Routine Refill', 'UPI Payment', '12 Sep, 2026', NOW - 50 * DAY, 750, 0, 'Completed', 'Healthcare', 'HeartPulse', 'text-red-600', 'bg-red-100']
    ];

    const insertTx = db.prepare(`
      INSERT INTO transactions (
        id, user_id, name, type, date, timestamp, amount,
        is_received, status, category, icon_name, color, bg
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const t of defaultTxs) {
      insertTx.run(...t);
    }
  }
}
