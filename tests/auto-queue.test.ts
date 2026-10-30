import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AutoNarrationQueue } from '../src/auto-queue';
import { SessionDescriptionCache } from '../src/storage';
import { SafariSpeechNarrator } from '../src/speech-narrator';
import { EligibleImage } from '../src/types';

describe('Safari Auto Narration Queue', () => {
  let cache: SessionDescriptionCache;
  let narrator: SafariSpeechNarrator;

  beforeEach(() => {
    cache = new SessionDescriptionCache(10);
    narrator = new SafariSpeechNarrator();
  });

  function makeMockImage(sig: string): EligibleImage {
    const el = document.createElement('img');
    document.body.appendChild(el);
    return {
      element: el,
      src: `https://facebook.com/images/${sig}.jpg`,
      signature: sig,
      width: 400,
      height: 300,
    };
  }

  it('enqueues eligible feed image', () => {
    const onDescribe = vi.fn().mockImplementation(() => new Promise(() => {}));
    const queue = new AutoNarrationQueue(cache, narrator, onDescribe, 5);

    const img = makeMockImage('sig-safari-1');
    expect(queue.enqueue(img)).toBe(true);
    expect(queue.isBusy()).toBe(true);
  });

  it('suppresses duplicate images already cached', () => {
    cache.set('sig-safari-cached', 'Already described scene');
    const onDescribe = vi.fn().mockResolvedValue(null);
    const queue = new AutoNarrationQueue(cache, narrator, onDescribe, 5);

    const img = makeMockImage('sig-safari-cached');
    expect(queue.enqueue(img)).toBe(false);
    expect(queue.size()).toBe(0);
  });

  it('bounds queue capacity during rapid scrolling', () => {
    const onDescribe = vi.fn().mockImplementation(() => new Promise(() => {}));
    const queue = new AutoNarrationQueue(cache, narrator, onDescribe, 3);

    for (let i = 1; i <= 6; i++) {
      queue.enqueue(makeMockImage(`sig-${i}`));
    }

    expect(queue.size()).toBeLessThanOrEqual(3);
  });

  it('pauses and resumes queue cleanly', () => {
    const onDescribe = vi.fn().mockResolvedValue('Done');
    const queue = new AutoNarrationQueue(cache, narrator, onDescribe, 5);

    queue.pause();
    expect(queue.enqueue(makeMockImage('sig-paused'))).toBe(false);

    queue.resume();
    expect(queue.enqueue(makeMockImage('sig-resumed'))).toBe(true);
  });

  it('automatically resumes processing queued items when speech state transitions to idle', async () => {
    vi.spyOn(narrator, 'getState').mockReturnValue('speaking');
    const onDescribe = vi.fn().mockResolvedValue('Description');
    const queue = new AutoNarrationQueue(cache, narrator, onDescribe, 5);

    const img1 = makeMockImage('sig-waiting-safari');
    queue.enqueue(img1);

    expect(queue.size()).toBe(1);
    expect(onDescribe).not.toHaveBeenCalled();

    vi.spyOn(narrator, 'getState').mockReturnValue('idle');
    (narrator as any).setState('idle');

    await new Promise((r) => setTimeout(r, 50));
    expect(onDescribe).toHaveBeenCalledWith(img1);
  });
});
