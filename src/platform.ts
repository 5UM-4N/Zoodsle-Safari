/**
 * Platform and Device detection for keyboard shortcuts and accessible labels.
 */

export interface DeviceShortcuts {
  isMac: boolean;
  describeShortcutLabel: string;
  stopShortcutLabel: string;
}

export function getDeviceShortcuts(): DeviceShortcuts {
  const isMac =
    typeof navigator !== 'undefined' &&
    (/Mac|iPhone|iPad|iPod/.test(navigator.platform || '') ||
      /Macintosh|Mac OS X/.test(navigator.userAgent || ''));

  return {
    isMac,
    describeShortcutLabel: isMac ? '⌥⇧D' : 'Alt+Shift+D',
    stopShortcutLabel: isMac ? '⌥⇧S' : 'Alt+Shift+S',
  };
}

export function isDescribeKeyCombo(e: KeyboardEvent): boolean {
  const isKeyD =
    e.code === 'KeyD' ||
    e.key === 'D' ||
    e.key === 'd' ||
    e.key === 'Î' ||
    e.key === '∂';

  const hasModifier =
    (e.altKey && e.shiftKey) ||
    (e.metaKey && e.shiftKey) ||
    (e.ctrlKey && e.shiftKey);

  return isKeyD && hasModifier;
}

export function isStopSpeechKeyCombo(e: KeyboardEvent): boolean {
  const isKeyS =
    e.code === 'KeyS' ||
    e.key === 'S' ||
    e.key === 's' ||
    e.key === 'Í' ||
    e.key === 'ß';

  const hasModifier =
    (e.altKey && e.shiftKey) ||
    (e.metaKey && e.shiftKey) ||
    (e.ctrlKey && e.shiftKey);

  return isKeyS && hasModifier;
}
