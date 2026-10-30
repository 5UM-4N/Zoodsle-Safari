declare namespace browser {
  namespace runtime {
    interface MessageSender {
      tab?: {
        id?: number;
        url?: string;
        title?: string;
      };
      id?: string;
      url?: string;
    }

    const lastError: { message?: string } | undefined;

    function sendMessage<M = any, R = any>(message: M): Promise<R>;
    function sendMessage<M = any, R = any>(extensionId: string, message: M): Promise<R>;
    function sendMessage<M = any, R = any>(message: M, callback: (response: R) => void): void;
    function sendMessage<M = any, R = any>(extensionId: string, message: M, callback: (response: R) => void): void;

    const onMessage: {
      addListener(
        callback: (
          message: any,
          sender: MessageSender,
          sendResponse: (response?: any) => void
        ) => boolean | void | Promise<any>
      ): void;
      removeListener(callback: (...args: any[]) => void): void;
    };

    function getURL(path: string): string;
  }

  namespace storage {
    interface StorageArea {
      get(keys?: string | string[] | Record<string, any> | null): Promise<Record<string, any>>;
      get(keys: string | string[] | Record<string, any> | null, callback: (items: Record<string, any>) => void): void;
      set(items: Record<string, any>): Promise<void>;
      set(items: Record<string, any>, callback: () => void): void;
      remove(keys: string | string[]): Promise<void>;
      clear(): Promise<void>;
    }

    const local: StorageArea;
    const sync: StorageArea;

    interface StorageChange {
      oldValue?: any;
      newValue?: any;
    }

    const onChanged: {
      addListener(
        callback: (changes: Record<string, StorageChange>, areaName: string) => void
      ): void;
      removeListener(callback: (...args: any[]) => void): void;
    };
  }

  namespace tabs {
    interface Tab {
      id?: number;
      url?: string;
      title?: string;
      active?: boolean;
    }

    function query(queryInfo: {
      active?: boolean;
      currentWindow?: boolean;
      url?: string | string[];
    }): Promise<Tab[]>;

    function query(
      queryInfo: {
        active?: boolean;
        currentWindow?: boolean;
        url?: string | string[];
      },
      callback: (tabs: Tab[]) => void
    ): void;

    function sendMessage<M = any, R = any>(tabId: number, message: M): Promise<R>;
    function sendMessage<M = any, R = any>(tabId: number, message: M, callback: (response: R) => void): void;
  }

  namespace commands {
    const onCommand: {
      addListener(callback: (command: string) => void): void;
      removeListener(callback: (...args: any[]) => void): void;
    };
  }
}

declare namespace chrome {
  const runtime: typeof browser.runtime;
  const storage: typeof browser.storage;
  const tabs: typeof browser.tabs;
  const commands: typeof browser.commands;
}
