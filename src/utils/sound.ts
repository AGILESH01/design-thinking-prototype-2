/**
 * Sound notification service using the Web Audio API.
 * 
 * Provides accessible, senior-friendly auditory feedback:
 * 1. An uplifting, resonant chime upon sending money (requested by user).
 * 2. Gentle cautionary chime for high-amount warnings.
 * 3. Tactile feedback clicks.
 * 
 * Works 100% offline, requires no external audio downloads, and respects user mute preferences.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Check saved audio preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upi_proto_sound_enabled');
      if (saved !== null) {
        this.soundEnabled = saved === 'true';
      }
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('upi_proto_sound_enabled', enabled ? 'true' : 'false');
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Plays a pleasant, recognizable payment success chime:
   * 4-note ascending major arpeggio (C5 -> E5 -> G5 -> C6) with warm sine decay.
   * Simulates the reassuring SoundBox audio confirmation that Indian senior citizens trust.
   */
  public playPaymentSuccessChime(): void {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Frequencies for C5 (523.25 Hz), E5 (659.25 Hz), G5 (783.99 Hz), C6 (1046.50 Hz)
      const notes = [523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.11);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.11);
        gain.gain.linearRampToValueAtTime(0.28, now + idx * 0.11 + 0.03);
        // Rich, long resonant decay for senior clarity
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.11 + 0.85);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.11);
        osc.stop(now + idx * 0.11 + 0.9);
      });
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  }

  /**
   * Gentle two-tone warning chime for high amounts or safety alerts.
   */
  public playWarningAlert(): void {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      [520, 440].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.16);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.16);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.16 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.16 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.16);
        osc.stop(now + idx * 0.16 + 0.4);
      });
    } catch {
      // AudioContext may be blocked before interaction
    }
  }

  /**
   * Subtle click for keypad or toggle feedback
   */
  public playKeyClick(): void {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundManager();
