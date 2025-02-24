import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { prefixReq, prefixRes } from './http-config';
import { logMessage } from './log';
import { BusyService } from '../Shared-Services/Interceptor-Services/busy.service';
import { LoadingService } from '../Shared-Services/Interceptor-Services/loading.service';

@Injectable()
export class BusyInterceptor implements HttpInterceptor {

  constructor(private busyService: BusyService, private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const msg = req.method === 'GET' ? 'Loading ...' : 'Saving ...';
    // logMessage(`${prefixReq} ⚙️ Busy Spinner`, ['Incrementing the busy spinner']);

    // Set loading state to true when request starts
    this.loadingService.setLoadingState(true);
    this.busyService.increment(msg);

    return next.handle(req).pipe(
      finalize(() => {
        // Use setTimeout to simulate a delay (adjust timing as needed)
        setTimeout(() => {
          // Set loading state to false after a delay
          this.loadingService.setLoadingState(false);
          this.busyService.decrement();
          // logMessage(`${prefixRes} ⚙️ Busy Spinner`, ['Decrementing the busy spinner']);
        }, 2000); // Adjust timeout delay as per your requirement
      }),
      catchError((error) => {
        // Handle errors and ensure loading state is properly managed
        this.loadingService.setLoadingState(false); // Ensure loading state is set to false on error
        this.busyService.decrement();
        throw error; // Re-throw the error to propagate it downstream
      })
    );
  }
}
