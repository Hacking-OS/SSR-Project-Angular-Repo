import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, map } from 'rxjs';

export interface BusyPayload {
  isBusy: boolean;
  message?: string;
}
const notBusyPayload: BusyPayload = { isBusy: false };
@Injectable({ providedIn: 'root' })
export class BusyService {

  private subject = new ReplaySubject<BusyPayload>();
  private busyCounter = 0;
  busyState$ = this.subject.asObservable();
  private scrollPosition: number | null = null;

  increment(message: string) {
    this.storeScrollPosition();
    this.busyCounter++;
    const payload: BusyPayload = { isBusy: true, message };
    this.subject.next(payload);
  }

  decrement() {
    this.busyCounter--;
    if (this.busyCounter <= 0) {
      this.subject.next(notBusyPayload);
      this.restoreScrollPosition();
    }
  }

  private storeScrollPosition() {
    this.scrollPosition = window.scrollY;
  }

  private restoreScrollPosition() {
    if (this.scrollPosition !== null) {
      setTimeout(() => {
        window.scrollTo(0, this.scrollPosition!);
        this.scrollPosition = null; // Reset after restoring
      }, 0);
    }
  }
  isBusy$(): Observable<boolean> {
    return this.busyState$.pipe(map((state) => state.isBusy));
  }
}
