import { describe, it, expect, beforeEach } from 'vitest';
import { SafariSpeechNarrator } from '../src/speech-narrator';

describe('Safari Speech Narrator & VoiceOver Support', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('creates ARIA live regions for VoiceOver support', () => {
    new SafariSpeechNarrator();

    const polite = document.getElementById('zoodsle-live-region');
    const alert = document.getElementById('zoodsle-alert-region');

    expect(polite).not.toBeNull();
    expect(polite?.getAttribute('aria-live')).toBe('polite');
    expect(alert).not.toBeNull();
    expect(alert?.getAttribute('aria-live')).toBe('assertive');
  });

  it('updates state to analyzing when requested', () => {
    const narrator = new SafariSpeechNarrator();
    narrator.setAnalyzing();
    expect(narrator.getState()).toBe('analyzing');
  });

  it('retains last spoken description for repeat requests', async () => {
    const narrator = new SafariSpeechNarrator();
    await narrator.speak('A golden retriever sitting on grass.');
    expect(narrator.getLastSpoken()).toBe('A golden retriever sitting on grass.');
  });

  it('resets state to idle on stop', () => {
    const narrator = new SafariSpeechNarrator();
    narrator.setAnalyzing();
    expect(narrator.getState()).toBe('analyzing');
    narrator.stop();
    expect(narrator.getState()).toBe('idle');
  });
});
