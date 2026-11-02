import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ShieldCheck, ArrowRight, Check, Sparkles } from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { t } from '../utils/translations';
import { 
  speakStepGuidance, 
  stopSpeaking, 
  triggerHaptic, 
  type StepGuidanceId 
} from '../utils/deviceSensors';
import { sound } from '../utils/sound';

interface StepGuidanceCardProps {
  stepNumber: 1 | 2 | 3 | 4;
  stepId: StepGuidanceId;
  lang: SupportedLanguage;
  autoNarrate?: boolean;
  onToggleAutoNarrate?: (enabled: boolean) => void;
}

export default function StepGuidanceCard({
  stepNumber,
  stepId,
  lang,
  autoNarrate = false,
  onToggleAutoNarrate,
}: StepGuidanceCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const hasAutoPlayedRef = useRef(false);

  // Stop voice when component unmounts or step changes
  useEffect(() => {
    return () => {
      stopSpeaking();
      setIsSpeaking(false);
    };
  }, [stepId]);

  // Auto-narration on step open if enabled
  useEffect(() => {
    if (autoNarrate && !hasAutoPlayedRef.current) {
      hasAutoPlayedRef.current = true;
      const timer = setTimeout(() => {
        setIsSpeaking(true);
        speakStepGuidance(
          stepId,
          lang,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [stepId, lang, autoNarrate]);

  const handleToggleVoice = () => {
    triggerHaptic(25);
    sound.playKeyClick();

    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakStepGuidance(
        stepId,
        lang,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  const getStepTitle = () => {
    switch (stepId) {
      case 'recipient': return t(lang, 'step1Title');
      case 'pay': return t(lang, 'step2Title');
      case 'review': return t(lang, 'step3Title');
      case 'pin': return t(lang, 'step4Title');
    }
  };

  const getStepDesc = () => {
    switch (stepId) {
      case 'recipient': return t(lang, 'step1Desc');
      case 'pay': return t(lang, 'step2Desc');
      case 'review': return t(lang, 'step3Desc');
      case 'pin': return t(lang, 'step4Desc');
    }
  };

  const getStepNext = () => {
    switch (stepId) {
      case 'recipient': return t(lang, 'step1Next');
      case 'pay': return t(lang, 'step2Next');
      case 'review': return t(lang, 'step3Next');
      case 'pin': return t(lang, 'step4Next');
    }
  };

  const isLastStep = stepNumber === 4;

  return (
    <div className="mb-4 bg-gradient-to-b from-blue-50/80 to-white border-2 border-blue-200/80 rounded-2xl p-4 shadow-xs">
      {/* 4-Step Stepper Progress Bar */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-600 text-white tracking-wide uppercase">
            {t(lang, 'stepOfTotal', { current: stepNumber, total: 4 })}
          </span>
          <span className="text-sm font-extrabold text-blue-950">
            {getStepTitle()}
          </span>
        </div>

        {/* Stepper Dots */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((num) => {
            const isCompleted = num < stepNumber;
            const isCurrent = num === stepNumber;

            return (
              <div
                key={num}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  isCompleted
                    ? 'bg-green-600 text-white'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-1 scale-110 shadow-xs'
                    : 'bg-gray-200 text-gray-500'
                }`}
                aria-label={`Step ${num}`}
              >
                {isCompleted ? <Check size={13} strokeWidth={3} /> : num}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Objective */}
      <p className="text-sm text-gray-700 font-medium leading-relaxed mb-3">
        {getStepDesc()}
      </p>

      {/* Predictive "What Happens Next?" Box */}
      <div className="bg-white/90 border border-blue-200 rounded-xl p-3 mb-3 shadow-2xs">
        <div className="flex items-center gap-2 mb-1 text-xs font-black text-blue-800 uppercase tracking-wider">
          <ArrowRight size={15} className="text-blue-600 animate-pulse" />
          <span>{t(lang, 'whatHappensNext')}</span>
        </div>
        <p className="text-sm font-bold text-gray-900 leading-snug">
          {getStepNext()}
        </p>
      </div>

      {/* Reassurance Guarantee Shield */}
      <div className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs font-semibold leading-relaxed mb-3.5 ${
        isLastStep 
          ? 'bg-amber-50/80 border-amber-200 text-amber-900' 
          : 'bg-green-50/80 border-green-200 text-green-900'
      }`}>
        <ShieldCheck size={18} className={`shrink-0 mt-0.5 ${isLastStep ? 'text-amber-600' : 'text-green-600'}`} />
        <span>
          {isLastStep ? t(lang, 'pinDeductionGuarantee') : t(lang, 'noDeductionGuarantee')}
        </span>
      </div>

      {/* Spoken Voice Guidance Controls */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-blue-100">
        <button
          type="button"
          onClick={handleToggleVoice}
          className={`flex items-center justify-center gap-2.5 px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition-all active:scale-[0.98] ${
            isSpeaking
              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md animate-pulse'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
          }`}
          aria-pressed={isSpeaking}
        >
          {isSpeaking ? (
            <>
              <VolumeX size={16} />
              <span>{t(lang, 'stopGuidance')}</span>
            </>
          ) : (
            <>
              <Volume2 size={16} />
              <span>{t(lang, 'listenGuidance')}</span>
            </>
          )}
        </button>

        {/* Real-time speaking soundwave indicator or Auto-Narration Toggle */}
        {isSpeaking ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 animate-pulse pr-1">
            <Sparkles size={14} className="text-amber-500" />
            <span>{t(lang, 'speakingNow')}</span>
          </div>
        ) : onToggleAutoNarrate ? (
          <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoNarrate}
              onChange={(e) => {
                triggerHaptic(15);
                onToggleAutoNarrate(e.target.checked);
              }}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
            />
            <span className="text-[11px] font-semibold text-gray-700">
              {t(lang, 'autoNarrateToggle')}
            </span>
          </label>
        ) : null}
      </div>
    </div>
  );
}
