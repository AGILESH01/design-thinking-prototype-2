import { AlertTriangle, ArrowLeft, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import type { SupportedLanguage, Contact } from '../types';
import { t } from '../utils/translations';
import { numberToWords } from '../utils/formatters';

interface HighAmountWarningModalProps {
  isOpen: boolean;
  lang: SupportedLanguage;
  amount: number;
  contact: Contact;
  threshold: number;
  historicalAvg: number;
  isUnusual: boolean;
  onReview: () => void;
  onContinue: () => void;
}

export default function HighAmountWarningModal({
  isOpen,
  lang,
  amount,
  contact,
  historicalAvg,
  isUnusual,
  onReview,
  onContinue,
}: HighAmountWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="w-full max-w-[370px] bg-white rounded-3xl shadow-2xl border-4 border-amber-300 p-6 flex flex-col items-center relative">
        
        {/* Warning Icon Badge */}
        <div className="w-18 h-18 bg-amber-100 border-4 border-amber-300 rounded-3xl flex items-center justify-center text-amber-700 mb-3 shadow-sm">
          <AlertTriangle size={38} className="animate-pulse" />
        </div>

        {/* Warning Title */}
        <h3 className="text-xl font-extrabold text-amber-950 text-center leading-tight">
          {t(lang, 'highAmountWarningTitle')}
        </h3>

        {/* Subtitle with Amount */}
        <div className="my-3 py-2 px-4 bg-amber-50 rounded-2xl border border-amber-200 text-center w-full">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">
            {t(lang, 'sendingTo')} {contact.name}
          </p>
          <div className="text-3xl font-extrabold text-gray-900 mt-0.5">
            ₹{amount.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] font-bold text-purple-900 mt-1">
            {numberToWords(amount)}
          </p>
        </div>

        {/* Warning Description */}
        <p className="text-sm font-semibold text-gray-700 text-center leading-relaxed mb-3">
          {t(lang, 'highAmountWarningDesc')}
        </p>

        {/* Explainable Unusual Spending Alert if triggered */}
        {isUnusual && (
          <div className="w-full bg-orange-50 border-2 border-orange-200 rounded-2xl p-3 mb-4 flex items-start gap-2.5 text-left">
            <Sparkles size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-extrabold text-orange-950">
                {t(lang, 'unusualAlertTitle')}
              </p>
              <p className="text-[11px] font-semibold text-orange-900 leading-snug mt-0.5">
                {t(lang, 'unusualAlertDesc', {
                  amount: amount.toLocaleString('en-IN'),
                  avg: Math.round(historicalAvg).toLocaleString('en-IN'),
                })}
              </p>
            </div>
          </div>
        )}

        {/* Reassurance Reminder */}
        <div className="w-full bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 mb-5 flex items-center gap-2 text-blue-900 text-xs font-bold">
          <ShieldAlert size={16} className="text-blue-700 flex-shrink-0" />
          <span>No money is deducted until you confirm with your PIN.</span>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5">
          <button
            type="button"
            onClick={onContinue}
            className="w-full py-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-2xl font-extrabold text-lg shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{t(lang, 'highAmountWarningActionContinue')}</span>
            <ArrowRight size={20} />
          </button>

          <button
            type="button"
            onClick={onReview}
            className="w-full py-3 bg-white border-2 border-gray-300 hover:bg-gray-100 text-gray-800 rounded-2xl font-bold text-base transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            <span>{t(lang, 'highAmountWarningActionReview')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
