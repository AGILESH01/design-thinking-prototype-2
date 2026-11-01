import { ArrowLeft, Search, GraduationCap, BookOpen, Smartphone, ShieldCheck, HelpCircle, PhoneCall, ChevronRight } from 'lucide-react';
import type { Screen, SupportedLanguage } from '../types';
import { t } from '../utils/translations';
import { sound } from '../utils/sound';

interface HelpScreenProps {
  navigate: (screen: Screen) => void;
  lang: SupportedLanguage;
  onStartPractice: () => void;
}

export default function HelpScreen({ navigate, lang, onStartPractice }: HelpScreenProps) {
  const topics = [
    {
      title: t(lang, 'topicPaymentGuideTitle'),
      desc: t(lang, 'topicPaymentGuideDesc'),
      icon: BookOpen,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
    },
    {
      title: t(lang, 'topicAppBasicsTitle'),
      desc: t(lang, 'topicAppBasicsDesc'),
      icon: Smartphone,
      color: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-200',
      iconBg: 'bg-green-100',
    },
    {
      title: t(lang, 'topicSecurityTitle'),
      desc: t(lang, 'topicSecurityDesc'),
      icon: ShieldCheck,
      color: 'text-yellow-700',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      iconBg: 'bg-yellow-100',
    },
    {
      title: t(lang, 'topicFaqTitle'),
      desc: t(lang, 'topicFaqDesc'),
      icon: HelpCircle,
      color: 'text-pink-700',
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      iconBg: 'bg-pink-100',
    },
    {
      title: t(lang, 'topicSupportTitle'),
      desc: t(lang, 'topicSupportDesc'),
      icon: PhoneCall,
      color: 'text-indigo-700',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      iconBg: 'bg-indigo-100',
    },
  ];

  return (
    <div className="flex flex-col min-h-full bg-white pb-20">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <button
          onClick={() => navigate('home')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={28} className="text-gray-800" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 ml-4">
          {t(lang, 'helpTitle')}
        </h1>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        {/* Search */}
        <div className="relative mb-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
          <input
            type="text"
            placeholder={t(lang, 'searchHelpPlaceholder')}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl text-base font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Learn & Practice Feature */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-3xl p-5 flex flex-col shadow-xs">
          <div className="flex items-start gap-4 mb-3">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center border-2 border-purple-300 flex-shrink-0">
              <GraduationCap size={32} className="text-purple-700" />
            </div>
            <div>
              <h2 className="text-lg font-black text-purple-950 mb-0.5">
                {t(lang, 'learnPracticeTitle')}
              </h2>
              <p className="text-xs font-semibold text-purple-800 leading-snug">
                {t(lang, 'learnPracticeDesc')}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playKeyClick();
              onStartPractice();
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-base py-3 rounded-2xl shadow-sm transition-colors cursor-pointer"
          >
            {t(lang, 'startPracticeButton')}
          </button>
        </div>

        {/* Other Help Topics */}
        <div className="space-y-3">
          {topics.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.playKeyClick();
                window.alert(`${item.title}: Senior-friendly interactive guide`);
              }}
              className={`w-full flex items-center justify-between p-4 ${item.bg} border-2 ${item.border} rounded-3xl shadow-xs hover:brightness-95 transition-all text-left`}
            >
              <div className="flex items-center gap-3.5 pr-2">
                <div className={`w-12 h-12 ${item.iconBg} rounded-2xl flex items-center justify-center border-2 ${item.border} flex-shrink-0`}>
                  <item.icon size={26} className={item.color} />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${item.color} mb-0.5`}>{item.title}</h3>
                  <p className={`${item.color} opacity-80 text-xs font-medium leading-snug`}>{item.desc}</p>
                </div>
              </div>
              <ChevronRight size={24} className={`${item.color} opacity-60 flex-shrink-0`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
