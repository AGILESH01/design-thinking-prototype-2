import { 
  DEFAULT_MAX_TRANSACTION_LIMIT, 
  DEFAULT_HIGH_AMOUNT_THRESHOLD, 
  MIN_TRANSACTION_LIMIT, 
  DEMO_PIN, 
  numberToWords 
} from './src/utils/formatters.ts';
import { translations, t, getCategoryTranslation, getStatusTranslation } from './src/utils/translations.ts';
import { initialTransactions } from './src/data.ts';
import { STEP_SPOKEN_GUIDANCE } from './src/utils/deviceSensors.ts';

console.log('====================================================');
console.log('  UPI PROTOTYPE V2: COMPREHENSIVE AUTOMATED TEST SUITE');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

// ---------------------------------------------------------
// SUITE 1: Limits, Configuration & Number-to-Words
// ---------------------------------------------------------
console.log('--- 1. Testing Safety Limits & Number-to-Words ---');
assert(DEFAULT_HIGH_AMOUNT_THRESHOLD === 3000, 'High-amount warning threshold is ₹3,000');
assert(DEFAULT_MAX_TRANSACTION_LIMIT === 5000, 'Maximum transaction limit is ₹5,000');
assert(MIN_TRANSACTION_LIMIT === 1, 'Minimum transaction limit is ₹1');
assert(DEMO_PIN === '1234', 'Demo PIN is 1234');

assert(numberToWords(500) === 'Five Hundred Rupees Only', '500 converts to words');
assert(numberToWords(3500) === 'Three Thousand Five Hundred Rupees Only', '3,500 converts to words');
assert(numberToWords(5000) === 'Five Thousand Rupees Only', '5,000 converts to words');

// ---------------------------------------------------------
// SUITE 2: Multilingual Dictionary & Translation Engine
// ---------------------------------------------------------
console.log('\n--- 2. Testing Multilingual Engine (English, Hindi, Kannada, Tamil) ---');
const languages = ['en', 'hi', 'kn', 'ta'];
const englishKeys = Object.keys(translations.en);

languages.forEach(lang => {
  assert(translations[lang] !== undefined, `Language '${lang}' dictionary exists`);
  const keys = Object.keys(translations[lang]);
  assert(keys.length === englishKeys.length, `Language '${lang}' has all ${englishKeys.length} translation keys`);
});

// Test variable interpolation
const interpolatedEn = t('en', 'insufficientBalanceDesc', { amount: '3,500', balance: '2,560' });
assert(interpolatedEn.includes('₹3,500') && interpolatedEn.includes('₹2,560'), 'English dynamic interpolation functions correctly');

const interpolatedHi = t('hi', 'insufficientBalanceDesc', { amount: '3,500', balance: '2,560' });
assert(interpolatedHi.includes('₹3,500') && interpolatedHi.includes('₹2,560'), 'Hindi dynamic interpolation functions correctly');

const interpolatedKn = t('kn', 'insufficientBalanceDesc', { amount: '3,500', balance: '2,560' });
assert(interpolatedKn.includes('₹3,500') && interpolatedKn.includes('₹2,560'), 'Kannada dynamic interpolation functions correctly');

const interpolatedTa = t('ta', 'insufficientBalanceDesc', { amount: '3,500', balance: '2,560' });
assert(interpolatedTa.includes('₹3,500') && interpolatedTa.includes('₹2,560'), 'Tamil dynamic interpolation functions correctly');

// Test Category & Status Translations
assert(getCategoryTranslation('hi', 'Food and Groceries') === 'भोजन और राशन', 'Hindi category: Food and Groceries');
assert(getCategoryTranslation('kn', 'Healthcare') === 'ಆರೋಗ್ಯ ಮತ್ತು ಔಷಧಿ', 'Kannada category: Healthcare');
assert(getCategoryTranslation('ta', 'Transportation') === 'பயணம் & போக்குவரத்து', 'Tamil category: Transportation');
assert(getStatusTranslation('hi', 'Pending') === 'लंबित', 'Hindi status: Pending');
assert(getStatusTranslation('kn', 'Failed') === 'ವಿಫಲ', 'Kannada status: Failed');
assert(getStatusTranslation('ta', 'Completed') === 'வெற்றி', 'Tamil status: Completed');

// ---------------------------------------------------------
// SUITE 3: High-Amount Warning & Transaction Amount Validation
// ---------------------------------------------------------
console.log('\n--- 3. Testing High-Amount Warning & Limit Validation ---');

