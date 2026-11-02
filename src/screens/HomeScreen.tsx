import { useState, useEffect } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  ReceiptText, 
  HelpCircle, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  User, 
  Lightbulb, 
  Building2, 
  Users, 
  ShoppingBag, 
  HeartPulse, 
  PieChart, 
  Languages, 
  Volume2, 
  VolumeX, 
  Lock,
  Mic,
  QrCode,
  ArrowRight
} from 'lucide-react';
import type { Screen, Contact, SupportedLanguage, Transaction } from '../types';
import { mockContacts } from '../data';
import { t } from '../utils/translations';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/deviceSensors';
import BiometricBalanceModal from '../components/BiometricBalanceModal';
import VendorQRScannerModal from '../components/VendorQRScannerModal';

interface HomeScreenProps {
  navigate: (screen: Screen) => void;
  balance: number;
  transactions: Transaction[];
  lang: SupportedLanguage;
  onQuickPay: (contact: Contact) => void;
  isBalanceVisible: boolean;
  setIsBalanceVisible: (visible: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  voiceGuidanceEnabled?: boolean;
  setVoiceGuidanceEnabled?: (enabled: boolean) => void;
}

export default function HomeScreen({
  navigate,
  balance,
  transactions,
  lang,
  onQuickPay,
  isBalanceVisible,
  setIsBalanceVisible,
  soundEnabled,
  setSoundEnabled,
  voiceGuidanceEnabled = true,
  setVoiceGuidanceEnabled,
}: HomeScreenProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  // Auto-hide balance timer (30 seconds viewing session for privacy protection)
  useEffect(() => {
    if (!isBalanceVisible) return;
    const timer = setTimeout(() => {
      setIsBalanceVisible(false);
    }, 30000);
    return () => clearTimeout(timer);
  }, [isBalanceVisible, setIsBalanceVisible]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return Building2;
      case 'Users': return Users;
      case 'Lightbulb': return Lightbulb;
      case 'ShoppingBag': return ShoppingBag;
      case 'HeartPulse': return HeartPulse;
      default: return User;
    }
  };

  const quickContacts = mockContacts.slice(0, 4);

  // Calculate current month's expenses for the Home widget
  const currentMonthSpent = transactions.reduce((sum, tx) => {
    const d = new Date(tx.timestamp);
    const isNov = d.getFullYear() === 2026 && d.getMonth() === 10;
    if (isNov && !tx.isReceived && tx.status === 'Completed') {
      return sum + tx.amount;
    }
    return sum;
  }, 0);

