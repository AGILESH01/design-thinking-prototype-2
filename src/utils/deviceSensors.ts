/**
 * Hardware Device Sensors Manager
 * 
 * Directly accesses real physical hardware sensors on mobile & desktop devices:
 * 1. Physical Biometric Sensor (Touch ID / Face ID / Windows Hello) via WebAuthn
 * 2. Optical Camera Sensor (Front Face & Rear Camera) via getUserMedia
 * 3. Haptic Tactile Vibration Sensor via navigator.vibrate
 * 4. Acoustic Voice Sensor (Text-to-Speech Soundbox) via SpeechSynthesis
 * 5. Accelerometer / Motion Sensor via DeviceOrientation
 */

export interface DeviceSensorSupport {
  hasCamera: boolean;
  hasVibration: boolean;
  hasSpeech: boolean;
  hasMotion: boolean;
}

export function detectDeviceSensors(): DeviceSensorSupport {
  if (typeof window === 'undefined') {
    return { hasCamera: false, hasVibration: false, hasSpeech: false, hasMotion: false };
  }

  return {
    hasCamera: Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    hasVibration: Boolean('vibrate' in navigator),
    hasSpeech: Boolean('speechSynthesis' in window),
    hasMotion: Boolean('DeviceOrientationEvent' in window),
  };
}

/**
 * Physical Haptic Vibration Sensor
 */
export function triggerHaptic(pattern: number | number[] = 25): void {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore if device permissions restrict vibration
    }
  }
}

/**
 * Optical Camera Sensor Stream
 */
export async function startCameraSensor(
  facingMode: 'user' | 'environment' = 'environment'
): Promise<MediaStream> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Camera sensor is not supported on this browser or platform.');
  }

  return await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: { ideal: facingMode },
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  });
}

export function stopCameraSensor(stream: MediaStream | null): void {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
}

/**
 * Acoustic Soundbox Voice Announcement (Speech Synthesis Sensor)
 */
export function speakPaymentSuccess(amount: number, recipientName: string, lang: string = 'en'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech

    let message = `Payment of ${amount} rupees to ${recipientName} successful.`;
    let speechLang = 'en-IN';

    if (lang === 'hi') {
      message = `${recipientName} को ${amount} रुपये का भुगतान सफल रहा।`;
      speechLang = 'hi-IN';
    } else if (lang === 'kn') {
      message = `${recipientName} ಅವರಿಗೆ ${amount} ರೂಪಾಯಿ ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ.`;
      speechLang = 'kn-IN';
    } else if (lang === 'ta') {
      message = `${recipientName} என்பவருக்கு ${amount} ரூபாய் பணம் வெற்றிகரமாக செலுத்தப்பட்டது.`;
      speechLang = 'ta-IN';
    }

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.95; // Slightly slower, clear cadence for senior citizens
    utterance.pitch = 1.0;
    utterance.lang = speechLang;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis unavailable:', err);
  }
}
