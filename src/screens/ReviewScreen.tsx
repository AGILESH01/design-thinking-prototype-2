import { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  User, 
  Building2, 
  Users, 
  Lightbulb, 
  ShoppingBag, 
  HeartPulse, 
  Film,
  Wallet, 
  ArrowRight, 
  Edit3, 
  AlertTriangle 
} from 'lucide-react';
import type { Screen, Contact, SupportedLanguage, Transaction } from '../types';
import { numberToWords } from '../utils/formatters';
import { t } from '../utils/translations';
import { sound } from '../utils/sound';
import HighAmountWarningModal from '../components/HighAmountWarningModal';

interface ReviewScreenProps {
  navigate: (screen: Screen) => void;
  contact: Contact;
  amount: number;
  message: string;
  method: string;
  balance: number;
  lang: SupportedLanguage;
  highAmountThreshold: number;
  transactions: Transaction[];
  onProceedToPin: () => void;
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

export default function ReviewScreen({
  navigate,
  contact,
  amount,
  message,
  method,
  balance,
  lang,
  highAmountThreshold,
  transactions,
  onProceedToPin,
}: ReviewScreenProps) {
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const Icon = ICON_MAP[contact.iconName] || User;

  // Calculate historical average of completed outgoing transactions
  const { historicalAvg, isUnusual } = useMemo(() => {
    const outgoing = transactions.filter(tx => !tx.isReceived && tx.status === 'Completed');
    if (outgoing.length === 0) return { historicalAvg: 500, isUnusual: false };
    const total = outgoing.reduce((sum, tx) => sum + tx.amount, 0);
    const avg = total / outgoing.length;
    // Explainable rule: if amount > 3x average AND > 1500, flag as unusual
    const unusual = amount > avg * 2.8 && amount > 1500;
    return { historicalAvg: avg, isUnusual: unusual };
  }, [transactions, amount]);

  const isHighAmount = amount >= highAmountThreshold || isUnusual;

  const handleProceedClick = () => {
    if (isHighAmount) {
      sound.playWarningAlert();
      setIsWarningModalOpen(true);
    } else {
      sound.playKeyClick();
      onProceedToPin();
    }
  };

  const getMethodLabel = (m: string) => {
    switch (m) {
      case 'bank': return 'HDFC Bank - •••• 5678';
      case 'card': return 'Debit Card - •••• 1234';
      default: return 'UPI (Linked to 9876543210)';
    }
  };

  const remainingBalance = balance - amount;

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-12">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate('pay')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={t(lang, 'backToEdit')}
        >
          <ArrowLeft size={28} className="text-gray-800" />
        </button>
        <div className="ml-3">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {t(lang, 'reviewPaymentTitle')}
          </h1>
          <p className="text-xs font-semibold text-gray-500">
            {t(lang, 'step2Of3')}
          </p>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        {/* Trust Mode Reassurance Banner */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-4 flex items-start gap-3 shadow-xs">
          <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-700 mt-0.5">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-blue-900">
              {t(lang, 'trustModeTitle')}
            </h2>
            <p className="text-xs font-medium text-blue-800 leading-snug mt-0.5">
              {t(lang, 'trustModeDesc')}
            </p>
          </div>
        </div>

        {/* High Amount Proactive In-Card Notice if applicable */}
        {amount >= highAmountThreshold && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 flex items-center gap-3">
            <AlertTriangle className="text-amber-700 flex-shrink-0" size={24} />
            <p className="text-xs font-bold text-amber-900 leading-tight">
              High-amount threshold (₹{highAmountThreshold.toLocaleString('en-IN')}) exceeded. A safety verification will be confirmed before entering your PIN.
            </p>
          </div>
        )}

        {/* Big Amount Card */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 text-center shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            {t(lang, 'totalPaymentAmount')}
          </p>
          <div className="text-4xl font-extrabold text-gray-900 my-1 tracking-tight">
            ₹ {amount.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 bg-purple-50 text-purple-950 font-bold text-xs px-3 py-1.5 rounded-xl inline-block border border-purple-200">
            {numberToWords(amount)}
          </div>
        </div>

        {/* Recipient Details Card */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {t(lang, 'sendingTo')}
            </span>
            <button
              onClick={() => navigate('recipient')}
              className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
            >
              <Edit3 size={13} /> {t(lang, 'changeRecipient')}
            </button>
          </div>
          <div className="flex items-center gap-3.5">
            <div className={`w-13 h-13 rounded-full flex items-center justify-center flex-shrink-0 ${contact.bg}`}>
              <Icon size={26} className={contact.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base font-bold text-gray-900 truncate">
                  {contact.name}
                </h3>
                <span className="inline-flex items-center gap-0.5 text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-[11px] font-bold border border-green-200">
                  <ShieldCheck size={12} /> {t(lang, 'verifiedRecipient')}
                </span>
              </div>
              <p className="text-gray-500 text-xs font-medium truncate mt-0.5">
                {contact.upiId}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Summary & Balance Breakdown */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-4 shadow-sm space-y-2.5">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            {t(lang, 'paymentSummary')}
          </span>

          <div className="flex justify-between items-center text-xs py-1 border-b border-gray-100">
            <span className="font-semibold text-gray-600">{t(lang, 'payingFrom')}</span>
            <span className="font-bold text-gray-900 text-right">{getMethodLabel(method)}</span>
          </div>

          <div className="flex justify-between items-center text-xs py-1 border-b border-gray-100">
            <span className="font-semibold text-gray-600">{t(lang, 'currentBalance')}</span>
            <span className="font-bold text-gray-900">₹ {balance.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center text-xs py-1 border-b border-gray-100">
            <span className="font-semibold text-gray-600">{t(lang, 'amountDeducted')}</span>
            <span className="font-extrabold text-red-600">- ₹ {amount.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center text-xs py-2 bg-green-50 px-3 rounded-xl border border-green-200">
            <span className="font-bold text-green-900 flex items-center gap-1.5">
              <Wallet size={16} /> {t(lang, 'balanceAfterPayment')}
            </span>
            <span className="font-extrabold text-green-950 text-sm">
              ₹ {remainingBalance.toLocaleString('en-IN')}
            </span>
          </div>

          {message && (
            <div className="flex justify-between items-start text-xs pt-1">
              <span className="font-semibold text-gray-600">{t(lang, 'note')}</span>
              <span className="font-bold text-gray-800 text-right max-w-[65%] break-words">{message}</span>
            </div>
          )}
        </div>

        {/* CTA Actions */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleProceedClick}
            className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-extrabold text-lg py-4 rounded-2xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t(lang, 'proceedToPin')}</span>
            <ArrowRight size={22} />
          </button>

          <button
            onClick={() => navigate('pay')}
            className="w-full bg-white border-2 border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-sm py-3 rounded-2xl transition-colors"
          >
            {t(lang, 'backToEdit')}
          </button>
        </div>
      </div>

      {/* Feature 3: High Amount Warning Modal */}
      <HighAmountWarningModal
        isOpen={isWarningModalOpen}
        lang={lang}
        amount={amount}
        contact={contact}
        threshold={highAmountThreshold}
        historicalAvg={historicalAvg}
        isUnusual={isUnusual}
        onReview={() => setIsWarningModalOpen(false)}
        onContinue={() => {
          setIsWarningModalOpen(false);
          onProceedToPin();
        }}
      />
    </div>
  );
}
