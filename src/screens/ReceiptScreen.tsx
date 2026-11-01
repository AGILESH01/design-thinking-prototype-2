import { ArrowLeft, CheckCircle2, Share2, Printer } from 'lucide-react';
import type { Screen, Contact, PaymentDetails, SupportedLanguage } from '../types';
import { numberToWords } from '../utils/formatters';
import { t } from '../utils/translations';
import { sound } from '../utils/sound';

interface ReceiptScreenProps {
  navigate: (screen: Screen) => void;
  paymentDetails: PaymentDetails | null;
  contact: Contact;
  lang: SupportedLanguage;
}

export default function ReceiptScreen({
  navigate,
  paymentDetails,
  contact,
  lang,
}: ReceiptScreenProps) {
  const amount = paymentDetails?.amount || 500;
  const name = paymentDetails?.name || contact.name;
  const message = paymentDetails?.message || 'For family support';
  const remainingBalance = paymentDetails?.remainingBalance;
  const transactionId = paymentDetails?.transactionId || 'T482910485';
  const dateStr = paymentDetails?.date || 'Today, 12:00 PM';

  const handleShare = () => {
    sound.playKeyClick();
    window.alert('Sharing receipt proof...');
  };

  const handlePrint = () => {
    sound.playKeyClick();
    window.print();
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-100 pb-16">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate('confirm')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={28} className="text-gray-800" />
        </button>
        <div className="ml-3">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {t(lang, 'officialReceiptTitle')}
          </h1>
          <p className="text-xs font-semibold text-gray-500">
            {t(lang, 'officialReceiptSubtitle')}
          </p>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col items-center overflow-y-auto space-y-4">
        {/* Printable Paper-like Receipt Card */}
        <div className="w-full bg-white border-2 border-gray-300 rounded-3xl p-6 shadow-md relative">
          <div className="text-center pb-4 border-b border-dashed border-gray-300">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-xl font-black text-gray-900">National Payments Corporation (NPCI)</h2>
            <p className="text-xs font-bold text-green-700 mt-0.5">UPI Simulated Transaction Record</p>
            <p className="text-[11px] font-mono text-gray-400 mt-1">{dateStr}</p>
          </div>

          <div className="py-4 text-center border-b border-dashed border-gray-300">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              {t(lang, 'totalPaymentAmount')}
            </span>
            <span className="text-3xl font-black text-gray-900 block my-1">
              ₹ {amount.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 inline-block">
              {numberToWords(amount)}
            </span>
          </div>

          <div className="py-4 space-y-2.5 text-xs border-b border-dashed border-gray-300">
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold">{t(lang, 'transactionId')}</span>
              <span className="font-mono font-bold text-gray-900">{transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold">{t(lang, 'sendingTo')}</span>
              <span className="font-bold text-gray-900">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold">UPI ID</span>
              <span className="font-bold text-gray-900">{contact.upiId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold">{t(lang, 'paymentMethod')}</span>
              <span className="font-bold text-gray-900">UPI Bank Transfer</span>
            </div>
            {message && (
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">{t(lang, 'note')}</span>
                <span className="font-bold text-gray-900">{message}</span>
              </div>
            )}
            {remainingBalance !== undefined && (
              <div className="flex justify-between pt-1">
                <span className="text-blue-700 font-bold">{t(lang, 'availableBalance')}</span>
                <span className="font-black text-blue-950">₹ {remainingBalance.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          <div className="pt-3 text-center">
            <p className="text-[10px] text-gray-400 font-semibold">
              Thank you for using Senior-Friendly UPI. Keep this receipt for your records.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5 pt-2">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleShare}
              className="py-3 bg-white border-2 border-gray-300 hover:bg-gray-100 text-gray-800 font-bold text-sm rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 size={18} />
              <span>{t(lang, 'shareReceipt')}</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-3 bg-white border-2 border-gray-300 hover:bg-gray-100 text-gray-800 font-bold text-sm rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer size={18} />
              <span>Print PDF</span>
            </button>
          </div>

          <button
            onClick={() => navigate('home')}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg rounded-2xl shadow-md transition-transform active:scale-[0.98]"
          >
            {t(lang, 'doneButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