  const handleToggleBalance = () => {
    sound.playKeyClick();
    if (isBalanceVisible) {
      setIsBalanceVisible(false);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setIsBalanceVisible(true);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    sound.setEnabled(next);
    setSoundEnabled(next);
    if (next) sound.playKeyClick();
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-12">
      {/* Header Profile */}
      <div className="bg-white p-6 rounded-b-3xl shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <button
            onClick={() => navigate('profile')}
            className="flex items-center gap-3.5 text-left hover:opacity-80 transition-opacity"
          >
            <div className="w-13 h-13 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-200">
              <User size={26} className="text-blue-700" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 leading-snug">
                {t(lang, 'helloUser')}
              </h1>
              <span className="text-xs font-semibold text-gray-500">
                user@okaxis
              </span>
            </div>
          </button>

          {/* Quick Header Controls: Language, Sound & Voice Guidance */}
          <div className="flex items-center gap-2">
            {setVoiceGuidanceEnabled && (
              <button
                onClick={() => {
                  triggerHaptic(20);
                  const next = !voiceGuidanceEnabled;
                  setVoiceGuidanceEnabled(next);
                  if (next) sound.playKeyClick();
                }}
                className={`p-2.5 rounded-full border transition-all flex items-center gap-1 ${
                  voiceGuidanceEnabled
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 shadow-2xs'
                    : 'bg-gray-100 text-gray-400 border-gray-200'
                }`}
                title={voiceGuidanceEnabled ? 'Voice Guidance Active' : 'Voice Guidance Muted'}
                aria-label="Toggle Voice Guidance"
              >
                <Mic size={18} />
              </button>
            )}

            <button
              onClick={toggleSound}
              className={`p-2.5 rounded-full border transition-colors ${
                soundEnabled
                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  : 'bg-gray-100 text-gray-400 border-gray-200'
              }`}
              title={soundEnabled ? t(lang, 'soundOn') : t(lang, 'soundOff')}
              aria-label="Toggle Sound Effects"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            <button
              onClick={() => navigate('language')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full text-blue-800 text-xs font-bold transition-colors"
              title={t(lang, 'changeLanguage')}
            >
              <Languages size={16} />
              <span className="uppercase">{lang}</span>
            </button>
          </div>
        </div>

        {/* Feature 4: Protected Balance Card (Hidden by default) */}
        <div className="bg-white border-2 border-gray-200 p-5 rounded-3xl flex items-center justify-between mb-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-gray-500 font-bold text-sm tracking-wide">
                {t(lang, 'yourBalance')}
              </p>
              {!isBalanceVisible && (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  <Lock size={10} /> Private
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
                {isBalanceVisible ? `₹ ${balance.toLocaleString('en-IN')}` : t(lang, 'balanceHidden')}
              </h2>
            </div>
            
            {!isBalanceVisible ? (
              <button
                type="button"
                onClick={handleToggleBalance}
                className="mt-1 text-xs font-extrabold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>{t(lang, 'viewBalance')}</span>
              </button>
            ) : (
              <p className="mt-1 text-[11px] font-semibold text-gray-400">
                {t(lang, 'autoHideNotice')}
              </p>
            )}
          </div>

          <button
            onClick={handleToggleBalance}
            className={`p-3.5 rounded-2xl transition-all shadow-xs ${
              isBalanceVisible
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label={isBalanceVisible ? t(lang, 'hideBalance') : t(lang, 'viewBalance')}
          >
            {isBalanceVisible ? <Eye size={24} /> : <EyeOff size={24} />}
          </button>
        </div>

        {/* 4 Main Action Buttons */}
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={() => navigate('recipient')}
            className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <div className="w-[4.4rem] h-20 rounded-2xl border-3 border-green-500 bg-green-50 flex items-center justify-center hover:bg-green-100 transition-colors shadow-xs">
              <ArrowUp size={34} className="text-green-700" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-gray-800 text-base">{t(lang, 'actionPay')}</span>
          </button>

          <button
            onClick={() => navigate('receive')}
            className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <div className="w-[4.4rem] h-20 rounded-2xl border-3 border-blue-500 bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors shadow-xs">
              <ArrowDown size={34} className="text-blue-700" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-gray-800 text-base">{t(lang, 'actionReceive')}</span>
          </button>

          <button
            onClick={() => navigate('history')}
            className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <div className="w-[4.4rem] h-20 rounded-2xl border-3 border-orange-500 bg-orange-50 flex items-center justify-center hover:bg-orange-100 transition-colors shadow-xs">
              <ReceiptText size={34} className="text-orange-700" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-gray-800 text-base">{t(lang, 'actionHistory')}</span>
          </button>

          <button
            onClick={() => navigate('help')}
            className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <div className="w-[4.4rem] h-20 rounded-2xl border-3 border-purple-500 bg-purple-50 flex items-center justify-center hover:bg-purple-100 transition-colors shadow-xs">
              <HelpCircle size={34} className="text-purple-700" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-gray-800 text-base">{t(lang, 'actionHelp')}</span>
          </button>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-5">
        
        {/* Important Feature: Scan Vendor Shop QR Code with Device Camera */}
        <button
          onClick={() => {
            sound.playKeyClick();
            triggerHaptic(30);
            setIsQRScannerOpen(true);
          }}
          className="w-full text-left bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 text-white rounded-3xl p-4 shadow-md flex items-center justify-between hover:shadow-lg transition-all active:scale-[0.99] border-2 border-emerald-400/40"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 bg-white/20 backdrop-blur-xs rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-inner">
              <QrCode size={30} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-emerald-200 uppercase tracking-wider block">
                  {t(lang, 'scanShopButton')}
                </span>
                <span className="bg-emerald-950/60 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-400/40">
                  CAMERA SCAN
                </span>
              </div>
              <p className="text-base font-black text-white mt-0.5 leading-snug">
                {t(lang, 'scanQrTitle')}
              </p>
              <p className="text-xs text-emerald-100 font-semibold mt-0.5">
                {t(lang, 'scanQrDesc')}
              </p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
            <ArrowRight size={20} strokeWidth={2.5} />
          </div>
        </button>

        {/* Feature 5: Prominent Monthly Expense & Analytics Card */}
        <button
          onClick={() => navigate('monthly')}
          className="w-full text-left bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-5 shadow-md flex items-center justify-between hover:shadow-lg transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-xs rounded-2xl flex items-center justify-center text-white flex-shrink-0">
              <PieChart size={32} />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider block">
                {t(lang, 'monthlyInsightsTitle')}
              </span>
              <p className="text-2xl font-black text-white mt-0.5 tracking-tight">
                ₹ {currentMonthSpent.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-blue-100 font-semibold mt-0.5">
                November 2026 Spending • Tap to view chart & breakdown
              </p>
            </div>
          </div>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </div>
        </button>

        {/* Quick Pay */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-gray-900">{t(lang, 'quickPay')}</h3>
            <button
              onClick={() => navigate('recipient')}
              className="text-blue-600 font-bold text-sm flex items-center hover:underline"
            >
              {t(lang, 'seeAll')}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
          
          <div className="flex justify-between">
            {quickContacts.map((contact) => {
              const IconComponent = getIcon(contact.iconName);
              return (
                <button
                  key={contact.id}
                  onClick={() => onQuickPay(contact)}
                  className="flex flex-col items-center w-16 hover:opacity-80 transition-opacity active:scale-95"
                >
                  <div className={`w-13 h-13 rounded-full flex items-center justify-center mb-1.5 border-2 border-gray-200 ${contact.bg}`}>
                    <IconComponent size={22} className={contact.color} />
                  </div>
                  <span className="text-xs font-bold text-gray-900 truncate w-full text-center">
                    {contact.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full mt-1 border border-gray-200">
                    {contact.type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Safety Reminders Banner */}
        <button
          onClick={() => navigate('safety')}
          className="w-full text-left bg-white border-2 border-red-200 rounded-3xl p-4 shadow-sm flex items-center gap-4 hover:border-red-300 hover:bg-red-50/40 transition-colors active:scale-[0.99]"
        >
          <div className="w-13 h-13 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 flex-shrink-0">
            <ShieldAlert size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-red-950 mb-0.5">
              {t(lang, 'staySafeTitle')}
            </h3>
            <p className="text-xs font-medium text-gray-600 leading-tight">
              {t(lang, 'staySafeDesc')}
            </p>
          </div>
          <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>

      {/* Biometric Balance Authentication Modal */}
      <BiometricBalanceModal
        isOpen={isAuthModalOpen}
        lang={lang}
        onSuccess={handleAuthSuccess}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Vendor QR Scanner Modal with Camera Sensor, Voice Step-by-Step & Safety Awareness */}
      <VendorQRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={(vendor) => {
          setIsQRScannerOpen(false);
          onQuickPay(vendor);
        }}
        lang={lang}
        autoNarrate={voiceGuidanceEnabled}
      />
    </div>
  );
}