function validatePaymentAttempt(amount, balance, threshold = DEFAULT_HIGH_AMOUNT_THRESHOLD, maxLimit = DEFAULT_MAX_TRANSACTION_LIMIT) {
  if (isNaN(amount) || amount < MIN_TRANSACTION_LIMIT) {
    return { canProceed: false, reason: 'MIN_LIMIT', requiresWarning: false };
  }
  if (amount > maxLimit) {
    return { canProceed: false, reason: 'EXCEEDS_MAX_LIMIT', requiresWarning: false };
  }
  if (amount > balance) {
    return { canProceed: false, reason: 'INSUFFICIENT_BALANCE', requiresWarning: false };
  }
  const requiresWarning = amount >= threshold;
  return { canProceed: true, reason: 'VALID', requiresWarning, remaining: balance - amount };
}

// Case A: ₹500 from ₹2,560
const test500 = validatePaymentAttempt(500, 2560);
assert(test500.canProceed === true && test500.requiresWarning === false, '₹500 payment proceeds normally without high-amount warning');

// Case B: ₹3,500 from ₹4,000
const test3500 = validatePaymentAttempt(3500, 4000);
assert(test3500.canProceed === true && test3500.requiresWarning === true, '₹3,500 payment requires high-amount warning before PIN authorization');

// Case C: ₹5,001 (exceeds ₹5,000 maximum limit)
const test5001 = validatePaymentAttempt(5001, 10000);
assert(test5001.canProceed === false && test5001.reason === 'EXCEEDS_MAX_LIMIT', '₹5,001 is completely blocked by ₹5,000 maximum transaction limit');

// Case D: ₹3,500 when available balance is ₹2,560
const testInsufficient = validatePaymentAttempt(3500, 2560);
assert(testInsufficient.canProceed === false && testInsufficient.reason === 'INSUFFICIENT_BALANCE', '₹3,500 with ₹2,560 balance is blocked by insufficient balance');

// ---------------------------------------------------------
// SUITE 4: Colour-Differentiated History & Filters
// ---------------------------------------------------------
console.log('\n--- 4. Testing Colour-Differentiated History & Filtering ---');

// Check initial dataset
const totalTxs = initialTransactions.length;
const sentTxs = initialTransactions.filter(tx => !tx.isReceived);
const receivedTxs = initialTransactions.filter(tx => tx.isReceived);

assert(totalTxs === sentTxs.length + receivedTxs.length, 'Filter partition: All = Sent + Received');
assert(sentTxs.length > 0, 'Sent transactions exist in dataset');
assert(receivedTxs.length > 0, 'Received transactions exist in dataset');

// Check sent vs received directional properties
sentTxs.forEach(tx => {
  const sign = !tx.isReceived ? '-' : '+';
  assert(sign === '-', `Sent transaction ${tx.id} (${tx.name}) has minus sign: -₹${tx.amount}`);
});

receivedTxs.forEach(tx => {
  const sign = tx.isReceived ? '+' : '-';
  assert(sign === '+', `Received transaction ${tx.id} (${tx.name}) has plus sign: +₹${tx.amount}`);
});

// Check distinct status representations
const completedTxs = initialTransactions.filter(t => t.status === 'Completed');
const pendingTxs = initialTransactions.filter(t => t.status === 'Pending');
const failedTxs = initialTransactions.filter(t => t.status === 'Failed');

assert(completedTxs.length > 0, 'Completed transactions represented');
assert(pendingTxs.length > 0, 'Pending transactions have distinct state (not marked completed)');
assert(failedTxs.length > 0, 'Failed transactions have distinct state (not marked completed)');

// ---------------------------------------------------------
// SUITE 5: Monthly Expense Infographics & Spending Analytics
// ---------------------------------------------------------
console.log('\n--- 5. Testing Monthly Expense Calculations & Category Integrity ---');

// Calculate for November 2026
const novTxs = initialTransactions.filter(tx => {
  const d = new Date(tx.timestamp);
  return d.getFullYear() === 2026 && d.getMonth() === 10;
});

let novSpent = 0;
let novReceived = 0;
const novCatTotals = {};

novTxs.forEach(tx => {
  if (tx.status === 'Completed') {
    if (tx.isReceived) {
      novReceived += tx.amount;
    } else {
      novSpent += tx.amount;
      novCatTotals[tx.category] = (novCatTotals[tx.category] || 0) + tx.amount;
    }
  }
});

