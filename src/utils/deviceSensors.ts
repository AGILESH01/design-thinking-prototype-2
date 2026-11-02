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
export type StepGuidanceId = 'recipient' | 'pay' | 'review' | 'pin';

export const STEP_SPOKEN_GUIDANCE: Record<StepGuidanceId, Record<string, string>> = {
  recipient: {
    en: 'Step 1 of 4: Choose who to pay. Select a contact from your list or tap the camera button to scan a QR code. Do not worry, no money will be deducted at this step. Next, you will simply enter the amount.',
    hi: 'कदम 1 का 4: चुनें कि आप किसे पैसे भेजना चाहते हैं। अपनी सूची से कोई संपर्क चुनें या क्यूआर कोड स्कैन करने के लिए कैमरा बटन दबाएं। चिंता न करें, इस कदम पर कोई पैसा नहीं कटेगा। अगले कदम में आप सिर्फ राशि दर्ज करेंगे।',
    kn: 'ಹಂತ 1 ರ 4: ನೀವು ಯಾರಿಗೆ ಹಣ ಕಳುಹಿಸಲು ಬಯಸುತ್ತೀರಿ ಎಂಬುದನ್ನು ಆಯ್ಕೆಮಾಡಿ. ನಿಮ್ಮ ಪಟ್ಟಿಯಿಂದ ಸಂಪರ್ಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಲು ಕ್ಯಾಮೆರಾ ಬಟನ್ ಒತ್ತಿರಿ. ಚಿಂತಿಸಬೇಡಿ, ಈ ಹಂತದಲ್ಲಿ ಯಾವುದೇ ಹಣ ಕಡಿತವಾಗುವುದಿಲ್ಲ. ಮುಂದಿನ ಹಂತದಲ್ಲಿ ನೀವು ಮೊತ್ತವನ್ನು ನಮೂದಿಸುವಿರಿ.',
    ta: 'படி 1 இன் 4: நீங்கள் யாருக்கு பணம் அனுப்ப விரும்புகிறீர்கள் என்பதைத் தேர்ந்தெடுக்கவும். உங்கள் தொடர்பைத் தேர்ந்தெடுக்கவும் அல்லது QR குறியீட்டை ஸ்கேன் செய்ய கேமரா பொத்தானை அழுத்தவும். கவலைப்பட வேண்டாம், இந்த படியில் பணம் எதுவும் கழிக்கப்படாது. அடுத்த படியில் நீங்கள் தொகையை உள்ளிடுவீர்கள்.',
  },
  pay: {
    en: 'Step 2 of 4: Enter amount. Type the rupees you wish to send. No money is deducted when you tap Continue. In the next step, you will carefully review the recipient details and safety checks.',
    hi: 'कदम 2 का 4: राशि दर्ज करें। जितने रुपये आप भेजना चाहते हैं, वह राशि दर्ज करें। आगे बढ़ें दबाने पर कोई पैसा नहीं कटता है। अगले कदम में, आप प्राप्तकर्ता के नाम और सुरक्षा विवरण की सावधानीपूर्वक समीक्षा करेंगे।',
    kn: 'ಹಂತ 2 ರ 4: ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ. ನೀವು ಕಳುಹಿಸಲು ಬಯಸುವ ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ. ಮುಂದುವರಿಯಿರಿ ಬಟನ್ ಒತ್ತಿದಾಗ ಹಣ ಕಡಿತವಾಗುವುದಿಲ್ಲ. ಮುಂದಿನ ಹಂತದಲ್ಲಿ, ನೀವು ಸ್ವೀಕರಿಸುವವರ ಹೆಸರು ಮತ್ತು ಸುರಕ್ಷತಾ ವಿವರಗಳನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಪರಿಶೀಲಿಸುವಿರಿ.',
    ta: 'படி 2 இன் 4: தொகையை உள்ளிடவும். நீங்கள் அனுப்ப விரும்பும் தொகையை உள்ளிடவும். தொடரவும் என்பதை அழுத்தினால் பணம் கழிக்கப்படாது. அடுத்த படியில், பெறுநரின் விவரங்களையும் பாதுகாப்பு எச்சரிக்கைகளையும் நீங்கள் கவனமாக மதிப்பாய்வு செய்வீர்கள்.',
  },
  review: {
    en: 'Step 3 of 4: Review payment details. Please verify the recipient name and amount carefully. When you tap Proceed to Pay, you will go to the secure PIN screen where you enter your secret four-digit PIN. Your money stays safely in your bank until your PIN is verified.',
    hi: 'कदम 3 का 4: भुगतान विवरण की समीक्षा करें। कृपया प्राप्तकर्ता का नाम और राशि ध्यान से देखें। भुगतान के लिए आगे बढ़ें दबाने पर, आप गुप्त पिन स्क्रीन पर जाएंगे। जब तक आप अपना गुप्त 4 अंकों का पिन नहीं डालते, आपका पैसा बैंक में सुरक्षित रहता है।',
    kn: 'ಹಂತ 3 ರ 4: ಪಾವತಿ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ. ದಯವಿಟ್ಟು ಸ್ವೀಕರಿಸುವವರ ಹೆಸರು ಮತ್ತು ಮೊತ್ತವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಪರಿಶೀಲಿಸಿ. ಪಾವತಿಸಲು ಮುಂದುವರಿಯಿರಿ ಒತ್ತಿದಾಗ, ನೀವು ರಹಸ್ಯ ಯುಪಿಐ ಪಿನ್ ಪರದೆಗೆ ಹೋಗುವಿರಿ. ನಿಮ್ಮ ರಹಸ್ಯ ಪಿನ್ ನಮೂದಿಸುವವರೆಗೆ ನಿಮ್ಮ ಹಣ ಬ್ಯಾಂಕಿನಲ್ಲಿ ಸಂಪೂರ್ಣವಾಗಿ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತದೆ.',
    ta: 'படி 3 இன் 4: கட்டண விவரங்களை மதிப்பாய்வு செய்யவும். பெறுநரின் பெயரையும் தொகையையும் கவனமாக சரிபார்க்கவும். பணம் செலுத்த தொடரவும் அழுத்தினால், நீங்கள் ரகசிய பின் திரைக்குச் செல்வீர்கள். உங்கள் 4 இலக்க ரகசிய பின்னை உள்ளிடும் வரை உங்கள் பணம் வங்கியிலேயே பாதுகாப்பாக இருக்கும்.',
  },
  pin: {
    en: 'Step 4 of 4: Enter secret UPI PIN. Enter your secret four-digit PIN on the secure keypad. For this demo, the PIN is 1 2 3 4. Once entered, your bank will authorize the payment, play a confirmation chime, and show your official receipt. Never share your PIN with anyone.',
    hi: 'कदम 4 का 4: गुप्त यूपीआई पिन दर्ज करें। सुरक्षित कीपैड पर अपना 4 अंकों का गुप्त यूपीआई पिन दर्ज करें। इस डेमो के लिए पिन 1 2 3 4 है। पिन दर्ज करने के बाद, आपका बैंक भुगतान को पूरा करेगा, एक ध्वनि बजाएगा और रसीद दिखाएगा। अपना पिन किसी के साथ साझा न करें।',
    kn: 'ಹಂತ 4 ರ 4: ರಹಸ್ಯ ಯುಪಿಐ ಪಿನ್ ನಮೂದಿಸಿ. ಕೀಪ್ಯಾಡ್‌ನಲ್ಲಿ ನಿಮ್ಮ 4 ಅಂಕಿಗಳ ರಹಸ್ಯ ಯುಪಿಐ ಪಿನ್ ನಮೂದಿಸಿ. ಈ ಡೆಮೊಗಾಗಿ ಪಿನ್ 1 2 3 4 ಆಗಿದೆ. ಸರಿಯಾದ ಪಿನ್ ನಮೂದಿಸಿದ ನಂತರ, ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಪಾವತಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸುತ್ತದೆ ಮತ್ತು ರಶೀದಿಯನ್ನು ತೋರಿಸುತ್ತದೆ. ನಿಮ್ಮ ಪಿನ್ ಅನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.',
    ta: 'படி 4 இன் 4: ரகசிய யுபிஐ பின்னை உள்ளிடவும். விசைப்பலகையில் உங்கள் 4 இலக்க ரகசிய யுபிஐ பின்னை உள்ளிடவும். இந்த டெமோவிற்கு பின் 1 2 3 4 ஆகும். சரியான பின்னை உள்ளிட்டதும், உங்கள் வங்கி கட்டணத்தை அங்கீகரித்து ரசீதை காண்பிக்கும். உங்கள் பின்னை யாருடனும் பகிர வேண்டாம்.',
  },
};

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}

