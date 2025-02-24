import { Component } from '@angular/core';
import { NotificationService } from './notification.AlertService';  // Adjust the path as needed
import { Observable } from 'rxjs';
import { AlertMessage } from '../alert.AlertService';

@Component({
    selector: 'app-notification',
    template: `
 <div class="notification-container">
  <div *ngFor="let alert of alerts$ | async; let i = index" class="notification-toast"
       [ngClass]="{
         'alert-success': alert.type === 'success',
         'alert-error': alert.type === 'error',
         'alert-info': alert.type === 'info'
       }">
    {{ alert.message }}
    <button class="close-btn" (click)="closeNotification(i)">x</button>
  </div>
</div>
    <!-- <button (click)="clearAlerts()">Clear Alerts</button> -->
  `,
    styles: [`
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification-toast {
  position: relative;
  padding: 10px 20px;
  border-radius: 5px;
  opacity: 1;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: opacity 0.3s ease;
}

.notification-toast.alert-success {
  background-color: #4caf50; /* Green */
}

.notification-toast.alert-error {
  background-color: #f44336; /* Red */
}

.notification-toast.alert-info {
  background-color: #2196f3; /* Blue */
}

.close-btn {
  position: absolute;
  top: -1px;
  right: 5px;
  background: none;
  border: none;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  opacity: 0.5;
}

.close-btn:hover {
  opacity: 1;
}

  `],
    standalone: false
})
export class NotificationComponent {
  // alerts$ = this.notificationService.alerts$;
  alerts$;
  
  constructor(private notificationService: NotificationService) {
    this.alerts$ = this.notificationService.alerts$;
    // this.alerts$.subscribe(alerts => {
    //   alerts.forEach((alert, index) => {
    //     setTimeout(() => {
    //       this.closeNotification(index);
    //     }, 5000); // Adjust the timeout as needed
    //   });
    // });
  }

  clearAlerts() {
    this.notificationService.clearAlerts();
  }



  closeNotification(index: number) {
    this.notificationService.closeNotification(index);
  }
}
