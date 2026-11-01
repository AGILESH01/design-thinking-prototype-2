import { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  Lock, 
  ShieldCheck, 
  AlertCircle, 
  X, 
  KeyRound, 
  CheckCircle2, 
  Loader2, 
  ScanFace 
} from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { t } from '../utils/translations';
import { 
  checkBiometricCapability, 
  authenticateWithRealDeviceBiometrics, 
  type BiometricCapability 
} from '../utils/biometrics';
import { verifyAndRevealBalance } from '../utils/api';
import { DEMO_PIN } from '../utils/formatters';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/deviceSensors';
import FaceIDScanner from './FaceIDScanner';

interface BiometricBalanceModalProps {
  isOpen: boolean;
  lang: SupportedLanguage;
  onSuccess: (revealedBalance?: number) => void;
  onClose: () => void;
}

export default function BiometricBalanceModal({
  isOpen,
  lang,
  onSuccess,
  onClose,
}: BiometricBalanceModalProps) {
  const [capability, setCapability] = useState<BiometricCapability>({
    hasWebAuthn: false,
    hasPlatformAuthenticator: false,
    label: 'Checking hardware sensor...',
  });
  const [authMode, setAuthMode] = useState<'face' | 'touch' | 'pin' | 'demo'>('face');
  const [pinInput, setPinInput] = useState('');
  const [isVerifyingReal, setIsVerifyingReal] = useState(false);
  const [isScanningDemo, setIsScanningDemo] = useState(false);
  const [isFaceScannerOpen, setIsFaceScannerOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    checkBiometricCapability().then(cap => {
      setCapability(cap);
      // If hardware fingerprint sensor is absent, automatically default to Real Face ID!
      if (!cap.hasPlatformAuthenticator) {
        setAuthMode('face');
      } else {
        setAuthMode('touch');
      }
    });
  }, []);

  const handleClose = () => {
    setPinInput('');
    setErrorMessage(null);
    setIsVerifyingReal(false);
    setIsScanningDemo(false);
    setIsFaceScannerOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  // Real Hardware Biometric Trigger (Touch ID / WebAuthn)
  const handleRealBiometricAuth = async () => {
    setIsVerifyingReal(true);
    setErrorMessage(null);
    sound.playKeyClick();
    triggerHaptic(25);

    try {
      const result = await authenticateWithRealDeviceBiometrics();
      setIsVerifyingReal(false);

      if (result.success) {
        sound.playPaymentSuccessChime();
        triggerHaptic([60, 40, 100]);
        const res = await verifyAndRevealBalance('touch_id');
        onSuccess(res.balance);
      } else {
        sound.playWarningAlert();
        triggerHaptic([100, 50, 100]);
        setErrorMessage(result.error || 'Fingerprint sensor was not detected. Please use Face ID below.');
        // Automatically suggest Face ID
        setAuthMode('face');
      }
    } catch (err: unknown) {
      setIsVerifyingReal(false);
      sound.playWarningAlert();
      setErrorMessage((err as Error).message || 'Biometric authentication error. Try Face ID.');
      setAuthMode('face');
    }
  };

  // Real Hardware Face ID Trigger (Opens Front Optical Sensor Viewfinder)
  const handleOpenFaceID = () => {
    sound.playKeyClick();
    triggerHaptic(30);
    setErrorMessage(null);
    setIsFaceScannerOpen(true);
  };

  // Demo simulation mode
  const handleSimulatedScan = (forceFail: boolean = false) => {
    setIsScanningDemo(true);
    setErrorMessage(null);
    sound.playKeyClick();
    triggerHaptic(20);

    setTimeout(async () => {
      setIsScanningDemo(false);
      if (forceFail) {
        setErrorMessage(t(lang, 'biometricFailed'));
        sound.playWarningAlert();
        triggerHaptic([100, 50, 100]);
      } else {
        sound.playKeyClick();
        triggerHaptic([60, 40, 100]);
        const res = await verifyAndRevealBalance('pin', { pin: '1234' });
        onSuccess(res.balance);
      }
    }, 600);
  };

  // PIN submission verified via SQLite database
  const handlePinSubmit = async () => {
    sound.playKeyClick();
    triggerHaptic(20);
    const res = await verifyAndRevealBalance('pin', { pin: pinInput.trim() });

    if (res.success) {
      setErrorMessage(null);
      sound.playPaymentSuccessChime();
      triggerHaptic([60, 40, 100]);
      onSuccess(res.balance);
    } else {
      setErrorMessage(res.error || t(lang, 'errorIncorrectPin'));
      sound.playWarningAlert();
      triggerHaptic([100, 50, 100]);
    }
  };

  return (
    <>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="w-full max-w-[370px] bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-6 flex flex-col items-center relative">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={t(lang, 'cancel')}
          >
            <X size={22} />
          </button>

          {/* Lock Icon */}
          <div className="w-16 h-16 bg-blue-50 border-2 border-blue-200 rounded-3xl flex items-center justify-center text-blue-700 mb-3 shadow-inner">
            <Lock size={32} />
          </div>

          <h3 className="text-xl font-extrabold text-gray-900 text-center leading-snug">
            {t(lang, 'authenticateToView')}
          </h3>
          <p className="text-xs font-semibold text-gray-500 text-center mt-1 mb-3 leading-normal">
            {t(lang, 'balanceProtectedDesc')}
          </p>

          {/* Hardware Sensor Status Pill */}
          <div className="w-full p-2.5 rounded-2xl mb-4 text-center border flex items-center justify-center gap-2 bg-blue-50 border-blue-200 text-blue-900">
            {capability.hasPlatformAuthenticator ? (
              <>
                <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                <span className="text-xs font-extrabold">
                  Device Fingerprint (Touch ID) & Face ID Supported
                </span>
              </>
            ) : (
              <>
                <ScanFace size={16} className="text-blue-600 flex-shrink-0" />
                <span className="text-xs font-extrabold">
                  No Fingerprint sensor found. Use Face ID camera below!
                </span>
              </>
            )}
          </div>

          {/* Error notification if failed */}
          {errorMessage && (
            <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-3 mb-3 flex items-start gap-2 text-red-800 text-xs font-bold">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <span className="flex-1 leading-snug">{errorMessage}</span>
            </div>
          )}

          {/* Navigation Tabs (Face ID, Fingerprint, PIN, Simulator) */}
          <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-2xl w-full mb-4">
            <button
              type="button"
              onClick={() => { setAuthMode('face'); setErrorMessage(null); }}
              className={`py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1 ${
                authMode === 'face' ? 'bg-white text-blue-700 shadow-xs ring-1 ring-blue-200' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ScanFace size={15} />
              <span>Face ID</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthMode('touch'); setErrorMessage(null); }}
              className={`py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1 ${
                authMode === 'touch' ? 'bg-white text-blue-700 shadow-xs ring-1 ring-blue-200' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Fingerprint size={15} />
              <span>Touch ID</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthMode('pin'); setErrorMessage(null); }}
              className={`py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1 ${
                authMode === 'pin' ? 'bg-white text-blue-700 shadow-xs ring-1 ring-blue-200' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <KeyRound size={15} />
              <span>PIN</span>
            </button>
          </div>

          {/* TAB 1: Face ID (Optical Camera Sensor) */}
          {authMode === 'face' && (
            <div className="w-full flex flex-col items-center">
              <p className="text-xs text-gray-600 text-center font-medium mb-3">
                Uses your device's <strong>front-facing camera</strong> to scan your face and verify against the SQLite database.
              </p>

              <button
                type="button"
                onClick={handleOpenFaceID}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-base shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <ScanFace size={24} />
                <span>Open Face ID Camera Sensor</span>
              </button>
            </div>
          )}

          {/* TAB 2: Hardware Fingerprint / Touch ID */}
          {authMode === 'touch' && (
            <div className="w-full flex flex-col items-center">
              <p className="text-xs text-gray-600 text-center font-medium mb-3">
                Prompt your device's built-in <strong>Touch ID / Fingerprint</strong> sensor via WebAuthn.
              </p>

              <button
                type="button"
                onClick={handleRealBiometricAuth}
                disabled={isVerifyingReal}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-base shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                {isVerifyingReal ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    <span>Waiting for Touch ID sensor...</span>
                  </>
                ) : (
                  <>
                    <Fingerprint size={24} />
                    <span>Verify with Touch ID Sensor</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 3: Demo PIN Fallback */}
          {authMode === 'pin' && (
            <div className="w-full flex flex-col items-center">
              <label className="text-xs font-bold text-gray-700 mb-2">
                Enter 4-Digit PIN ({DEMO_PIN})
              </label>
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.replace(/\D/g, ''));
                  setErrorMessage(null);
                }}
                placeholder="••••"
                className="w-36 text-center tracking-widest text-3xl font-extrabold py-2 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:bg-white"
              />

              <div className="flex gap-2 w-full mt-4">
                <button
                  type="button"
                  onClick={() => setPinInput(DEMO_PIN)}
                  className="flex-1 py-2.5 bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 rounded-xl text-xs font-bold transition-colors"
                >
                  Fill 1234
                </button>
                <button
                  type="button"
                  onClick={handlePinSubmit}
                  disabled={pinInput.length !== 4}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Verify PIN
                </button>
              </div>
            </div>
          )}

          {/* Simulator Quick Testing Options */}
          <div className="mt-4 pt-3 border-t border-gray-100 w-full flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400">Quick Test:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSimulatedScan(false)}
                disabled={isScanningDemo}
                className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-[11px] font-bold hover:bg-green-100 transition-colors"
              >
                Pass
              </button>
              <button
                type="button"
                onClick={() => handleSimulatedScan(true)}
                disabled={isScanningDemo}
                className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-[11px] font-bold hover:bg-red-100 transition-colors"
              >
                Fail
              </button>
            </div>
          </div>

          <div className="mt-4 w-full flex items-center justify-center gap-1.5 text-gray-500 text-[11px] font-semibold">
            <ShieldCheck size={14} className="text-green-600" />
            <span>{t(lang, 'autoHideNotice')}</span>
          </div>
        </div>
      </div>

      {/* Real Optical Face ID Viewfinder Modal */}
      <FaceIDScanner
        isOpen={isFaceScannerOpen}
        onSuccess={(revealedBalance) => {
          setIsFaceScannerOpen(false);
          handleClose();
          onSuccess(revealedBalance);
        }}
        onClose={() => setIsFaceScannerOpen(false)}
        onSwitchToPin={() => {
          setIsFaceScannerOpen(false);
          setAuthMode('pin');
        }}
      />
    </>
  );
}
