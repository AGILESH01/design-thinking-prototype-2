export const DEFAULT_MAX_TRANSACTION_LIMIT = 5000;
export const DEFAULT_HIGH_AMOUNT_THRESHOLD = 3000;
export const MIN_TRANSACTION_LIMIT = 1;
export const DEMO_PIN = '1234';

// Legacy alias to maintain backward compatibility
export const MAX_TRANSACTION_LIMIT = DEFAULT_MAX_TRANSACTION_LIMIT;

/**
 * Converts a numeric amount to Indian English currency words.
 * Example: 500 -> "Five Hundred Rupees Only"
 * Crucial for senior citizens to verify they haven't accidentally added an extra zero.
 */
export function numberToWords(num: number): string {
  if (!num || isNaN(num) || num <= 0) return '';
  
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertGroup(n: number): string {
    let str = '';
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += ones[n] + ' ';
    }
    return str.trim();
  }

  let result = '';
  let remaining = Math.floor(num);

  const crore = Math.floor(remaining / 10000000);
  remaining %= 10000000;

  const lakh = Math.floor(remaining / 100000);
  remaining %= 100000;

  const thousand = Math.floor(remaining / 1000);
  remaining %= 1000;

  const hundreds = remaining;

  if (crore > 0) {
    result += convertGroup(crore) + ' Crore ';
  }
  if (lakh > 0) {
    result += convertGroup(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    result += convertGroup(thousand) + ' Thousand ';
  }
  if (hundreds > 0) {
    result += convertGroup(hundreds) + ' ';
  }

  const trimmed = result.trim();
  return trimmed ? `${trimmed} Rupees Only` : '';
}