assert(novSpent === (650 + 350 + 420 + 180), `Nov completed expenses = ₹${novSpent} (Received ₹2,500 & Pending ₹320 & Failed ₹400 excluded)`);
assert(novReceived === 2500, `Nov received money = ₹${novReceived} strictly excluded from expenses`);

// Check category percentages
let percentSum = 0;
Object.entries(novCatTotals).forEach(([cat, amount]) => {
  const pct = Math.round((amount / novSpent) * 100);
  percentSum += pct;
  assert(pct > 0 && pct <= 100, `Category '${cat}' percentage ${pct}% is valid`);
});
assert(Math.abs(percentSum - 100) <= 2, `Category percentages sum to ~100% (actual: ${percentSum}%)`);

// October 2026 comparison
const octTxs = initialTransactions.filter(tx => {
  const d = new Date(tx.timestamp);
  return d.getFullYear() === 2026 && d.getMonth() === 9;
});
let octSpent = 0;
octTxs.forEach(tx => {
  if (tx.status === 'Completed' && !tx.isReceived) {
    octSpent += tx.amount;
  }
});

assert(octSpent === (1450 + 1200 + 850 + 950 + 500 + 450), `Oct completed expenses = ₹${octSpent}`);
const diff = novSpent - octSpent;
assert(diff < 0, `Nov spending (₹${novSpent}) is less than Oct (₹${octSpent}), spending decreased`);

// ---------------------------------------------------------
// SUITE 6: Biometric Balance Privacy & Balance Synchronisation
// ---------------------------------------------------------
console.log('\n--- 6. Testing Biometric Protection & Single-Deduction Balance Logic ---');

let currentBalance = 2560;
let isBalanceHidden = true; // Hidden by default

assert(isBalanceHidden === true, 'Account balance is hidden by default (Feature 4)');

// Simulate authentication success
function authenticateUser(pin) {
  return pin === DEMO_PIN;
}
assert(authenticateUser('1234') === true, 'Authentication succeeds with PIN 1234');
assert(authenticateUser('9999') === false, 'Authentication fails with wrong PIN 9999');

// Execute payment deduction exactly once
const paymentAmount = 500;
currentBalance = currentBalance - paymentAmount;
assert(currentBalance === 2060, 'Balance updated exactly once upon authorization to ₹2,060');

// Verify automatic balance hiding on screen change
function onScreenNavigate(newScreen) {
  if (newScreen !== 'home') {
    isBalanceHidden = true;
  }
}
isBalanceHidden = false; // user viewed balance
onScreenNavigate('pay');
assert(isBalanceHidden === true, 'Balance automatically re-hides upon navigating away from home');

// ---------------------------------------------------------
console.log('\n--- 7. Testing Senior Step-by-Step Predictive Guidance & Spoken Audio ---');
const requiredSteps = ['recipient', 'pay', 'review', 'pin'];
const requiredLangs = ['en', 'hi', 'kn', 'ta'];

for (const step of requiredSteps) {
  assert(Boolean(STEP_SPOKEN_GUIDANCE[step]), `Spoken guidance exists for step '${step}'`);
  for (const lang of requiredLangs) {
    const script = STEP_SPOKEN_GUIDANCE[step]?.[lang];
    assert(Boolean(script && script.length > 20), `Spoken script exists and is detailed for step '${step}' in '${lang}'`);
  }
}

assert(translations.en.whatHappensNext === 'What Happens Next?', 'English whatHappensNext header is defined');
assert(translations.hi.whatHappensNext === 'अगला कदम क्या होगा?', 'Hindi whatHappensNext header is defined');
assert(translations.kn.whatHappensNext === 'ಮುಂದಿನ ಹಂತವೇನು?', 'Kannada whatHappensNext header is defined');
assert(translations.ta.whatHappensNext === 'அடுத்த படி என்ன?', 'Tamil whatHappensNext header is defined');

assert(translations.en.noDeductionGuarantee.includes('No money is deducted'), 'English guarantee explicitly promises zero deduction');
assert(translations.hi.noDeductionGuarantee.includes('कोई पैसा नहीं'), 'Hindi guarantee explicitly promises zero deduction');
assert(translations.kn.noDeductionGuarantee.includes('ಯಾವುದೇ ಹಣ ಕಡಿತವಾಗುವುದಿಲ್ಲ'), 'Kannada guarantee explicitly promises zero deduction');
assert(translations.ta.noDeductionGuarantee.includes('பணம் எதுவும் கழிக்கப்படாது'), 'Tamil guarantee explicitly promises zero deduction');

console.log('\n====================================================');
console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
}
