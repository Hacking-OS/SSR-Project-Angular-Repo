// storageManager.service.ts

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface StorageItem {
  value: any;
  expiry?: number;
}

@Injectable({ providedIn: 'root' })
export class StorageManagerService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private memoryStorage = new Map<string, StorageItem>();

  public storageChange$ = new Subject<{
    storageType: 'localStorage' | 'sessionStorage' | 'memoryStorage';
    action: 'set' | 'remove' | 'clear';
    key?: string;
    value?: any;
  }>();

  private createStorageManager(storageType: 'localStorage' | 'sessionStorage') {
    return {
      set: (key: string, value: any, expiryInMs?: number, namespace?: string): void => {
        if (!this.isBrowser()) return;
        const namespacedKey = namespace ? `${namespace}:${key}` : key;
        const item: StorageItem = {
          value,
          expiry: expiryInMs ? Date.now() + expiryInMs : undefined
        };
        try {
          const data = JSON.stringify(item);
          window[storageType].setItem(namespacedKey, data);
          this.storageChange$.next({ storageType, action: 'set', key: namespacedKey, value });
        } catch (err) {
          console.warn(`${storageType} failed, using memory storage.`);
          this.memoryStorage.set(namespacedKey, item);
        }
      },

      get: (key: string, namespace?: string): any | null => {
        if (!this.isBrowser()) return null;
        const namespacedKey = namespace ? `${namespace}:${key}` : key;
        try {
          const data = window[storageType].getItem(namespacedKey) || JSON.stringify(this.memoryStorage.get(namespacedKey));
          if (!data) return null;

          const item: StorageItem = JSON.parse(data);

          if (item.expiry && Date.now() > item.expiry) {
            window[storageType].removeItem(namespacedKey);
            this.memoryStorage.delete(namespacedKey);
            this.storageChange$.next({ storageType, action: 'remove', key: namespacedKey });
            return null;
          }

          return item.value;
        } catch (err) {
          console.error(`Error getting ${key} from ${storageType}:`, err);
          return null;
        }
      },

      remove: (key: string, namespace?: string): void => {
        if (!this.isBrowser()) return;
        const namespacedKey = namespace ? `${namespace}:${key}` : key;
        try {
          window[storageType].removeItem(namespacedKey);
          this.memoryStorage.delete(namespacedKey);
          this.storageChange$.next({ storageType, action: 'remove', key: namespacedKey });
        } catch (err) {
          console.error(`Error removing ${key} from ${storageType}:`, err);
        }
      },

      clear: (namespace?: string): void => {
        if (!this.isBrowser()) return;
        try {
          if (namespace) {
            Object.keys(window[storageType])
              .filter((key) => key.startsWith(`${namespace}:`))
              .forEach((key) => window[storageType].removeItem(key));

            Array.from(this.memoryStorage.keys())
              .filter((key) => key.startsWith(`${namespace}:`))
              .forEach((key) => this.memoryStorage.delete(key));
          } else {
            window[storageType].clear();
            this.memoryStorage.clear();
          }
          this.storageChange$.next({ storageType, action: 'clear' });
        } catch (err) {
          console.error(`Error clearing ${storageType}:`, err);
        }
      },

      getStorageSize: (): number => {
        if (!this.isBrowser()) return 0;
        let total = 0;
        for (let i = 0; i < window[storageType].length; i++) {
          const key = window[storageType].key(i);
          if (key) total += key.length + (window[storageType].getItem(key)?.length || 0);
        }
        return total;
      }
    };
  }

  localStorage = this.createStorageManager('localStorage');
  sessionStorage = this.createStorageManager('sessionStorage');
}
