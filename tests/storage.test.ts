import { describe, it, expect } from 'vitest';
import { SessionDescriptionCache, getSettings } from '../src/storage';

describe('Safari Storage & Session Cache', () => {
  it('loads default settings with Safari VoiceOver preferences', async () => {
    const settings = await getSettings();
    expect(settings.enabled).toBe(true);
    expect(settings.mode).toBe('ondemand');
    expect(settings.preferMacVoice).toBe(true);
    expect(settings.backendUrl).toBe('http://127.0.0.1:1234/v1');
  });

  it('manages LRU eviction in description cache', () => {
    const cache = new SessionDescriptionCache(2);
    cache.set('sig-1', 'Description 1');
    cache.set('sig-2', 'Description 2');

    expect(cache.size()).toBe(2);
    expect(cache.has('sig-1')).toBe(true);

    cache.set('sig-3', 'Description 3');
    expect(cache.size()).toBe(2);
    expect(cache.has('sig-1')).toBe(false);
    expect(cache.has('sig-2')).toBe(true);
    expect(cache.has('sig-3')).toBe(true);
  });
});
