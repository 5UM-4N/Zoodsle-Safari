import { SpeechState } from './types';

export class SafariSpeechNarrator {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private lastSpokenText: string = '';
  private state: SpeechState = 'idle';
  private liveRegion: HTMLElement | null = null;
  private alertRegion: HTMLElement | null = null;
  private stateChangeListeners: Array<(state: SpeechState) => void> = [];
  private availableVoices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof document !== 'undefined') {
      this.setupLiveRegions();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
    }
  }

  private setupLiveRegions(): void {
    if (typeof document === 'undefined') return;

    if (!document.getElementById('zoodsle-live-region')) {
      const live = document.createElement('div');
      live.id = 'zoodsle-live-region';
      live.setAttribute('aria-live', 'polite');
      live.setAttribute('aria-atomic', 'true');
      live.setAttribute('data-zoodsle-ui', 'true');
      live.className = 'zoodsle-sr-only';
      document.body.appendChild(live);
      this.liveRegion = live;
    } else {
      this.liveRegion = document.getElementById('zoodsle-live-region');
    }

    if (!document.getElementById('zoodsle-alert-region')) {
      const alert = document.createElement('div');
      alert.id = 'zoodsle-alert-region';
      alert.setAttribute('aria-live', 'assertive');
      alert.setAttribute('aria-atomic', 'true');
      alert.setAttribute('data-zoodsle-ui', 'true');
      alert.className = 'zoodsle-sr-only';
      document.body.appendChild(alert);
      this.alertRegion = alert;
    } else {
      this.alertRegion = document.getElementById('zoodsle-alert-region');
    }
  }

  private initVoices(): void {
    if (!this.synth) return;

    const loadVoices = () => {
      this.availableVoices = this.synth?.getVoices() || [];
      // Prefer high-quality macOS voices (e.g. Samantha, Daniel, Karen, Siri)
      const macVoice = this.availableVoices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Samantha') ||
            v.name.includes('Daniel') ||
            v.name.includes('Karen') ||
            v.name.includes('Premium') ||
            v.name.includes('Enhanced'))
      );
      if (macVoice) {
        this.selectedVoice = macVoice;
      }
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  onStateChange(listener: (state: SpeechState) => void): () => void {
    this.stateChangeListeners.push(listener);
    return () => {
      this.stateChangeListeners = this.stateChangeListeners.filter((l) => l !== listener);
    };
  }

  private setState(newState: SpeechState): void {
    this.state = newState;
    this.stateChangeListeners.forEach((l) => l(newState));
  }

  getState(): SpeechState {
    return this.state;
  }

  announcePolite(text: string): void {
    if (this.liveRegion) {
      this.liveRegion.textContent = '';
      setTimeout(() => {
        if (this.liveRegion) this.liveRegion.textContent = text;
      }, 50);
    }
  }

  announceAlert(text: string): void {
    if (this.alertRegion) {
      this.alertRegion.textContent = '';
      setTimeout(() => {
        if (this.alertRegion) this.alertRegion.textContent = text;
      }, 50);
    }
  }

  setAnalyzing(): void {
    this.setState('analyzing');
    this.announcePolite('Analyzing image with local vision AI...');
  }

  speak(text: string, rate = 1.0, volume = 1.0, preferMacVoice = true): Promise<void> {
    return new Promise((resolve) => {
      this.lastSpokenText = text;

      if (!this.synth) {
        this.announcePolite(text);
        this.setState('idle');
        resolve();
        return;
      }

      // Cancel ongoing utterance
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.max(0.5, Math.min(2.5, rate));
      utterance.volume = Math.max(0, Math.min(1.0, volume));

      if (preferMacVoice && this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      // Safari Garbage-Collection Fix: Retain reference globally until speech ends
      if (typeof window !== 'undefined') {
        (window as any).__zoodsleActiveSafariUtterance = utterance;
      }

      utterance.onstart = () => {
        this.setState('speaking');
        this.announcePolite(text);
      };

      const cleanup = () => {
        this.setState('idle');
        this.currentUtterance = null;
        if (typeof window !== 'undefined') {
          delete (window as any).__zoodsleActiveSafariUtterance;
        }
        resolve();
      };

      utterance.onend = cleanup;
      utterance.onerror = (e) => {
        console.warn('[ZoodSle Safari] Speech synthesis error:', e);
        cleanup();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  pause(): void {
    if (this.synth && this.state === 'speaking') {
      this.synth.pause();
      this.setState('paused');
    }
  }

  resume(): void {
    if (this.synth && this.state === 'paused') {
      this.synth.resume();
      this.setState('speaking');
    }
  }

  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
    if (typeof window !== 'undefined') {
      delete (window as any).__zoodsleActiveSafariUtterance;
    }
    this.setState('idle');
  }

  repeatLast(rate = 1.0, volume = 1.0, preferMacVoice = true): Promise<void> {
    if (this.lastSpokenText) {
      return this.speak(this.lastSpokenText, rate, volume, preferMacVoice);
    }
    this.announceAlert('No previous image description to repeat.');
    return Promise.resolve();
  }

  getLastSpoken(): string {
    return this.lastSpokenText;
  }
}
