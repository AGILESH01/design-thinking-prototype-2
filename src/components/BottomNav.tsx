import { Home, IndianRupee, PieChart, Clock, HelpCircle } from 'lucide-react';
import type { Screen, SupportedLanguage } from '../types';
import { t } from '../utils/translations';
import { sound } from '../utils/sound';

interface BottomNavProps {
  current: Screen;
  navigate: (screen: Screen) => void;
  lang: SupportedLanguage;
}

export default function BottomNav({ current, navigate, lang }: BottomNavProps) {
  const items = [
    { id: 'home', labelKey: 'navHome' as const, icon: Home },
    { id: 'pay', labelKey: 'navPay' as const, icon: IndianRupee },
    { id: 'monthly', labelKey: 'navMonthly' as const, icon: PieChart },
    { id: 'history', labelKey: 'navHistory' as const, icon: Clock },
    { id: 'help', labelKey: 'navHelp' as const, icon: HelpCircle },
  ];

  return (
    <nav 
      aria-label="Main Navigation" 
      className="bg-white border-t-2 border-gray-200 flex justify-around items-center h-16 px-2 shadow-lg"
    >
      {items.map((item) => {
        const Icon = item.icon;
        // Highlight 'Pay' tab if we are on pay OR recipient screen
        const isActive = 
          current === item.id || 
          (item.id === 'pay' && current === 'recipient');

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              sound.playKeyClick();
              if (item.id === 'pay') {
                navigate('recipient');
              } else {
                navigate(item.id as Screen);
              }
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${
              isActive 
                ? 'text-blue-700 font-extrabold' 
                : 'text-gray-500 hover:text-gray-900 font-bold'
            }`}
          >
            <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-blue-50' : ''}`}>
              <Icon size={22} strokeWidth={isActive ? 2.8 : 2} />
            </div>
            <span className={`text-[10px] leading-tight text-center truncate max-w-[68px] ${
              isActive ? 'font-black text-blue-700' : 'font-semibold text-gray-500'
            }`}>
              {t(lang, item.labelKey)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
