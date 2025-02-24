// loading.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor() {}

  setLoadingState(isLoading: boolean): void {
    this.loadingSubject.next(isLoading);
  }

  getLoadingState(): BehaviorSubject<boolean> {
    return this.loadingSubject;
  }
}
