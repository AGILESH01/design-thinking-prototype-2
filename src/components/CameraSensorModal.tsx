import { useState, useEffect, useRef } from 'react';
import { Camera, X, RefreshCw, Zap, ShieldCheck, AlertCircle, QrCode } from 'lucide-react';
import { startCameraSensor, stopCameraSensor, triggerHaptic } from '../utils/deviceSensors';
import { sound } from '../utils/sound';
import type { Contact } from '../types';
import { mockContacts } from '../data';

interface CameraSensorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (contact: Contact) => void;
  mode?: 'qr' | 'face';
}

export default function CameraSensorModal({
  isOpen,
  onClose,
  onScanSuccess,
  mode = 'qr',
}: CameraSensorModalProps) {
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    mode === 'face' ? 'user' : 'environment'
  );
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    async function initCamera() {
      setCameraError(null);
      try {
        const s = await startCameraSensor(facingMode);
        if (!isMounted) {
          stopCameraSensor(s);
          return;
        }
        streamRef.current = s;
        setIsCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(() => {});
        }
      } catch (err: unknown) {
        console.warn('Physical camera sensor initialization error:', err);
        const errorObj = err as Error;
        if (isMounted) {
          setCameraError(
            errorObj.name === 'NotAllowedError'
              ? 'Camera permission denied. Please allow camera access in browser settings.'
              : 'Unable to access device camera sensor. Check permissions or hardware connection.'
          );
        }
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        stopCameraSensor(streamRef.current);
        streamRef.current = null;
      }
      setIsCameraActive(false);
    };
  }, [isOpen, facingMode]);

  const handleClose = () => {
    if (streamRef.current) {
      stopCameraSensor(streamRef.current);
      streamRef.current = null;
    }
    onClose();
  };

  if (!isOpen) return null;

  const handleToggleFacingMode = () => {
    sound.playKeyClick();
    triggerHaptic(20);
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleSimulateScanMatch = (contact: Contact) => {
    sound.playPaymentSuccessChime();
    triggerHaptic([50, 50, 100]);
    if (streamRef.current) {
      stopCameraSensor(streamRef.current);
      streamRef.current = null;
    }
    onScanSuccess(contact);
  };

  return (
    <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-between z-50 p-4 animate-fade-in text-white">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between pt-2 px-2 z-10">
        <div className="flex items-center gap-2">
          <Camera size={22} className="text-green-400" />
          <span className="font-extrabold text-sm tracking-wide">
            {mode === 'face' ? 'In-Device Face Sensor' : 'In-Device Optical Camera Scanner'}
          </span>
        </div>
        <button
          onClick={() => {
            sound.playKeyClick();
            handleClose();
          }}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
          aria-label="Close Camera"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Viewfinder Area */}
      <div className="relative w-full max-w-[340px] aspect-[4/5] bg-black rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl flex items-center justify-center my-auto">
        {/* Real Live Video Feed from Hardware Sensor */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isCameraActive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Camera Sensor Fallback / Error Message */}
        {cameraError && (
          <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center bg-gray-900/95 z-20">
            <AlertCircle size={44} className="text-amber-400 mb-3" />
            <h4 className="text-base font-extrabold text-white mb-1">Camera Sensor Notice</h4>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">{cameraError}</p>
            <p className="text-[11px] text-gray-400">
              You can tap a contact below to complete the test scan:
            </p>
          </div>
        )}

        {/* Scanning Target Reticle & Laser */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
          <div className="relative w-56 h-56 border-2 border-dashed border-green-400/80 rounded-3xl flex items-center justify-center">
            {/* Animated Laser Scanning Line */}
            <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_8px_#22c55e] animate-pulse" />
            
            {/* Corner Bracket Accents */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-green-500 rounded-tl-xl" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-green-500 rounded-tr-xl" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-green-500 rounded-bl-xl" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-green-500 rounded-br-xl" />
            
            <QrCode size={40} className="text-white/30 animate-pulse" />
          </div>

          <p className="text-xs font-bold text-white/90 bg-black/60 px-3 py-1.5 rounded-full mt-4 backdrop-blur-xs flex items-center gap-1.5">
            <Zap size={14} className="text-green-400" />
            <span>Align QR code inside the green frame</span>
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full max-w-[340px] flex flex-col items-center gap-3 z-10 pb-2">
        {/* Switch Front/Back Camera */}
        <button
          type="button"
          onClick={handleToggleFacingMode}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-xs font-extrabold backdrop-blur-xs transition-colors"
        >
          <RefreshCw size={14} />
          <span>Switch Camera ({facingMode === 'environment' ? 'Rear' : 'Front Selfie'})</span>
        </button>

        {/* Quick Contact Detection Bar */}
        <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center">
          <span className="text-[11px] font-bold text-gray-300 block mb-2">
            Simulate Detected Recipient:
          </span>
          <div className="flex justify-around gap-2">
            {mockContacts.slice(0, 3).map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleSimulateScanMatch(contact)}
                className="flex-1 py-1.5 px-2 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-extrabold text-[11px] rounded-xl shadow-xs transition-all truncate"
              >
                {contact.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <ShieldCheck size={14} className="text-green-400" />
          <span>Hardware optical stream processed privately in memory</span>
        </div>
      </div>
    </div>
  );
}
