export type Screen = 
  | 'home' 
  | 'recipient' 
  | 'pay' 
  | 'review' 
  | 'pin' 
  | 'confirm' 
  | 'receipt' 
  | 'history' 
  | 'help' 
  | 'practice' 
  | 'profile' 
  | 'receive' 
  | 'safety'
  | 'monthly'
  | 'language';

export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'ta';

export type ExpenseCategory = 
  | 'Food and Groceries' 
  | 'Transportation' 
  | 'Utilities and Bills' 
  | 'Shopping' 
  | 'Healthcare' 
  | 'Entertainment' 
  | 'Other Expenses';

export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

export interface Transaction {
  id: string;
  name: string;
  type: string;
  date: string;
  timestamp: number; // Unix timestamp in milliseconds for grouping/sorting
  amount: number;
  isReceived: boolean;
  status: TransactionStatus;
  category: ExpenseCategory;
  iconName: 'User' | 'Building2' | 'Users' | 'Lightbulb' | 'ShoppingBag' | 'HeartPulse' | 'Film';
  color: string;
  bg: string;
}

export interface Contact {
  id: string;
  name: string;
  upiId: string;
  type: string;
  category?: ExpenseCategory;
  iconName: 'User' | 'Building2' | 'Users' | 'Lightbulb' | 'ShoppingBag' | 'HeartPulse' | 'Film';
  color: string;
  bg: string;
}

export interface PaymentDetails {
  name: string;
  upiId: string;
  amount: number;
  message: string;
  method: string;
  date: string;
  transactionId: string;
  remainingBalance: number;
  category: ExpenseCategory;
}

export interface AppConfig {
  highAmountThreshold: number; // Default: ₹3,000
  maxTransactionLimit: number; // Default: ₹5,000
  soundEnabled: boolean;
  voiceGuidanceEnabled: boolean; // Verbal spoken guidance for every step
}
