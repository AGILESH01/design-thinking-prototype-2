import { useEffect } from 'react';
import { ArrowLeft, CheckCircle, Wallet, ShieldCheck, Volume2 } from 'lucide-react';
import type { Screen, Contact, PaymentDetails, SupportedLanguage } from '../types';
import { numberToWords } from '../utils/formatters';
import { t } from '../utils/translations';
import { sound } from '../utils/sound';
import { triggerHaptic, speakPaymentSuccess } from '../utils/deviceSensors';

interface ConfirmScreenProps {
  navigate: (screen: Screen) => void;
  paymentDetails: PaymentDetails | null;
  contact: Contact;
  lang: SupportedLanguage;
}

export default function ConfirmScreen({
  navigate,
  paymentDetails,
  contact,
  lang,
}: ConfirmScreenProps) {
  const amount = paymentDetails?.amount || 500;
  const name = paymentDetails?.name || contact.name;
  const message = paymentDetails?.message || 'For family support';
  const remainingBalance = paymentDetails?.remainingBalance;
  const transactionId = paymentDetails?.transactionId || 'T482910485';
  const dateStr = paymentDetails?.date || 'Today, 12:00 PM';

  // Use in-device hardware sensors: Web Audio + Speech Synthesis + Physical Haptics
  useEffect(() => {
    sound.playPaymentSuccessChime();
    triggerHaptic([80, 40, 120]);
    speakPaymentSuccess(amount, name, lang);
  }, [amount, name, lang]);

  const handleReplayChime = () => {
    sound.playPaymentSuccessChime();
    triggerHaptic([80, 40, 120]);
    speakPaymentSuccess(amount, name, lang);
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-16">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate('home')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={t(lang, 'backToHome')}
        >
          <ArrowLeft size={28} className="text-gray-800" />
        </button>
        <div className="ml-3">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {t(lang, 'paymentResultTitle')}
          </h1>
          <p className="text-xs font-semibold text-gray-500">
            {t(lang, 'transactionCompleted')}
          </p>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col items-center overflow-y-auto space-y-4">
        {/* Success Banner */}
        <div className="w-full bg-green-50 border-2 border-green-300 rounded-3xl p-6 flex flex-col items-center text-center shadow-xs">
          <div className="w-18 h-18 bg-green-600 rounded-full flex items-center justify-center mb-3 shadow-md animate-bounce">
            <CheckCircle size={44} className="text-white" strokeWidth={2.5} />
          </div>

          <div className="text-green-900 font-black text-2xl">
            {t(lang, 'paymentSuccessful')}
          </div>

          <div className="text-4xl font-black text-gray-900 my-2 tracking-tight">
            ₹ {amount.toLocaleString('en-IN')}
          </div>

          <div className="text-xs font-bold text-green-950 bg-green-100/90 px-3 py-1 rounded-full border border-green-200">
            {numberToWords(amount)}
          </div>

          <p className="text-base font-extrabold text-gray-800 mt-2">
            {t(lang, 'toPerson', { name })}
          </p>
          <p className="text-xs font-medium text-gray-500">{dateStr}</p>

          {/* Soundbox Confirmation Pill */}
          <div className="mt-3 flex items-center gap-2 bg-white/90 border border-green-300 px-3 py-1.5 rounded-full shadow-2xs">
            <Volume2 size={16} className="text-green-700 animate-pulse" />
            <span className="text-[11px] font-bold text-green-900">
              {t(lang, 'soundPlayedChime')}
            </span>
            <button
              onClick={handleReplayChime}
              className="text-[10px] font-extrabold bg-green-600 hover:bg-green-700 text-white px-2 py-0.5 rounded-md ml-1"
            >
              Replay
            </button>
          </div>
        </div>

        {/* Transaction Details Card */}
        <div className="w-full bg-white border-2 border-gray-200 rounded-3xl p-4 shadow-sm space-y-2.5">
          <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-100">
            <span className="font-semibold text-gray-500">{t(lang, 'transactionId')}</span>
            <span className="font-mono font-bold text-gray-900">{transactionId}</span>
          </div>

          <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-100">
            <span className="font-semibold text-gray-500">{t(lang, 'sendingTo')}</span>
            <span className="font-bold text-gray-900">{contact.upiId}</span>
          </div>

          <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-100">
            <span className="font-semibold text-gray-500">{t(lang, 'paymentMethod')}</span>
            <span className="font-bold text-gray-900">UPI (•••• 4321)</span>
          </div>

          {message && (
            <div className="flex justify-between items-start text-xs pb-2 border-b border-gray-100">
              <span className="font-semibold text-gray-500">{t(lang, 'note')}</span>
              <span className="font-bold text-gray-800 text-right max-w-[65%] break-words">{message}</span>
            </div>
          )}

          {remainingBalance !== undefined && (
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="font-bold text-gray-700 flex items-center gap-1.5">
                <Wallet size={15} className="text-blue-600" /> {t(lang, 'availableBalance')}
              </span>
              <span className="font-black text-gray-900 text-sm">
                ₹ {remainingBalance.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>

        {/* Bank Reassurance Banner */}
        <div className="w-full bg-blue-50 border border-blue-200 rounded-2xl p-3 flex items-center gap-2.5 text-blue-900 text-xs font-semibold">
          <ShieldCheck size={20} className="text-blue-700 flex-shrink-0" />
          <span>Money has been securely transferred to the recipient's bank account.</span>
        </div>

        {/* Actions */}
        <div className="w-full space-y-2.5 pt-2">
          <button
            onClick={() => navigate('receipt')}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-lg rounded-2xl shadow-md transition-transform active:scale-[0.98]"
          >
            {t(lang, 'viewReceipt')}
          </button>

          <button
            onClick={() => navigate('home')}
            className="w-full py-3.5 bg-white border-2 border-gray-300 hover:bg-gray-100 text-gray-800 font-bold text-base rounded-2xl transition-colors"
          >
            {t(lang, 'backToHome')}
          </button>
        </div>
      </div>
    </div>
  );
}
