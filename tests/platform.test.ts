import { describe, it, expect } from 'vitest';
import {
  isDescribeKeyCombo,
  isStopSpeechKeyCombo,
  getDeviceShortcuts,
} from '../src/platform';

describe('Safari Platform and Device Shortcut Heuristics', () => {
  it('detects macOS and returns device-appropriate labels', () => {
    const shortcuts = getDeviceShortcuts();
    expect(shortcuts).toHaveProperty('isMac');
    expect(shortcuts).toHaveProperty('describeShortcutLabel');
    expect(shortcuts).toHaveProperty('stopShortcutLabel');
  });

  it('triggers describe on macOS Option+Shift+D even when key transforms to diacritic Î', () => {
    const macOptionShiftD = new KeyboardEvent('keydown', {
      code: 'KeyD',
      key: 'Î',
      altKey: true,
      shiftKey: true,
      bubbles: true,
    });
    expect(isDescribeKeyCombo(macOptionShiftD)).toBe(true);
  });

  it('triggers stop speech on Option+Shift+S', () => {
    const macOptionShiftS = new KeyboardEvent('keydown', {
      code: 'KeyS',
      key: 'Í',
      altKey: true,
      shiftKey: true,
      bubbles: true,
    });
    expect(isStopSpeechKeyCombo(macOptionShiftS)).toBe(true);
  });
});
