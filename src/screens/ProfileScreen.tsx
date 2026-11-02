import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  ShieldCheck, 
  LogOut, 
  ChevronRight, 
  Building2, 
  Languages, 
  Volume2, 
  Sliders, 
  ShieldAlert, 
  Database, 
  ScanFace,
  Mic 
} from 'lucide-react';
import type { Screen, SupportedLanguage, AppConfig } from '../types';
import { t, SUPPORTED_LANGUAGES } from '../utils/translations';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/deviceSensors';
import { fetchUserProfile, saveUserSettingsBackend } from '../utils/api';
import FaceIDScanner from '../components/FaceIDScanner';

interface ProfileScreenProps {
  navigate: (screen: Screen) => void;
  lang: SupportedLanguage;
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

export default function ProfileScreen({
  navigate,
  lang,
  config,
  setConfig,
}: ProfileScreenProps) {
  const [isFaceScannerOpen, setIsFaceScannerOpen] = useState(false);
  const [faceEnrolled, setFaceEnrolled] = useState(false);
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === lang);

  useEffect(() => {
    fetchUserProfile().then(user => {
      if (user) {
        setFaceEnrolled(user.face_id_enrolled);
      }
    });
  }, []);

  const toggleSound = () => {
    const next = !config.soundEnabled;
    sound.setEnabled(next);
    triggerHaptic(20);
    setConfig(prev => ({ ...prev, soundEnabled: next }));
    saveUserSettingsBackend({ soundEnabled: next });
    if (next) sound.playKeyClick();
  };

  const toggleVoiceGuidance = () => {
    const next = !config.voiceGuidanceEnabled;
    triggerHaptic(20);
    setConfig(prev => ({ ...prev, voiceGuidanceEnabled: next }));
    if (typeof window !== 'undefined') {
      localStorage.setItem('upi_proto_voice_guidance', String(next));
    }
    if (next) sound.playKeyClick();
  };

  const handleAdjustThreshold = () => {
    sound.playKeyClick();
    triggerHaptic(20);
    const options = [2000, 3000, 4000];
    const nextIdx = (options.indexOf(config.highAmountThreshold) + 1) % options.length;
    const nextVal = options[nextIdx];
    setConfig(prev => ({ ...prev, highAmountThreshold: nextVal }));
    saveUserSettingsBackend({ highAmountThreshold: nextVal });
  };

