import { ArrowLeft, ShieldAlert, KeyRound, PhoneOff, EyeOff, ShieldCheck } from 'lucide-react';
import type { Screen, SupportedLanguage } from '../types';
import { t } from '../utils/translations';
import { sound } from '../utils/sound';

interface SafetyScreenProps {
  navigate: (screen: Screen) => void;
  lang: SupportedLanguage;
}

export default function SafetyScreen({ navigate, lang }: SafetyScreenProps) {
  const safetyTips = [
    {
      title: t(lang, 'tipPinTitle'),
      desc: t(lang, 'tipPinDesc'),
      icon: KeyRound,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      title: t(lang, 'tipCallTitle'),
      desc: t(lang, 'tipCallDesc'),
      icon: PhoneOff,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: t(lang, 'tipVerifyTitle'),
      desc: t(lang, 'tipVerifyDesc'),
      icon: EyeOff,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: t(lang, 'tipReceiveTitle'),
      desc: t(lang, 'tipReceiveDesc'),
      icon: ShieldCheck,
      color: "text-green-600",
      bg: "bg-green-100",
    }
  ];

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-20">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate('home')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={28} className="text-gray-800" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 ml-4">
          {t(lang, 'safetyCenterTitle')}
        </h1>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        <div className="w-full bg-red-50 border-2 border-red-200 rounded-3xl p-6 flex flex-col items-center text-center mb-6 shadow-xs">
          <div className="w-18 h-18 bg-red-100 rounded-2xl flex items-center justify-center border-2 border-red-300 mb-3">
            <ShieldAlert size={36} className="text-red-600" />
          </div>
          <h2 className="text-xl font-black text-red-950 mb-1">
            {t(lang, 'scamWarningTitle')}
          </h2>
          <p className="text-xs font-semibold text-red-800 leading-snug">
            {t(lang, 'scamWarningDesc')}
          </p>
        </div>

        <div className="space-y-3">
          {safetyTips.map((tip, idx) => (
            <div key={idx} className="bg-white border-2 border-gray-200 rounded-3xl p-4 shadow-xs flex items-start gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${tip.bg}`}>
                <tip.icon size={24} className={tip.color} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 mb-0.5">{tip.title}</h3>
                <p className="text-gray-600 font-medium text-xs leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            sound.playKeyClick();
            window.alert('Emergency Helpline (1930) or Cyber Crime Portal report simulated.');
          }}
          className="w-full mt-6 py-4 bg-gray-900 text-white font-extrabold text-base rounded-2xl shadow-md hover:bg-gray-800 transition-colors"
        >
          {t(lang, 'reportSuspicious')}
        </button>
      </div>
    </div>
  );
}
