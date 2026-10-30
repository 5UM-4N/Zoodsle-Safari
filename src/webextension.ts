/**
 * Safari WebExtension Compatibility Layer
 * Transparently maps browser.* (Safari native standard) and chrome.* APIs
 */

export function getWebExtensionApi() {
  if (typeof browser !== 'undefined' && browser.runtime) {
    return browser;
  }
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    return chrome;
  }
  return null;
}

export async function sendExtensionMessage<M = any, R = any>(message: M): Promise<R> {
  const api = getWebExtensionApi();
  if (!api || !api.runtime) {
    throw new Error('WebExtension runtime API is unavailable in this environment.');
  }

  // Modern Safari browser.runtime.sendMessage returns a Promise
  if (typeof browser !== 'undefined' && browser.runtime?.sendMessage) {
    try {
      const res = browser.runtime.sendMessage(message);
      if (res && typeof (res as any).then === 'function') {
        return await res;
      }
    } catch {
      // Fallback to chrome.runtime if browser call fails
    }
  }

  if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime?.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  throw new Error('No compatible runtime messaging found.');
}

export async function getStorageItem<T = any>(key: string): Promise<T | null> {
  const api = getWebExtensionApi();
  if (!api || !api.storage || !api.storage.local) {
    return null;
  }

  try {
    if (typeof browser !== 'undefined' && browser.storage?.local?.get) {
      const res = browser.storage.local.get(key);
      if (res && typeof (res as any).then === 'function') {
        const data = await res;
        return data ? (data[key] as T) : null;
      }
    }
  } catch {
    // fallback
  }

  if (typeof chrome !== 'undefined' && chrome.storage?.local?.get) {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (data) => {
        resolve(data ? (data[key] as T) : null);
      });
    });
  }

  return null;
}

export async function setStorageItem<T = any>(key: string, value: T): Promise<void> {
  const api = getWebExtensionApi();
  if (!api || !api.storage || !api.storage.local) {
    return;
  }

  try {
    if (typeof browser !== 'undefined' && browser.storage?.local?.set) {
      const res = browser.storage.local.set({ [key]: value });
      if (res && typeof (res as any).then === 'function') {
        await res;
        return;
      }
    }
  } catch {
    // fallback
  }

  if (typeof chrome !== 'undefined' && chrome.storage?.local?.set) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => resolve());
    });
  }
}

export async function queryActiveTab(): Promise<{ id?: number; url?: string } | null> {
  const api = getWebExtensionApi();
  if (!api || !api.tabs) return null;

  try {
    if (typeof browser !== 'undefined' && browser.tabs?.query) {
      const res = browser.tabs.query({ active: true, currentWindow: true });
      if (res && typeof (res as any).then === 'function') {
        const tabs = await res;
        return tabs[0] || null;
      }
    }
  } catch {
    // fallback
  }

  if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0] || null);
      });
    });
  }

  return null;
}

export async function sendTabMessage<M = any, R = any>(tabId: number, message: M): Promise<R> {
  const api = getWebExtensionApi();
  if (!api || !api.tabs) {
    throw new Error('Tabs API unavailable.');
  }

  try {
    if (typeof browser !== 'undefined' && browser.tabs?.sendMessage) {
      const res = browser.tabs.sendMessage(tabId, message);
      if (res && typeof (res as any).then === 'function') {
        return await res;
      }
    }
  } catch {
    // fallback
  }

  if (typeof chrome !== 'undefined' && chrome.tabs?.sendMessage) {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime?.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  throw new Error('No compatible tab messaging found.');
}
