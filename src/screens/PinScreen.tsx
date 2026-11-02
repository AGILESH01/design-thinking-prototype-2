import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Lock, Delete, Eye, EyeOff, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import type { Screen, Contact, SupportedLanguage } from '../types';
import { DEMO_PIN } from '../utils/formatters';
import { t } from '../utils/translations';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/deviceSensors';
import StepGuidanceCard from '../components/StepGuidanceCard';

interface PinScreenProps {
  navigate: (screen: Screen) => void;
  contact: Contact;
  amount: number;
  message: string;
  method: string;
  lang: SupportedLanguage;
  autoNarrate?: boolean;
  onToggleAutoNarrate?: (enabled: boolean) => void;
  onAuthorize: () => void;
}

export default function PinScreen({
  navigate,
  contact,
  amount,
  lang,
  autoNarrate,
  onToggleAutoNarrate,
  onAuthorize,
}: PinScreenProps) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitPin = useCallback((enteredPin: string) => {
    if (enteredPin.length !== 4) {
      setError(t(lang, 'errorIncompletePin'));
      sound.playWarningAlert();
      return;
    }

    if (enteredPin !== DEMO_PIN) {
      setError(t(lang, 'errorIncorrectPin'));
      sound.playWarningAlert();
      return;
    }

    // Authorized! Simulate bank verification delay
    setIsSubmitting(true);
    setTimeout(() => {
      onAuthorize();
    }, 1100);
  }, [lang, onAuthorize]);

  // Hardware keyboard typing for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitting) return;

      if (e.key >= '0' && e.key <= '9') {
        if (pin.length < 4) {
          sound.playKeyClick();
          setError(null);
          setPin(prev => {
            const next = prev + e.key;
            if (next.length === 4) {
              setTimeout(() => handleSubmitPin(next), 50);
            }
            return next;
          });
        }
      } else if (e.key === 'Backspace') {
        sound.playKeyClick();
        setError(null);
        setPin(prev => prev.slice(0, -1));
      } else if (e.key === 'Enter' && pin.length === 4) {
        handleSubmitPin(pin);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isSubmitting, handleSubmitPin]);

  const handleKeyPress = (num: string) => {
    if (isSubmitting || pin.length >= 4) return;
    sound.playKeyClick();
    triggerHaptic(20);
    setError(null);
    const newPin = pin + num;
    setPin(newPin);
    if (newPin.length === 4) {
      handleSubmitPin(newPin);
    }
  };

  const handleDelete = () => {
    if (isSubmitting) return;
    sound.playKeyClick();
    triggerHaptic(30);
    setError(null);
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isSubmitting) return;
    sound.playKeyClick();
    setError(null);
    setPin('');
  };

  const handleUseDemoPin = () => {
    if (isSubmitting) return;
    sound.playKeyClick();
    setError(null);
    setPin(DEMO_PIN);
    handleSubmitPin(DEMO_PIN);
  };

  return (
    <div className="flex flex-col min-h-full bg-white relative pb-10">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <button
          onClick={() => navigate('review')}
          disabled={isSubmitting}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          aria-label="Back to review"
        >
          <ArrowLeft size={28} className="text-gray-800" />
        </button>
        <div className="ml-3">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {t(lang, 'authorizePaymentTitle')}
          </h1>
          <p className="text-xs font-semibold text-gray-500">
            {t(lang, 'step3Of3')}
          </p>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col items-center justify-between">
        {/* Step 4 of 4 Senior Guidance & What Happens Next */}
        <div className="w-full">
          <StepGuidanceCard
            stepNumber={4}
            stepId="pin"
            lang={lang}
            autoNarrate={autoNarrate}
            onToggleAutoNarrate={onToggleAutoNarrate}
          />
        </div>

        {/* Context Strip */}
        <div className="w-full bg-gray-50 border border-gray-200 rounded-3xl p-3.5 text-center mb-3 shadow-xs">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            {t(lang, 'paymentAuthorization')}
          </p>
          <div className="text-2xl font-black text-gray-900 mt-0.5">
            ₹ {amount.toLocaleString('en-IN')}
          </div>
          <p className="text-xs font-bold text-blue-700 mt-0.5">
            {t(lang, 'toRecipient', { name: contact.name })}
          </p>
        </div>

        {/* PIN Entry Area */}
        <div className="w-full flex flex-col items-center my-1">
          <div className="flex items-center gap-2 text-gray-800 font-bold mb-3 text-sm">
            <Lock size={18} className="text-green-700" />
            <span>{t(lang, 'enterPinPrompt')}</span>
          </div>

          {/* 4 Digit Boxes */}
          <div className="flex items-center justify-center gap-3.5 mb-2.5">
            {[0, 1, 2, 3].map((index) => {
              const digit = pin[index];
              const isFilled = digit !== undefined;
              return (
                <div
                  key={index}
                  className={`w-14 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl font-black transition-all shadow-xs ${
                    error
                      ? 'border-red-400 bg-red-50 text-red-700 ring-2 ring-red-100'
                      : isFilled
                      ? 'border-green-600 bg-green-50/70 text-gray-900 ring-2 ring-green-100'
                      : 'border-gray-300 bg-gray-50 text-gray-400'
                  }`}
                >
                  {isFilled ? (showPin ? digit : '•') : ''}
                </div>
              );
            })}
          </div>

          {/* Toggle PIN visibility */}
          <button
            type="button"
            onClick={() => {
              sound.playKeyClick();
              setShowPin(!showPin);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            {showPin ? <EyeOff size={15} /> : <Eye size={15} />}
            <span>{showPin ? t(lang, 'hideDigits') : t(lang, 'showDigits')}</span>
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-2.5 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold text-center">
              {error}
            </div>
          )}

          {/* Demo Hint Banner with Auto-fill helper */}
          <div className="mt-2.5 flex items-center justify-between gap-3 bg-purple-50 border border-purple-200 px-3.5 py-1.5 rounded-xl w-full max-w-[320px]">
            <span className="text-xs font-bold text-purple-900">
              {t(lang, 'demoPinBadge')} <span className="font-mono text-sm tracking-wider font-extrabold">{DEMO_PIN}</span>
            </span>
            <button
              type="button"
              onClick={handleUseDemoPin}
              disabled={isSubmitting}
              className="text-xs font-extrabold bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-1 rounded-lg transition-colors shadow-xs"
            >
              {t(lang, 'fillDemoPin')}
            </button>
          </div>
        </div>

        {/* Tactile Large Keypad (Accessibility optimized for seniors) */}
        <div className="w-full max-w-[320px] mt-2 mb-3">
          <div className="grid grid-cols-3 gap-2.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num)}
                disabled={isSubmitting}
                className="h-13 bg-gray-100 hover:bg-gray-200 active:bg-blue-100 border border-gray-200 rounded-2xl text-2xl font-bold text-gray-900 transition-all flex items-center justify-center active:scale-95 shadow-xs disabled:opacity-50"
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={handleClear}
              disabled={isSubmitting || pin.length === 0}
              className="h-13 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 border border-gray-200 rounded-2xl text-xs font-extrabold text-gray-700 transition-all flex items-center justify-center active:scale-95 shadow-xs disabled:opacity-40"
            >
              {t(lang, 'clearKey')}
            </button>

            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              disabled={isSubmitting}
              className="h-13 bg-gray-100 hover:bg-gray-200 active:bg-blue-100 border border-gray-200 rounded-2xl text-2xl font-bold text-gray-900 transition-all flex items-center justify-center active:scale-95 shadow-xs disabled:opacity-50"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting || pin.length === 0}
              className="h-13 bg-gray-100 hover:bg-gray-200 active:bg-red-100 border border-gray-200 rounded-2xl text-gray-800 transition-all flex items-center justify-center active:scale-95 shadow-xs disabled:opacity-40"
              aria-label="Backspace"
            >
              <Delete size={22} />
            </button>
          </div>
        </div>

        {/* Security Rule Footer */}
        <div className="w-full flex items-center gap-2.5 bg-yellow-50 border border-yellow-200 px-3.5 py-2.5 rounded-xl text-yellow-900">
          <ShieldAlert size={20} className="text-yellow-700 flex-shrink-0" />
          <p className="text-[11px] font-semibold leading-tight">
            {t(lang, 'pinSecurityReminder')}
          </p>
        </div>
      </div>

      {/* Authorizing Modal Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center z-30 p-6 text-center animate-fade-in">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border-4 border-blue-200 mb-4 shadow-md">
            <Loader2 size={40} className="text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">
            {t(lang, 'pinAuthorizingModalTitle')}
          </h2>
          <p className="text-xs font-semibold text-gray-600 max-w-xs leading-normal">
            {t(lang, 'pinAuthorizingModalDesc')}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-200">
            <CheckCircle2 size={14} /> {t(lang, 'pinVerifiedBadge')}
          </div>
        </div>
      )}
    </div>
  );
}
