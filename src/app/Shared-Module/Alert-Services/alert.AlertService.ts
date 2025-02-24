import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { ToastrService, provideToastr } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Utilities } from '../Shared-Services/utilities.Service';
// import { Dialog } from '@material-ui/core';

// @NgModule({})
@Injectable({ providedIn: 'root' })
export class AlertService {
  private alertsSubject = new BehaviorSubject<AlertMessage[]>([]);
  // static toastr: any;
  constructor(
    private toastr: ToastrService,
    // private dialog:Dialog
  ) {
    // this.toastr = toastr;
  }

  // Function to subscribe to alerts
  onAlert(): Observable<AlertMessage[]> {
    return this.alertsSubject.asObservable();
  }

  // Function to display an alert
  showAlert(summary: string, type: AlertType = AlertType.Info) {
    const alert: AlertMessage = { summary, type };
    const currentAlerts = this.alertsSubject.value;
    currentAlerts.push(alert);
    this.alertsSubject.next(currentAlerts);

    // Display the toast notification using ngx-toastr
    // Customize the title here
    // Dialog(currentAlerts)
    switch (type) {
      case "success":
        this.toastr.success(summary, AlertType.Success);
        break;
      case "warning":
        this.toastr.warning(summary, AlertType.Warning);
        break;
      case "info":
        this.toastr.info(summary, AlertType.Info);
        break;
      case "error":
        this.toastr.error(summary, AlertType.Error);
        break;
    }

    // Automatically remove the alert after a certain duration
    setTimeout(() => {
      this.removeAlert(alert);
    }, 3000); // 5 seconds (adjust as needed)
  }

  // Function to remove a specific alert
  removeAlert(alert: AlertMessage) {
    const currentAlerts = this.alertsSubject.value;
    const index = currentAlerts.indexOf(alert);
    if (index !== -1) {
      currentAlerts.splice(index, 1);
      this.alertsSubject.next(currentAlerts);
    }
  }

  // Function to clear all alerts
  clearAlert() {
    this.alertsSubject.next([]);
  }
  showAlertPopup(summary: string, origin?: string, type: AlertType = AlertType.Info) {
    switch (type) {
      case "success":
        this.toastr.success(summary, origin ? origin : AlertType.Success);
        break;
      case "warning":
        this.toastr.warning(summary, origin ? origin : AlertType.Warning);
        break;
      case "info":
        this.toastr.info(summary, origin ? origin : AlertType.Info);
        break;
      case "error":
        this.toastr.error(summary, origin ? origin : AlertType.Error);
        break;
    }
  }

  showErrorPopup(error: HttpErrorResponse, type: AlertType = AlertType.Info,isHitErrorHandler:boolean=false) {
    if (isHitErrorHandler){
      console.log("Popup From ErrorHandler Successfully Working \n\n");
    }
    let message: string;

    if (typeof error === 'string') {
      message = error;

      this.showAlertPopup(message,
        (message.toLowerCase().includes('session') || message.toLowerCase().includes('token'))
        ? "Authentication Failed"
        : AlertType.Error,
        AlertType.Error);

    } else if (typeof error === "object") {

      this.getMessagePopup(Utilities.getHttpResponseMessage(error),AlertType.Error);

    }
  }

  getMessagePopup(summary: string,type:AlertType):void {
    const alert: AlertMessage = { summary, type };
    const currentAlerts = this.alertsSubject.value;
    currentAlerts.push(alert);
    this.alertsSubject.next(currentAlerts);
    switch (type) {
      case "success":
        this.toastr.success(summary, AlertType.Success);
        break;
      case "warning":
        this.toastr.warning(summary, AlertType.Warning);
        break;
      case "info":
        this.toastr.info(summary, AlertType.Info);
        break;
      case "error":
        this.toastr.error(summary, AlertType.Error);
        break;
    }
  }
}


// Define an AlertMessage interface
export interface AlertMessage {
  summary: string;
  type: AlertType;
}

// Define an enumeration for alert types
export enum AlertType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
}
