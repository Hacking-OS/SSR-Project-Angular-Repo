import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AlertMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private alertsSubject = new BehaviorSubject<AlertMessage[]>([]);
  alerts$ = this.alertsSubject.asObservable();

  private alerts: AlertMessage[] = [];

  constructor() { }

  addAlert(alert: AlertMessage) {
    this.alerts = [...this.alerts, alert];
    this.alertsSubject.next(this.alerts);
  }

  clearAlerts() {
    this.alerts = [];
    this.alertsSubject.next(this.alerts);
  }

  closeNotification(index: number) {
    const alerts = this.alertsSubject.getValue();
    alerts.splice(index, 1);
    this.alertsSubject.next(this.alerts);
  }
}
