import type { Contact, Transaction } from './types';

export const mockContacts: Contact[] = [
  { id: '1', name: 'Ravi Sharma', upiId: 'ravi@okaxis', type: 'Saved', category: 'Other Expenses', iconName: 'User', color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: '2', name: 'Priya (Daughter)', upiId: 'priya@okhdfc', type: 'Saved', category: 'Shopping', iconName: 'User', color: 'text-pink-600', bg: 'bg-pink-100' },
  { id: '3', name: 'Electricity Board', upiId: 'bescom@sbi', type: 'Bill', category: 'Utilities and Bills', iconName: 'Lightbulb', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { id: '4', name: 'Apollo Pharmacy', upiId: 'apollo@icici', type: 'Saved', category: 'Healthcare', iconName: 'HeartPulse', color: 'text-red-600', bg: 'bg-red-100' },
  { id: '5', name: 'Local Grocery', upiId: 'store@ybl', type: 'Saved', category: 'Food and Groceries', iconName: 'ShoppingBag', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: '6', name: 'Milk Vendor', upiId: 'milk@paytm', type: 'Saved', category: 'Food and Groceries', iconName: 'User', color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: '7', name: 'City Bus & Metro', upiId: 'metro@sbi', type: 'Bill', category: 'Transportation', iconName: 'Building2', color: 'text-cyan-600', bg: 'bg-cyan-100' },
];

// Reference timestamps for testing:
// Current Month: November 2026
// Previous Month: October 2026
// Older Month: September 2026
const NOW = new Date('2026-11-01T20:00:00Z').getTime();
const DAY = 24 * 60 * 60 * 1000;

export const initialTransactions: Transaction[] = [
  // --- November 2026 (Current Month) ---
  {
    id: 'tx-nov-1',
    name: 'Local Grocery',
    type: 'UPI Payment',
    date: '01 Nov, 2026, 10:30 AM',
    timestamp: NOW - 2 * 60 * 60 * 1000,
    amount: 650,
    isReceived: false,
    status: 'Completed',
    category: 'Food and Groceries',
    iconName: 'ShoppingBag',
    color: 'text-emerald-600',
    bg: 'bg-emerald-100'
  },
  {
    id: 'tx-nov-2',
    name: 'Milk Vendor',
    type: 'UPI Payment',
    date: '01 Nov, 2026, 07:15 AM',
    timestamp: NOW - 6 * 60 * 60 * 1000,
    amount: 350,
    isReceived: false,
    status: 'Completed',
    category: 'Food and Groceries',
    iconName: 'User',
    color: 'text-orange-600',
    bg: 'bg-orange-100'
  },
  {
    id: 'tx-nov-3',
    name: 'State Bank Pension',
    type: 'Received',
    date: '01 Nov, 2026, 06:00 AM',
    timestamp: NOW - 8 * 60 * 60 * 1000,
    amount: 2500,
    isReceived: true,
    status: 'Completed',
    category: 'Other Expenses',
    iconName: 'Building2',
    color: 'text-green-600',
    bg: 'bg-green-100'
  },
  {
    id: 'tx-nov-4',
    name: 'Apollo Pharmacy',
    type: 'UPI Payment',
    date: '01 Nov, 2026, 01:20 PM',
    timestamp: NOW - 4 * 60 * 60 * 1000,
    amount: 420,
    isReceived: false,
    status: 'Completed',
    category: 'Healthcare',
    iconName: 'HeartPulse',
    color: 'text-red-600',
    bg: 'bg-red-100'
  },
  {
    id: 'tx-nov-5',
    name: 'City Auto Rickshaw',
    type: 'UPI Payment',
    date: '01 Nov, 2026, 03:45 PM',
    timestamp: NOW - 3 * 60 * 60 * 1000,
    amount: 180,
    isReceived: false,
    status: 'Completed',
    category: 'Transportation',
    iconName: 'Building2',
    color: 'text-cyan-600',
    bg: 'bg-cyan-100'
  },
  {
    id: 'tx-nov-6',
    name: 'Water Supply Board',
    type: 'Bill Payment',
    date: '01 Nov, 2026, 04:30 PM',
    timestamp: NOW - 2 * 60 * 60 * 1000,
    amount: 320,
    isReceived: false,
    status: 'Pending',
    category: 'Utilities and Bills',
    iconName: 'Lightbulb',
    color: 'text-yellow-600',
    bg: 'bg-yellow-100'
  },
  {
    id: 'tx-nov-7',
    name: 'Book Depot',
    type: 'UPI Payment',
    date: '01 Nov, 2026, 05:10 PM',
    timestamp: NOW - 1 * 60 * 60 * 1000,
    amount: 400,
    isReceived: false,
    status: 'Failed',
    category: 'Shopping',
    iconName: 'ShoppingBag',
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },

  // --- October 2026 (Previous Month) ---
  {
    id: 'tx-oct-1',
    name: 'Supermarket Groceries',
    type: 'UPI Payment',
    date: '28 Oct, 2026',
    timestamp: NOW - 4 * DAY,
    amount: 1450,
    isReceived: false,
    status: 'Completed',
    category: 'Food and Groceries',
    iconName: 'ShoppingBag',
    color: 'text-emerald-600',
    bg: 'bg-emerald-100'
  },
  {
    id: 'tx-oct-2',
    name: 'Electricity Board',
    type: 'Bill Payment',
    date: '24 Oct, 2026',
    timestamp: NOW - 8 * DAY,
    amount: 1200,
    isReceived: false,
    status: 'Completed',
    category: 'Utilities and Bills',
    iconName: 'Lightbulb',
    color: 'text-yellow-600',
    bg: 'bg-yellow-100'
  },
  {
    id: 'tx-oct-3',
    name: 'Health Checkup Clinic',
    type: 'UPI Payment',
    date: '20 Oct, 2026',
    timestamp: NOW - 12 * DAY,
    amount: 850,
    isReceived: false,
    status: 'Completed',
    category: 'Healthcare',
    iconName: 'HeartPulse',
    color: 'text-red-600',
    bg: 'bg-red-100'
  },
  {
    id: 'tx-oct-4',
    name: 'Diwali Gifts & Sweets',
    type: 'UPI Payment',
    date: '18 Oct, 2026',
    timestamp: NOW - 14 * DAY,
    amount: 950,
    isReceived: false,
    status: 'Completed',
    category: 'Shopping',
    iconName: 'ShoppingBag',
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  {
    id: 'tx-oct-5',
    name: 'Metro Smart Card',
    type: 'UPI Payment',
    date: '14 Oct, 2026',
    timestamp: NOW - 18 * DAY,
    amount: 500,
    isReceived: false,
    status: 'Completed',
    category: 'Transportation',
    iconName: 'Building2',
    color: 'text-cyan-600',
    bg: 'bg-cyan-100'
  },
  {
    id: 'tx-oct-6',
    name: 'Movie Cinema with Family',
    type: 'UPI Payment',
    date: '10 Oct, 2026',
    timestamp: NOW - 22 * DAY,
    amount: 450,
    isReceived: false,
    status: 'Completed',
    category: 'Entertainment',
    iconName: 'Film',
    color: 'text-pink-600',
    bg: 'bg-pink-100'
  },
  {
    id: 'tx-oct-7',
    name: 'Sita',
    type: 'Received',
    date: '08 Oct, 2026',
    timestamp: NOW - 24 * DAY,
    amount: 1000,
    isReceived: true,
    status: 'Completed',
    category: 'Other Expenses',
    iconName: 'User',
    color: 'text-pink-600',
    bg: 'bg-pink-100'
  },

  // --- September 2026 (Two Months Ago) ---
  {
    id: 'tx-sep-1',
    name: 'Monthly Grocery Stock',
    type: 'UPI Payment',
    date: '25 Sep, 2026',
    timestamp: NOW - 37 * DAY,
    amount: 2100,
    isReceived: false,
    status: 'Completed',
    category: 'Food and Groceries',
    iconName: 'ShoppingBag',
    color: 'text-emerald-600',
    bg: 'bg-emerald-100'
  },
  {
    id: 'tx-sep-2',
    name: 'Electricity Board',
    type: 'Bill Payment',
    date: '18 Sep, 2026',
    timestamp: NOW - 44 * DAY,
    amount: 1150,
    isReceived: false,
    status: 'Completed',
    category: 'Utilities and Bills',
    iconName: 'Lightbulb',
    color: 'text-yellow-600',
    bg: 'bg-yellow-100'
  },
  {
    id: 'tx-sep-3',
    name: 'Pharmacy Routine Refill',
    type: 'UPI Payment',
    date: '12 Sep, 2026',
    timestamp: NOW - 50 * DAY,
    amount: 750,
    isReceived: false,
    status: 'Completed',
    category: 'Healthcare',
    iconName: 'HeartPulse',
    color: 'text-red-600',
    bg: 'bg-red-100'
  }
];