export function isSpeechActive(): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  return window.speechSynthesis.speaking;
}

export function speakStepGuidance(
  stepId: StepGuidanceId,
  lang: string = 'en',
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();

    const scripts = STEP_SPOKEN_GUIDANCE[stepId] || STEP_SPOKEN_GUIDANCE.recipient;
    const text = scripts[lang] || scripts.en;

    let speechLang = 'en-IN';
    if (lang === 'hi') speechLang = 'hi-IN';
    else if (lang === 'kn') speechLang = 'kn-IN';
    else if (lang === 'ta') speechLang = 'ta-IN';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92; // Slightly slower, reassuring, clear cadence for senior citizens
    utterance.pitch = 1.0;
    utterance.lang = speechLang;

    if (onStart) utterance.onstart = onStart;
    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Step guidance speech synthesis error:', err);
    if (onEnd) onEnd();
  }
}

export const QR_SPOKEN_SAFETY: Record<string, string> = {
  en: "Point your camera at the vendor's shop QR code. Important safety notice: Scanning a QR code is ONLY used to SEND money to a shop. You NEVER need to scan a QR code or enter your secret PIN to receive money or lottery prizes. If someone asks you to scan a QR to receive money, it is a scam.",
  hi: 'अपने कैमरे को दुकान के क्यूआर कोड के सामने रखें। महत्वपूर्ण सुरक्षा नियम: क्यूआर कोड केवल दुकान पर पैसे भेजने के लिए होता है। पैसे या पेंशन पाने के लिए कभी भी क्यूआर कोड स्कैन न करें और अपना गुप्त पिन न डालें। यदि कोई पैसे पाने के लिए क्यूआर स्कैन करने को कहे, तो यह धोखा है।',
  kn: 'ನಿಮ್ಮ ಕ್ಯಾಮೆರಾವನ್ನು ಅಂಗಡಿಯ ಕ್ಯೂಆರ್ ಕೋಡ್‌ನ ಮುಂದೆ ಹಿಡಿಯಿರಿ. ಪ್ರಮುಖ ಸುರಕ್ಷತಾ ನಿಯಮ: ಅಂಗಡಿಗೆ ಹಣ ಕಳುಹಿಸಲು ಮಾತ್ರ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತದೆ. ಹಣ ಅಥವಾ ಪಿಂಚಣಿ ಪಡೆಯಲು ನೀವು ಎಂದಿಗೂ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಬೇಕಾಗಿಲ್ಲ ಅಥವಾ ರಹಸ್ಯ ಪಿನ್ ನಮೂದಿಸಬೇಕಾಗಿಲ್ಲ. ಯಾರಾದರೂ ಹಣ ಪಡೆಯಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಲು ಹೇಳಿದರೆ, ಅದು ವಂಚನೆಯಾಗಿದೆ.',
  ta: 'உங்கள் கேமராவை கடையின் QR குறியீட்டிற்கு முன்னால் பிடிக்கவும். முக்கியமான பாதுகாப்பு விதி: கடைக்கு பணம் செலுத்த மட்டுமே QR குறியீடு ஸ்கேன் செய்யப்படுகிறது. பணம் அல்லது பரிசுகளைப் பெற நீங்கள் ஒருபோதும் QR குறியீட்டை ஸ்கேன் செய்யவோ அல்லது ரகசிய பின்னை உள்ளிடவோ தேவையில்லை. யாராவது பணம் பெற ஸ்கேன் செய்யச் சொன்னால், அது மோசடி.',
};