  const handleAdjustMaxLimit = () => {
    sound.playKeyClick();
    triggerHaptic(20);
    const options = [3000, 5000, 10000];
    const nextIdx = (options.indexOf(config.maxTransactionLimit) + 1) % options.length;
    const nextVal = options[nextIdx];
    setConfig(prev => ({ ...prev, maxTransactionLimit: nextVal }));
    saveUserSettingsBackend({ maxTransactionLimit: nextVal });
  };

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
          {t(lang, 'myProfile')}
        </h1>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        {/* User Card */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 flex flex-col items-center text-center shadow-xs">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-200 mb-3 shadow-inner">
            <User size={40} className="text-blue-700" />
          </div>
          <h2 className="text-xl font-black text-gray-900">Senior User</h2>
          <p className="text-xs font-semibold text-gray-500">user@okaxis</p>
          <div className="mt-2.5 bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 border border-green-200">
            <ShieldCheck size={15} /> {t(lang, 'verifiedSenior')}
          </div>
        </div>

        {/* Backend Database Status Pill */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
              <Database size={20} />
            </div>
            <div>
              <span className="text-xs font-black text-blue-950 block">
                Backend Database Active
              </span>
              <span className="text-[11px] font-semibold text-blue-700">
                SQLite (senior_upi.sqlite) • Syncing Live
              </span>
            </div>
          </div>
          <span className="text-[11px] font-black bg-green-600 text-white px-2.5 py-1 rounded-full shadow-2xs">
            ONLINE
          </span>
        </div>

        {/* Biometrics & Hardware Sensors Management */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-4 shadow-xs space-y-3">
          <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
            Biometric Hardware & Sensors
          </h3>

          {/* Face ID Scanner Setup */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <ScanFace size={22} />
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900 block">
                  Camera Optical Face ID
                </span>
                <span className="text-[11px] font-semibold text-gray-500">
                  {faceEnrolled ? 'Enrolled in SQLite database' : 'Ready to scan face'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playKeyClick();
                triggerHaptic(20);
                setIsFaceScannerOpen(true);
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors"
            >
              {faceEnrolled ? 'Re-scan' : 'Enroll Face'}
            </button>
          </div>
        </div>

        {/* Settings Group */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-gray-700 uppercase tracking-wider px-1">
            {t(lang, 'appSettings')}
          </h3>

          {/* Language Selection Setting */}
          <button
            onClick={() => {
              sound.playKeyClick();
              triggerHaptic(20);
              navigate('language');
            }}
            className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-300 transition-colors shadow-xs text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-100 text-blue-700">
                <Languages size={22} />
              </div>
              <div>
                <span className="text-base font-bold text-gray-900 block">
                  {t(lang, 'changeLanguage')}
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  {currentLangObj?.nativeName} ({currentLangObj?.name})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-blue-600 font-bold text-xs">
              <span>Change</span>
              <ChevronRight size={18} />
            </div>
          </button>

          {/* Sound Notification Chime Setting */}
          <div className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-green-100 text-green-700">
                <Volume2 size={22} />
              </div>
              <div>
                <span className="text-base font-bold text-gray-900 block">
                  {t(lang, 'soundEffects')}
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  SoundBox audio confirmation chime
                </span>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors border ${
                config.soundEnabled
                  ? 'bg-green-600 text-white border-green-700'
                  : 'bg-gray-200 text-gray-700 border-gray-300'
              }`}
            >
              {config.soundEnabled ? 'Enabled' : 'Muted'}
            </button>
          </div>

          {/* Spoken Voice Assistant & Step Guidance Setting */}
          <div className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-indigo-100 text-indigo-700">
                <Mic size={22} />
              </div>
              <div>
                <span className="text-base font-bold text-gray-900 block">
                  {t(lang, 'autoNarrateToggle')}
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  {t(lang, 'autoNarrateDesc')}
                </span>
              </div>
            </div>
            <button
              onClick={toggleVoiceGuidance}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors border ${
                config.voiceGuidanceEnabled
                  ? 'bg-indigo-600 text-white border-indigo-700'
                  : 'bg-gray-200 text-gray-700 border-gray-300'
              }`}
            >
              {config.voiceGuidanceEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* High-Amount Threshold Configuration */}
          <div className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-amber-100 text-amber-800">
                <Sliders size={22} />
              </div>
              <div>
                <span className="text-base font-bold text-gray-900 block">
                  High-Amount Warning
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  Warns before sending amounts ≥ ₹{config.highAmountThreshold.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <button
              onClick={handleAdjustThreshold}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-extrabold text-xs rounded-xl transition-colors"
            >
              ₹{config.highAmountThreshold.toLocaleString('en-IN')}
            </button>
          </div>

          {/* Max Transaction Limit Configuration */}
          <div className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-rose-100 text-rose-800">
                <ShieldAlert size={22} />
              </div>
              <div>
                <span className="text-base font-bold text-gray-900 block">
                  Max Safety Limit
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  Blocks transactions above ₹{config.maxTransactionLimit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <button
              onClick={handleAdjustMaxLimit}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 font-extrabold text-xs rounded-xl transition-colors"
            >
              ₹{config.maxTransactionLimit.toLocaleString('en-IN')}
            </button>
          </div>

          {/* Bank Accounts */}
          <button
            onClick={() => {
              sound.playKeyClick();
              triggerHaptic(20);
              window.alert('Primary account: HDFC Bank •••• 5678 (Verified)');
            }}
            className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-gray-300 transition-colors shadow-xs text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-indigo-100 text-indigo-700">
                <Building2 size={22} />
              </div>
              <div>
                <span className="text-base font-bold text-gray-900 block">
                  {t(lang, 'bankAccounts')}
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  HDFC Bank & State Bank of India
                </span>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Log Out */}
        <button
          onClick={() => {
            sound.playKeyClick();
            triggerHaptic(30);
            window.alert('Simulated log out: Returning to secure lock state.');
          }}
          className="w-full py-4 bg-red-50 border-2 border-red-200 text-red-600 font-extrabold text-base rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          <span>{t(lang, 'logout')}</span>
        </button>
      </div>

      {/* Face ID Scanner for profile enrollment */}
      <FaceIDScanner
        isOpen={isFaceScannerOpen}
        onSuccess={() => {
          setFaceEnrolled(true);
          setIsFaceScannerOpen(false);
        }}
        onClose={() => setIsFaceScannerOpen(false)}
        onSwitchToPin={() => setIsFaceScannerOpen(false)}
      />
    </div>
  );
}
