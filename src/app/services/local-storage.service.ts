import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private storageSub = new Subject<{ key: string, value: any }>();

  constructor(private ngZone: NgZone) {
    this.initStorageListener();
  }

  private initStorageListener() {
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.storageArea === localStorage) {
        this.ngZone.run(() => {
          try {
            const value = event.newValue ? this.safeJsonParse(event.newValue) : null;
            this.storageSub.next({
              key: event.key || '',
              value
            });
          } catch (e) {
            console.error('Error parsing storage value:', e);
            this.storageSub.next({
              key: event.key || '',
              value: event.newValue
            });
          }
        });
      }
    });
  }

  private safeJsonParse(value: string): any {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  watchStorage(): Observable<{ key: string, value: any }> {
    return this.storageSub.asObservable();
  }

  setItem(key: string, value: any): void {
    const storedValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, storedValue);
    this.storageSub.next({ key, value });
  }

  getItem(key: string): any {
    const item = localStorage.getItem(key);
    if (item === null) return null;

    try {
      return JSON.parse(item);
    } catch (e) {
      return item;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
    this.storageSub.next({ key, value: null });
  }

  clear(): void {
    localStorage.clear();
    this.storageSub.next({ key: '', value: null });
  }
}
