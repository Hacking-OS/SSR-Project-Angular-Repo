import { ErrorHandler, Injectable, InjectionToken, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService, AlertType } from '../../Alert-Services/alert.AlertService';
import { LoggerService } from '../Logging-Services/logging.Service';
import { Utilities } from '../utilities.Service';
import { SharedService } from '../shared.Service';

// export const ALERT_SERVICE_TOKEN = new InjectionToken<AlertService>('ALERT_SERVICE_TOKEN');
@Injectable({ providedIn: 'root' })
export class GlobalErrorHandlerService extends ErrorHandler {
  constructor(private injector: Injector,private logger:LoggerService) {
    super();
  }

   override handleError(error: HttpErrorResponse) : void {
    console.log("handleError has been hit with error: \n\n" + JSON.stringify(error.error ?? error.message));
    if (error) {
      const alertService = this.injector.get<AlertService>(AlertService);
      const sharedService = this.injector.get<SharedService>(SharedService);
      alertService.showErrorPopup(error, AlertType.Error,true);
      // this.logger.error('EndpointBase handleError:' + Utilities.getHttpResponseMessage(error));
      if (!sharedService.getUserSessionInfo()?.access_token) {
        return;
      }
      if (error.status === 401 || error.status === 403) {
        if (confirm(`Fatal Error!\nAn unresolved error has occurred. Do you want to reload the page to correct this?\n\nError: ${error.message}`)) {
          window.location.reload();
        }
      }
    }
    // super.handleError(error);
  }
}
