import type { Transaction, SupportedLanguage } from '../types';

const API_BASE = '/api';

export interface UserProfileResponse {
  id: string;
  name: string;
  upi_id: string;
  balance: number;
  language: SupportedLanguage;
  sound_enabled: boolean;
  high_amount_threshold: number;
  max_transaction_limit: number;
  face_id_enrolled: boolean;
  biometrics_registered_count: number;
}

export async function fetchUserProfile(): Promise<UserProfileResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/user`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Backend API offline or unreachable, using local state:', err);
    return null;
  }
}

export async function verifyAndRevealBalance(
  method: 'pin' | 'face_id' | 'touch_id',
  payload?: { pin?: string; faceSignature?: string }
): Promise<{ success: boolean; balance?: number; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/user/reveal-balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method, ...payload }),
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend reveal error, using local fallback:', err);
    // Graceful offline fallback
    if (method === 'pin') {
      return payload?.pin === '1234'
        ? { success: true, balance: 2560 }
        : { success: false, error: 'Incorrect PIN. Please enter demo PIN: 1234' };
    }
    return { success: true, balance: 2560 };
  }
}

export async function enrollFaceIdBackend(
  faceSignature: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/face-id/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ faceSignature, deviceName: 'In-Device Optical Face Sensor' }),
    });
    return await res.json();
  } catch (err) {
    console.warn('Face ID enrollment backend error:', err);
    return { success: true, message: 'Enrolled in local state.' };
  }
}

export async function verifyFaceIdBackend(
  faceSignature: string
): Promise<{ success: boolean; balance?: number; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/face-id/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ faceSignature }),
    });
    return await res.json();
  } catch (err) {
    console.warn('Face ID verification backend error:', err);
    return { success: true, balance: 2560 };
  }
}

export async function fetchTransactionsBackend(filter?: string): Promise<Transaction[] | null> {
  try {
    const url = filter ? `${API_BASE}/transactions?filter=${filter}` : `${API_BASE}/transactions`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function executePaymentBackend(payment: {
  pin: string;
  amount: number;
  recipientName: string;
  upiId: string;
  category: string;
  iconName: string;
  color: string;
  bg: string;
}): Promise<{ success: boolean; remainingBalance?: number; transactionId?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/transactions/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment),
    });
    return await res.json();
  } catch {
    return { success: false, error: 'Network request failed.' };
  }
}

export async function saveUserSettingsBackend(settings: {
  language?: SupportedLanguage;
  soundEnabled?: boolean;
  highAmountThreshold?: number;
  maxTransactionLimit?: number;
}): Promise<void> {
  try {
    await fetch(`${API_BASE}/user/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
  } catch {
    // Ignore offline errors
  }
}
