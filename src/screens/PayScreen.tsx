import { useState, useId } from 'react';
import { 
  ArrowLeft, 
  User, 
  Building2, 
  Users, 
  Lightbulb, 
  ShoppingBag, 
  HeartPulse, 
  Film,
  ShieldCheck, 
  X, 
  AlertTriangle, 
  Wallet 
} from 'lucide-react';
import type { Screen, Contact, SupportedLanguage } from '../types';
import { MIN_TRANSACTION_LIMIT, numberToWords } from '../utils/formatters';
import { t } from '../utils/translations';
import { sound } from '../utils/sound';

interface PayScreenProps {
  navigate: (screen: Screen) => void;
  contact: Contact;
  balance: number;
  lang: SupportedLanguage;
  maxLimit: number;
  initialAmount?: string;
  initialMessage?: string;
  initialMethod?: string;
  onProceedToReview: (amount: number, message: string, method: string) => void;
}

const ICON_MAP = {
  Building2,
  Users,
  Lightbulb,
  ShoppingBag,
  HeartPulse,
  Film,
  User,
} as const;

export default function PayScreen({
  navigate,
  contact,
  balance,
  lang,
  maxLimit,
  initialAmount = '500',
  initialMessage = 'For family support',
  initialMethod = 'upi',
  onProceedToReview,
}: PayScreenProps) {
  const [amount, setAmount] = useState(initialAmount);
  const [message, setMessage] = useState(initialMessage);
  const [method, setMethod] = useState(initialMethod);

  const amountInputId = useId();
  const messageInputId = useId();

  const Icon = ICON_MAP[contact.iconName] || User;
  const numAmount = parseInt(amount, 10);
  const isNaNValue = isNaN(numAmount) || amount.trim() === '';

  // Strict Validation Rules
  const isZeroOrNegative = !isNaNValue && numAmount < MIN_TRANSACTION_LIMIT;
  const isExceedingLimit = !isNaNValue && numAmount > maxLimit;
  const isExceedingBalance = !isNaNValue && numAmount > balance;
  const isValid = !isNaNValue && !isZeroOrNegative && !isExceedingLimit && !isExceedingBalance;

  const handleReview = () => {
    if (isValid) {
      sound.playKeyClick();
      onProceedToReview(numAmount, message.trim(), method);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000];

  const paymentMethods = [
    { id: 'upi', label: 'UPI (Google Pay / BHIM / Paytm)', icon: '📱', sub: 'Linked to 9876543210' },
    { id: 'bank', label: 'Bank Account', icon: '🏦', sub: 'HDFC Bank - •••• 5678' },
    { id: 'card', label: 'Debit / Credit Card', icon: '💳', sub: 'Visa - •••• 1234' },
  ];

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-12">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate('recipient')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Back to recipient selection"
        >
          <ArrowLeft size={28} className="text-gray-800" />
        </button>
        <div className="ml-3">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {t(lang, 'enterAmountTitle')}
          </h1>
          <p className="text-xs font-semibold text-gray-500">
            {t(lang, 'step1Of3')}
          </p>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        {/* Recipient Card */}
        <div className="flex items-center justify-between bg-white border-2 border-gray-200 rounded-3xl p-4 shadow-sm">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <div className={`w-13 h-13 rounded-full flex items-center justify-center flex-shrink-0 ${contact.bg}`}>
              <Icon size={26} className={contact.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-base font-bold text-gray-900 truncate">
                  {contact.name}
                </h2>
                <span className="inline-flex items-center gap-0.5 text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-[11px] font-bold border border-green-200">
                  <ShieldCheck size={12} /> {t(lang, 'verifiedRecipient')}
                </span>
              </div>
              <p className="text-gray-500 text-xs font-medium truncate mt-0.5">
                {contact.upiId}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('recipient')}
            className="text-blue-600 font-bold text-xs px-2.5 py-1.5 hover:bg-blue-50 rounded-xl transition-colors ml-2"
          >
            {t(lang, 'changeRecipient')}
          </button>
        </div>

        {/* Available Balance Preview Card */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">
                {t(lang, 'availableBalance')}
              </p>
              <p className="text-xl font-extrabold text-blue-950">
                ₹ {balance.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold bg-white text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
            {t(lang, 'trustSafeBadge')}
          </span>
        </div>

        {/* Amount Input */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-sm">
          <label htmlFor={amountInputId} className="block text-sm font-bold text-gray-800 mb-2">
            {t(lang, 'paymentAmountLabel')}
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-3xl font-extrabold text-gray-700 select-none">₹</span>
            <input
              id={amountInputId}
              type="number"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full pl-12 pr-12 py-3.5 text-3xl font-extrabold text-gray-900 bg-gray-50 border-2 rounded-2xl transition-all outline-none ${
                isExceedingBalance || isExceedingLimit
                  ? 'border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                  : 'border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100'
              }`}
              placeholder="0"
            />
            {amount && (
              <button
                onClick={() => setAmount('')}
                className="absolute right-4 p-1.5 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 transition-colors"
                aria-label="Clear amount"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Amount in Words for Senior Error Prevention */}
          {!isNaNValue && numAmount > 0 && !isExceedingLimit && (
            <div className="mt-2.5 px-3 py-2 bg-purple-50 rounded-xl border border-purple-200">
              <p className="text-[11px] font-bold text-purple-600 uppercase tracking-wide">
                {t(lang, 'amountInWordsLabel')}
              </p>
              <p className="text-sm font-bold text-purple-950 leading-snug mt-0.5">
                {numberToWords(numAmount)}
              </p>
            </div>
          )}

          {/* Quick Preset Buttons */}
          <div className="mt-4">
            <p className="text-xs font-bold text-gray-500 mb-2">
              {t(lang, 'quickAmountsLabel')}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    sound.playKeyClick();
                    setAmount(q.toString());
                  }}
                  className={`py-2 text-sm font-bold rounded-xl border-2 transition-all ${
                    amount === q.toString()
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-100 active:scale-95'
                  }`}
                >
                  ₹{q.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Validation Errors */}
        {isExceedingBalance && (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
            <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h4 className="text-sm font-bold text-red-900">
                {t(lang, 'insufficientBalanceTitle')}
              </h4>
              <p className="text-xs font-semibold text-red-700 leading-snug mt-0.5">
                {t(lang, 'insufficientBalanceDesc', {
                  amount: numAmount.toLocaleString('en-IN'),
                  balance: balance.toLocaleString('en-IN'),
                })}
              </p>
            </div>
          </div>
        )}

        {isExceedingLimit && (
          <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
            <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h4 className="text-sm font-bold text-orange-900">
                {t(lang, 'maxLimitExceededTitle')}
              </h4>
              <p className="text-xs font-semibold text-orange-800 leading-snug mt-0.5">
                {t(lang, 'maxLimitExceededDesc', {
                  limit: maxLimit.toLocaleString('en-IN'),
                })}
              </p>
            </div>
          </div>
        )}

        {isZeroOrNegative && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 flex items-center gap-2">
            <AlertTriangle className="text-amber-600 flex-shrink-0" size={20} />
            <p className="text-xs font-bold text-amber-900">
              {t(lang, 'minLimitDesc')}
            </p>
          </div>
        )}

        {isValid && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 flex items-center justify-between text-xs font-bold text-green-800">
            <span>{t(lang, 'balanceCheckPassed')}</span>
            <span>₹{(balance - numAmount).toLocaleString('en-IN')} {t(lang, 'remainingAfterPay')}</span>
          </div>
        )}

        {/* Message Input */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm">
          <label htmlFor={messageInputId} className="block text-sm font-bold text-gray-800 mb-2">
            {t(lang, 'noteLabel')}
          </label>
          <input
            id={messageInputId}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
            placeholder={t(lang, 'notePlaceholder')}
          />
        </div>

        {/* Payment Method */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-bold text-gray-800 mb-3">
            {t(lang, 'payFromAccount')}
          </label>
          <div className="space-y-2.5">
            {paymentMethods.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                  method === opt.id ? 'border-blue-600 bg-blue-50/70' : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl">{opt.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-900 leading-snug">{opt.label}</div>
                  <div className="text-xs font-semibold text-gray-500 mt-0.5">{opt.sub}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  method === opt.id ? 'border-blue-600' : 'border-gray-300'
                }`}>
                  {method === opt.id && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={opt.id}
                  checked={method === opt.id}
                  onChange={() => setMethod(opt.id)}
                  className="hidden"
                />
              </label>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleReview}
          disabled={!isValid}
          className={`w-full font-extrabold text-lg py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 ${
            isValid
              ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white cursor-pointer active:scale-[0.99]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
          }`}
        >
          {isExceedingBalance
            ? t(lang, 'cannotProceedInsufficient')
            : isExceedingLimit
            ? t(lang, 'cannotProceedLimit')
            : t(lang, 'reviewPaymentButton')}
        </button>
      </div>
    </div>
  );
}
