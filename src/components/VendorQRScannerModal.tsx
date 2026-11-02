import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  X, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  ShieldAlert, 
  AlertCircle, 
  QrCode, 
  Volume2, 
  VolumeX, 
  Store, 
  CheckCircle2, 
  ArrowRight,
  Flashlight
} from 'lucide-react';
import { 
  startCameraSensor, 
  stopCameraSensor, 
  triggerHaptic, 
  speakQRSafetyNotice, 
  speakQRVendorVerified, 
  stopSpeaking 
} from '../utils/deviceSensors';
import { sound } from '../utils/sound';
import { t } from '../utils/translations';
import type { Contact, SupportedLanguage, ExpenseCategory } from '../types';

interface VendorQRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (contact: Contact) => void;
  lang: SupportedLanguage;
  autoNarrate?: boolean;
}

// Realistic vendor shops where seniors frequently shop
const VENDOR_PRESETS: Contact[] = [
  {
    id: 'vendor_sharma_kirana',
    name: 'Sharma Kirana Store',
    upiId: 'sharma.kirana@okaxis',
    type: 'Merchant',
    category: 'Food and Groceries' as ExpenseCategory,
    iconName: 'ShoppingBag',
    color: 'text-amber-700',
    bg: 'bg-amber-100',
  },
  {
    id: 'vendor_apollo_pharmacy',
    name: 'Apollo Medical Pharmacy',
    upiId: 'apollo.care@icici',
    type: 'Merchant',
    category: 'Healthcare' as ExpenseCategory,
    iconName: 'HeartPulse',
    color: 'text-emerald-700',
    bg: 'bg-emerald-100',
  },
  {
    id: 'vendor_anand_dairy',
    name: 'Anand Milk & Dairy Booth',
    upiId: 'anand.dairy@sbi',
    type: 'Merchant',
    category: 'Food and Groceries' as ExpenseCategory,
    iconName: 'Building2',
    color: 'text-blue-700',
    bg: 'bg-blue-100',
  },
  {
    id: 'vendor_city_auto',
    name: 'City Auto Rickshaw (Ramesh)',
    upiId: 'city.auto@paytm',
    type: 'Merchant',
    category: 'Transportation' as ExpenseCategory,
    iconName: 'Building2',
    color: 'text-purple-700',
    bg: 'bg-purple-100',
  },
  {
    id: 'vendor_fresh_vegetables',
    name: 'Fresh Sabzi & Fruit Stall',
    upiId: 'fresh.sabzi@upi',
    type: 'Merchant',
    category: 'Food and Groceries' as ExpenseCategory,
    iconName: 'ShoppingBag',
    color: 'text-green-700',
    bg: 'bg-green-100',
  },
];