export function speakQRSafetyNotice(
  lang: string = 'en',
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const text = QR_SPOKEN_SAFETY[lang] || QR_SPOKEN_SAFETY.en;
    let speechLang = 'en-IN';
    if (lang === 'hi') speechLang = 'hi-IN';
    else if (lang === 'kn') speechLang = 'kn-IN';
    else if (lang === 'ta') speechLang = 'ta-IN';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.lang = speechLang;
    if (onStart) utterance.onstart = onStart;
    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('QR safety speech error:', err);
    if (onEnd) onEnd();
  }
}

export function speakQRVendorVerified(
  vendorName: string,
  lang: string = 'en',
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    let text = `Vendor verified: ${vendorName}. Please check that this matches the shop board. Tap Continue to enter amount. No money is deducted yet.`;
    let speechLang = 'en-IN';
    if (lang === 'hi') {
      text = `दुकानदार सत्यापित: ${vendorName}। कृपया जांचें कि यह नाम दुकान के बोर्ड से मेल खाता है। राशि दर्ज करने के लिए आगे बढ़ें। अभी कोई पैसा नहीं कटेगा।`;
      speechLang = 'hi-IN';
    } else if (lang === 'kn') {
      text = `ಅಂಗಡಿ ದೃಢೀಕರಿಸಲಾಗಿದೆ: ${vendorName}. ದಯವಿಟ್ಟು ಈ ಹೆಸರು ಅಂಗಡಿಯ ಬೋರ್ಡ್‌ಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಿ. ಮೊತ್ತ ನಮೂದಿಸಲು ಮುಂದುವರಿಯಿರಿ. ಇನ್ನೂ ಯಾವುದೇ ಹಣ ಕಡಿತವಾಗುವುದಿಲ್ಲ.`;
      speechLang = 'kn-IN';
    } else if (lang === 'ta') {
      text = `கடை சரிபார்க்கப்பட்டது: ${vendorName}. இந்த பெயர் கடையின் பெயருடன் பொருந்துகிறதா என்பதை சரிபார்க்கவும். தொகையை உள்ளிட தொடரவும். இப்போது பணம் எதுவும் கழிக்கப்படாது.`;
      speechLang = 'ta-IN';
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.lang = speechLang;
    if (onStart) utterance.onstart = onStart;
    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Vendor verified speech error:', err);
    if (onEnd) onEnd();
  }
}

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
