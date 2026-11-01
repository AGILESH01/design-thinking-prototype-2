/**
 * Real Biometric Authentication Service using the Web Authentication API (WebAuthn).
 * 
 * Invokes genuine hardware-level biometric sensors:
 * - Touch ID on macOS (Safari, Chrome, Arc, Brave)
 * - Face ID / Touch ID on iOS Safari & Chrome
 * - Windows Hello (Fingerprint / Face Recognition) on Windows
 * - Android Biometric Prompt (Fingerprint / Face Unlock) on Chrome for Android
 * 
 * Operates with strict zero-knowledge security:
 * - Never stores or accesses raw biometric imagery or templates.
 * - Relies entirely on the device's secure enclave / TPM cryptographic challenge.
 */

export interface BiometricCapability {
  hasWebAuthn: boolean;
  hasPlatformAuthenticator: boolean;
  label: string;
}

const STORAGE_KEY_CRED_ID = 'upi_proto_webauthn_credential_id';

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer as ArrayBuffer;
}

export async function checkBiometricCapability(): Promise<BiometricCapability> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    return {
      hasWebAuthn: false,
      hasPlatformAuthenticator: false,
      label: 'WebAuthn Not Supported',
    };
  }

  let hasPlatformAuthenticator = false;
  if (typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
    try {
      hasPlatformAuthenticator = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      hasPlatformAuthenticator = false;
    }
  }

  return {
    hasWebAuthn: true,
    hasPlatformAuthenticator,
    label: hasPlatformAuthenticator 
      ? 'Genuine Device Biometrics Available (Touch ID / Face ID)' 
      : 'No Hardware Sensor Detected',
  };
}

/**
 * Triggers genuine hardware Touch ID / Face ID prompt using WebAuthn.
 * On first use, it registers a device-bound credential on the Secure Enclave.
 * On subsequent uses, it requests an assertion from the Secure Enclave.
 */
export async function authenticateWithRealDeviceBiometrics(): Promise<{
  success: boolean;
  error?: string;
  isPlatformSupported: boolean;
}> {
  if (typeof window === 'undefined' || !window.navigator.credentials) {
    return {
      success: false,
      error: 'Web Authentication API is not available in this browser environment.',
      isPlatformSupported: false,
    };
  }

  const capability = await checkBiometricCapability();
  if (!capability.hasPlatformAuthenticator) {
    return {
      success: false,
      error: 'No hardware biometric sensor (Touch ID / Face ID) detected on this device. Please use your Demo PIN.',
      isPlatformSupported: false,
    };
  }

  const savedCredId = localStorage.getItem(STORAGE_KEY_CRED_ID);

  // If a credential already exists, attempt authentication assertion
  if (savedCredId) {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const rawId = base64ToBuffer(savedCredId);

      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          rpId: window.location.hostname,
          allowCredentials: [
            {
              id: rawId,
              type: 'public-key',
              transports: ['internal'],
            },
          ],
          userVerification: 'required',
          timeout: 60000,
        },
      }) as PublicKeyCredential | null;

      if (assertion) {
        return { success: true, isPlatformSupported: true };
      }
    } catch (err: unknown) {
      console.warn('Assertion failed, attempting re-registration:', err);
      // If credential invalidated or not found on device, proceed to create new credential
      localStorage.removeItem(STORAGE_KEY_CRED_ID);
    }
  }

  // Create new local device-bound platform credential using Touch ID / Face ID
  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const userId = new TextEncoder().encode('senior_upi_user_local');

    const newCredential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: 'Senior UPI App',
          id: window.location.hostname,
        },
        user: {
          id: userId,
          name: 'user@okaxis',
          displayName: 'Senior User',
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },  // ES256 (standard for Apple Touch ID / Face ID)
          { alg: -257, type: 'public-key' }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform', // Strictly triggers internal Touch ID / Face ID
          userVerification: 'required',
          residentKey: 'preferred',
        },
        timeout: 60000,
      },
    }) as PublicKeyCredential | null;

    if (newCredential) {
      const b64 = bufferToBase64(newCredential.rawId);
      localStorage.setItem(STORAGE_KEY_CRED_ID, b64);
      return { success: true, isPlatformSupported: true };
    }

    return {
      success: false,
      error: 'Biometric verification was not completed.',
      isPlatformSupported: true,
    };
  } catch (err: unknown) {
    const errorObj = err as Error;
    console.error('WebAuthn platform error:', errorObj);

    if (errorObj.name === 'NotAllowedError') {
      return {
        success: false,
        error: 'Biometric check was cancelled or timed out. Please try again.',
        isPlatformSupported: true,
      };
    }
    if (errorObj.name === 'SecurityError') {
      return {
        success: false,
        error: 'WebAuthn requires a secure origin (http://localhost or https://).',
        isPlatformSupported: true,
      };
    }

    return {
      success: false,
      error: errorObj.message || 'Biometric authentication failed.',
      isPlatformSupported: true,
    };
  }
}

export const DEMO_PIN = '1234';