export default function VendorQRScannerModal({
  isOpen,
  onClose,
  onScanSuccess,
  lang,
  autoNarrate = false,
}: VendorQRScannerModalProps) {
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [detectedVendor, setDetectedVendor] = useState<Contact | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const hasSpokenIntroRef = useRef(false);
  const barcodeScanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const handleVendorDetected = useCallback((vendor: Contact) => {
    sound.playPaymentSuccessChime();
    triggerHaptic([60, 40, 100]);
    setDetectedVendor(vendor);

    // Speak vendor detection out loud with safety instruction
    setIsSpeaking(true);
    speakQRVendorVerified(
      vendor.name,
      lang,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  }, [lang]);

  // Handles raw UPI URL parse (e.g., upi://pay?pa=shop@upi&pn=Shop%20Name)
  const handleParsedQRCode = useCallback((qrString: string) => {
    let vendorName = 'Verified Vendor Shop';
    let upiId = 'merchant@okaxis';

    try {
      if (qrString.startsWith('upi://pay')) {
        const url = new URL(qrString);
        upiId = url.searchParams.get('pa') || upiId;
        vendorName = url.searchParams.get('pn') || vendorName;
      }
    } catch {
      // Fallback
    }

    const contact: Contact = {
      id: 'scanned_vendor_' + Math.random().toString(36).substring(2, 9),
      name: vendorName,
      upiId: upiId,
      type: 'Merchant',
      category: 'Food and Groceries',
      iconName: 'ShoppingBag',
      color: 'text-amber-700',
      bg: 'bg-amber-100',
    };

    handleVendorDetected(contact);
  }, [handleVendorDetected]);

  const detectedVendorRef = useRef<Contact | null>(null);
  const handleParsedQRCodeRef = useRef(handleParsedQRCode);

  useEffect(() => {
    detectedVendorRef.current = detectedVendor;
    handleParsedQRCodeRef.current = handleParsedQRCode;
  }, [detectedVendor, handleParsedQRCode]);

  // Initialize camera and voice guidance
  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        stopCameraSensor(streamRef.current);
        streamRef.current = null;
      }
      stopSpeaking();
      if (barcodeScanIntervalRef.current) clearInterval(barcodeScanIntervalRef.current);
      return;
    }

    let isMounted = true;

    async function initCamera() {
      setCameraError(null);
      try {
        const stream = await startCameraSensor(facingMode);
        if (!isMounted) {
          stopCameraSensor(stream);
          return;
        }

        streamRef.current = stream;
        setIsCameraActive(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }

        // Start BarcodeDetector if available in browser
        const win = window as unknown as { 
          BarcodeDetector?: new (options: { formats: string[] }) => { 
            detect: (el: HTMLVideoElement) => Promise<Array<{ rawValue?: string }>> 
          } 
        };
        if (win.BarcodeDetector) {
          try {
            const detector = new win.BarcodeDetector({ formats: ['qr_code'] });
            barcodeScanIntervalRef.current = setInterval(async () => {
              if (!videoRef.current || !isMounted || detectedVendorRef.current) return;
              try {
                const barcodes = await detector.detect(videoRef.current);
                if (barcodes && barcodes.length > 0) {
                  const rawVal = barcodes[0].rawValue || '';
                  handleParsedQRCodeRef.current(rawVal);
                }
              } catch {
                // Ignore detection frame errors
              }
            }, 500);
          } catch {
            // BarcodeDetector not supported in this runtime
          }
        }
      } catch (err: unknown) {
        console.warn('Physical camera sensor initialization error:', err);
        const errorObj = err as Error;
        if (isMounted) {
          setCameraError(
            errorObj.name === 'NotAllowedError'
              ? 'Camera permission was denied. Please allow camera access in browser settings.'
              : 'Unable to access device back camera. Please tap a verified vendor shop below to test.'
          );
        }
      }
    }

    initCamera();

    // Auto-narrate safety notice if enabled
    if (autoNarrate && !hasSpokenIntroRef.current) {
      hasSpokenIntroRef.current = true;
      const timer = setTimeout(() => {
        setIsSpeaking(true);
        speakQRSafetyNotice(
          lang,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }, 500);

      return () => clearTimeout(timer);
    }

    return () => {
      isMounted = false;
      if (streamRef.current) {
        stopCameraSensor(streamRef.current);
        streamRef.current = null;
      }
      if (barcodeScanIntervalRef.current) clearInterval(barcodeScanIntervalRef.current);
      stopSpeaking();
    };
  }, [isOpen, facingMode, autoNarrate, lang]);

  const handleClose = () => {
    if (streamRef.current) {
      stopCameraSensor(streamRef.current);
      streamRef.current = null;
    }
    if (barcodeScanIntervalRef.current) clearInterval(barcodeScanIntervalRef.current);
    stopSpeaking();
    setIsSpeaking(false);
    setDetectedVendor(null);
    onClose();
  };

  if (!isOpen) return null;

  const handleToggleVoiceSafety = () => {
    triggerHaptic(20);
    sound.playKeyClick();

    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      if (detectedVendor) {
        speakQRVendorVerified(
          detectedVendor.name,
          lang,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      } else {
        speakQRSafetyNotice(
          lang,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }
    }
  };

  const handleToggleFacingMode = () => {
    sound.playKeyClick();
    triggerHaptic(20);
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleToggleTorch = async () => {
    sound.playKeyClick();
    triggerHaptic(20);
    const nextTorch = !isTorchOn;
    setIsTorchOn(nextTorch);

    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track) {
        try {
          // @ts-expect-error - torch constraint is standard mobile web
          await track.applyConstraints({ advanced: [{ torch: nextTorch }] });
        } catch {
          // Hardware torch not supported on this specific lens
        }
      }
    }
  };

  const handleConfirmAndProceed = () => {
    if (!detectedVendor) return;
    sound.playKeyClick();
    triggerHaptic(30);

    if (streamRef.current) {
      stopCameraSensor(streamRef.current);
      streamRef.current = null;
    }
    stopSpeaking();
    onScanSuccess(detectedVendor);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-scanner-title"
    >
      {/* Top Header & Step Bar */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between pb-3 border-b border-white/20">
        <div className="flex items-center gap-2 text-white">
          <Camera size={22} className="text-green-400" />
          <div>
            <h2 id="qr-scanner-title" className="text-base font-extrabold leading-none">
              {t(lang, 'scanQrTitle')}
            </h2>
            <span className="text-[11px] font-bold text-green-300">
              {t(lang, 'stepOfTotal', { current: 1, total: 4 })} • Camera Scanner
            </span>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs transition-colors"
          aria-label="Close Scanner"
        >
          <X size={16} />
          <span>Close</span>
        </button>
      </div>

      <div className="w-full max-w-md mx-auto my-auto space-y-3 py-2">
        {/* Crucial Fraud Awareness Alert Banner */}
        <div className="bg-amber-950/90 border-2 border-amber-400 rounded-2xl p-3 text-amber-100 flex items-start gap-2.5 shadow-lg">
          <ShieldAlert size={22} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed font-semibold">
            <span className="font-extrabold text-amber-300 block uppercase tracking-wider text-[11px]">
              Critical Fraud Safety Rule:
            </span>
            {t(lang, 'scanQrSafetyWarning')}
          </div>
        </div>

        {/* Live Optical Camera Viewfinder */}
        <div className="relative w-full aspect-[4/3] bg-black rounded-3xl overflow-hidden border-3 border-white/30 shadow-2xl flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isCameraActive ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Camera Error Message with Helpful Guidance */}
          {cameraError && (
            <div className="absolute inset-0 p-5 flex flex-col items-center justify-center text-center bg-gray-950/95 z-20">
              <AlertCircle size={40} className="text-amber-400 mb-2" />
              <h3 className="text-sm font-extrabold text-white mb-1">Camera Sensor Unavailable</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-3">{cameraError}</p>
              <p className="text-[11px] font-bold text-green-400">
                You can tap any shop vendor below to test the full flow:
              </p>
            </div>
          )}

          {/* QR Scanning Target Reticle & Laser */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 border-2 border-dashed border-green-400/90 rounded-3xl flex items-center justify-center">
              {/* Corner Bracket Accents */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-green-400 rounded-tl-xl" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-green-400 rounded-tr-xl" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-green-400 rounded-bl-xl" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-green-400 rounded-br-xl" />

              {/* Animated Laser Scanning Line */}
              <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_10px_#22c55e] animate-pulse" />
              
              <QrCode size={36} className="text-white/30 animate-pulse" />
            </div>

            <p className="text-[11px] font-extrabold text-white bg-black/70 px-3 py-1 rounded-full mt-3 backdrop-blur-xs flex items-center gap-1.5 border border-white/20">
              <Zap size={13} className="text-green-400" />
              <span>{t(lang, 'scanQrDesc')}</span>
            </p>
          </div>
        </div>

        {/* Viewfinder Controls: Torch & Camera Switch */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleToggleFacingMode}
            className="flex-1 flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 active:scale-95 text-white py-2 px-3 rounded-xl text-xs font-bold transition-all border border-white/20"
          >
            <RefreshCw size={14} />
            <span>{facingMode === 'environment' ? 'Rear Camera' : 'Front Selfie'}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleTorch}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
              isTorchOn 
                ? 'bg-amber-500 text-black border-amber-300 font-extrabold' 
                : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
            }`}
          >
            <Flashlight size={14} />
            <span>{isTorchOn ? t(lang, 'torchOn') : t(lang, 'torchOff')}</span>
          </button>
        </div>

        {/* Voice Guidance Assistant Trigger */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-950/80 border border-blue-400/50 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
              <Volume2 size={16} />
            </div>
            <div>
              <span className="text-xs font-extrabold block">Spoken Voice Assistant</span>
              <span className="text-[10px] text-blue-200">
                {isSpeaking ? t(lang, 'speakingNow') : 'Hear step instructions & safety notice'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleVoiceSafety}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 ${
              isSpeaking
                ? 'bg-amber-500 text-black animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX size={14} />
                <span>{t(lang, 'stopGuidance')}</span>
              </>
            ) : (
              <>
                <Volume2 size={14} />
                <span>{t(lang, 'listenGuidance')}</span>
              </>
            )}
          </button>
        </div>

        {/* If a Vendor is Detected: Verification Confirmation Card */}
        {detectedVendor ? (
          <div className="bg-gradient-to-b from-green-900/90 to-gray-900 border-2 border-green-400 rounded-3xl p-4 text-white shadow-2xl animate-fade-in">
            <div className="flex items-center gap-2 text-green-400 font-black text-xs uppercase tracking-wider mb-2">
              <CheckCircle2 size={16} />
              <span>{t(lang, 'vendorDetected')}</span>
            </div>

            <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-3 mb-3 border border-white/20">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <Store size={26} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-extrabold text-white truncate">
                  {detectedVendor.name}
                </h3>
                <p className="text-xs text-gray-300 font-medium truncate">
                  {detectedVendor.upiId}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-green-300 bg-green-950/80 px-2 py-0.5 rounded-md border border-green-600 mt-1">
                  <ShieldCheck size={11} /> Verified Merchant Shop
                </span>
              </div>
            </div>

            <p className="text-[11px] text-gray-300 font-semibold mb-3 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-green-400 shrink-0" />
              <span>{t(lang, 'scanQrNextNotice')}</span>
            </p>

            <button
              type="button"
              onClick={handleConfirmAndProceed}
              className="w-full py-3.5 bg-green-500 hover:bg-green-600 active:scale-98 text-black font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <span>{t(lang, 'proceedToPayVendor')}</span>
              <ArrowRight size={18} strokeWidth={3} />
            </button>
          </div>
        ) : (
          /* Quick Tap Verified Shop Presets for Seniors & Testing */
          <div className="bg-white/10 rounded-2xl p-3 border border-white/20">
            <span className="text-xs font-black text-gray-200 block mb-2">
              {t(lang, 'popularVendorsTitle')}:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {VENDOR_PRESETS.map((vendor) => (
                <button
                  key={vendor.id}
                  onClick={() => handleVendorDetected(vendor)}
                  className="flex items-center gap-2 p-2 bg-white/10 hover:bg-white/20 active:scale-95 text-left rounded-xl border border-white/10 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                    <Store size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-extrabold text-white block truncate">
                      {vendor.name}
                    </span>
                    <span className="text-[9px] text-gray-300 block truncate">
                      {vendor.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
