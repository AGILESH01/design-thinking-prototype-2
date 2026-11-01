import { MAX_TRANSACTION_LIMIT, MIN_TRANSACTION_LIMIT, DEMO_PIN, numberToWords } from './src/utils/formatters.ts';

console.log('--- Testing Senior-Friendly UPI Trust Mode Flow & Logic ---');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${message}`);
    failed++;
  }
}

// 1. Test Number-to-Words for Senior Error Prevention
assert(numberToWords(500) === 'Five Hundred Rupees Only', `500 -> "${numberToWords(500)}"`);
assert(numberToWords(1000) === 'One Thousand Rupees Only', `1000 -> "${numberToWords(1000)}"`);
assert(numberToWords(2560) === 'Two Thousand Five Hundred Sixty Rupees Only', `2560 -> "${numberToWords(2560)}"`);
assert(numberToWords(10000) === 'Ten Thousand Rupees Only', `10000 -> "${numberToWords(10000)}"`);

// 2. Test Limit Validation
assert(MIN_TRANSACTION_LIMIT === 1, 'Minimum transaction limit is ₹1');
assert(MAX_TRANSACTION_LIMIT === 5000, 'Maximum transaction limit is ₹5,000');

function validatePayment(amount, balance) {
  if (isNaN(amount) || amount < MIN_TRANSACTION_LIMIT) {
    return { valid: false, error: 'MIN_LIMIT' };
  }
  if (amount > MAX_TRANSACTION_LIMIT) {
    return { valid: false, error: 'MAX_LIMIT' };
  }
  if (amount > balance) {
    return { valid: false, error: 'INSUFFICIENT_BALANCE' };
  }
  return { valid: true, remaining: balance - amount };
}

// 3. Test Insufficient Balance Handling
const initialBalance = 2560;
assert(validatePayment(500, initialBalance).valid === true, '₹500 payment from ₹2,560 is valid');
assert(validatePayment(2560, initialBalance).valid === true, 'Exact balance ₹2,560 payment is valid');
assert(validatePayment(2561, initialBalance).error === 'INSUFFICIENT_BALANCE', '₹2,561 payment triggers INSUFFICIENT_BALANCE');
assert(validatePayment(5000, initialBalance).error === 'INSUFFICIENT_BALANCE', '₹5,000 payment triggers INSUFFICIENT_BALANCE');

// 4. Test Maximum Transaction Limit
assert(validatePayment(5000, 20000).valid === true, '₹5,000 within max limit is valid');
assert(validatePayment(5001, 20000).error === 'MAX_LIMIT', '₹5,001 triggers MAX_LIMIT');

// 5. Test Demo PIN Authorization
assert(DEMO_PIN === '1234', 'Demo PIN is configured as 1234');
function authorizePin(pin) {
  return pin === DEMO_PIN;
}
assert(authorizePin('1234') === true, 'Correct PIN 1234 is authorized');
assert(authorizePin('0000') === false, 'Incorrect PIN 0000 is rejected');
assert(authorizePin('9999') === false, 'Incorrect PIN 9999 is rejected');
assert(authorizePin('') === false, 'Empty PIN is rejected');

// 6. Test Flow State & Balance Deduction
let userBalance = 2560;
const transferAmount = 500;
const validation = validatePayment(transferAmount, userBalance);
assert(validation.valid === true, 'Transfer validation passes');
assert(authorizePin('1234') === true, 'PIN authorization passes');
userBalance = validation.remaining;
assert(userBalance === 2060, `Balance correctly updated to ₹${userBalance}`);

console.log(`\nSummary: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
