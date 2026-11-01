import { ArrowLeft, Check, Languages } from 'lucide-react';
import type { Screen, SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, t } from '../utils/translations';
import { sound } from '../utils/sound';

interface LanguageScreenProps {
  navigate: (screen: Screen) => void;
  currentLang: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export default function LanguageScreen({
  navigate,
  currentLang,
  onSelectLanguage,
}: LanguageScreenProps) {
  const handleSelect = (code: SupportedLanguage) => {
    sound.playKeyClick();
    onSelectLanguage(code);
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-20">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate('profile')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={28} className="text-gray-800" />
        </button>
        <div className="ml-3">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {t(currentLang, 'chooseLanguageTitle')}
          </h1>
          <p className="text-xs font-semibold text-gray-500">
            {t(currentLang, 'chooseLanguageSubtitle')}
          </p>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        {/* Banner with icon */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-5 flex items-center gap-4 shadow-sm mb-2">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 flex-shrink-0">
            <Languages size={32} />
          </div>
          <div>
            <h2 className="text-base font-bold text-blue-950">
              Regional Language Support
            </h2>
            <p className="text-xs font-medium text-blue-800 leading-snug mt-0.5">
              Available in 4 Indian languages with full translations across all payment steps.
            </p>
          </div>
        </div>

        {/* Language Options List */}
        <div className="space-y-3">
          {SUPPORTED_LANGUAGES.map((langOption) => {
            const isSelected = currentLang === langOption.code;
            return (
              <button
                key={langOption.code}
                onClick={() => handleSelect(langOption.code)}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border-3 transition-all text-left ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/90 shadow-md ring-2 ring-blue-200'
                    : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-extrabold text-gray-900">
                      {langOption.nativeName}
                    </span>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                      {langOption.name}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 mt-1">
                    {langOption.greeting} • Simple senior-friendly terminology
                  </p>
                </div>

                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isSelected && <Check size={20} strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            onClick={() => navigate('home')}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xl rounded-2xl shadow-lg transition-transform active:scale-[0.98]"
          >
            {t(currentLang, 'saveLanguage')}
          </button>
        </div>
      </div>
    </div>
  );
}
