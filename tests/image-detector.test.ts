import { describe, it, expect, beforeEach } from 'vitest';
import {
  isEligibleWebImage,
  isEligibleFeedImage,
  getImageSignature,
  findEligibleWebImages,
  getPrimaryFocusedWebImage,
} from '../src/image-detector';

describe('Safari Universal Image Detector Logic', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('rejects images smaller than 180x180 threshold', () => {
    const img = document.createElement('img');
    img.src = 'https://example.com/icon.jpg';
    img.getBoundingClientRect = () => ({
      width: 72,
      height: 72,
      top: 100,
      bottom: 172,
      left: 0,
      right: 72,
      x: 0,
      y: 100,
      toJSON: () => {},
    });

    expect(isEligibleWebImage(img, 180)).toBe(false);
  });

  it('filters out profile picture avatars across websites', () => {
    const img1 = document.createElement('img');
    img1.src = 'https://example.com/avatar.jpg';
    img1.alt = "Bob's profile picture";
    img1.getBoundingClientRect = () => ({
      width: 250,
      height: 250,
      top: 100,
      bottom: 350,
      left: 0,
      right: 250,
      x: 0,
      y: 100,
      toJSON: () => {},
    });
    expect(isEligibleWebImage(img1, 180)).toBe(false);

    const img2 = document.createElement('img');
    img2.src = 'https://example.com/pfp.jpg';
    img2.className = 'user-avatar round-avatar';
    img2.getBoundingClientRect = () => ({
      width: 140,
      height: 140,
      top: 100,
      bottom: 240,
      left: 0,
      right: 140,
      x: 0,
      y: 100,
      toJSON: () => {},
    });
    expect(isEligibleWebImage(img2, 100)).toBe(false);
  });

  it('accepts web photographs on articles, e-commerce, and social feeds', () => {
    const img = document.createElement('img');
    img.src = 'https://images.unsplash.com/photo-123456?auto=format&w=800';
    img.alt = 'Group of friends hiking in Yosemite';
    document.body.appendChild(img);

    img.getBoundingClientRect = () => ({
      width: 600,
      height: 450,
      top: 120,
      bottom: 570,
      left: 20,
      right: 620,
      x: 20,
      y: 120,
      toJSON: () => {},
    });

    expect(isEligibleWebImage(img, 180)).toBe(true);
    expect(isEligibleFeedImage(img, 180)).toBe(true);
  });

  it('normalizes image signatures removing volatile tracking tokens', () => {
    const img = document.createElement('img');
    img.src = 'https://cdn.example.com/vacation.jpg?utm_source=safari&ref=newsletter&filter=nature';
    const sig = getImageSignature(img);
    expect(sig).toBe('https://cdn.example.com/vacation.jpg?filter=nature');
  });

  it('identifies focused photo across web pages', () => {
    const img = document.createElement('img');
    img.src = 'https://cdn.example.com/focal.jpg';
    img.tabIndex = 0;
    img.getBoundingClientRect = () => ({
      width: 400,
      height: 300,
      top: 200,
      bottom: 500,
      left: 0,
      right: 400,
      x: 0,
      y: 200,
      toJSON: () => {},
    });

    document.body.appendChild(img);
    img.focus();

    const result = getPrimaryFocusedWebImage(180);
    expect(result).not.toBeNull();
    expect(result?.src).toContain('focal.jpg');
  });
});
