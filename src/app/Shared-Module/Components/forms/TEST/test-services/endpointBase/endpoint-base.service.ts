import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, Subject, from, of, throwError } from 'rxjs';
import { mergeMap, switchMap, catchError } from 'rxjs/operators';


@Injectable()
export class EndpointExampleBase {
  private taskPauser: Subject<any> = new Subject();
  private isRefreshingLogin = false;

  constructor(protected http: HttpClient) {}

  // Dynamic Token Getter
  protected get cosToken(): string {
    return '';
  }

  // Build headers dynamically based on type (default, file upload, etc.)
  protected buildHeaders(isFileUpload = false): { headers: HttpHeaders } {
    let headersConfig: Record<string, string> = {
      Authorization: `Bearer 123`,
      Accept: isFileUpload ? 'application/json' : 'application/json, text/plain, */*',
    };

    if (!isFileUpload) {
      headersConfig['Content-Type'] = 'application/json';
    }
    return { headers: new HttpHeaders(headersConfig) };
  }

  // Centralized Error Handler
  protected handleError(error: HttpErrorResponse, continuation: () => Observable<any>): Observable<any> {
    if (error.status === 401 || error.status === 403) {
      return this.handleUnauthorizedError(continuation);
    }
    return throwError(() => error);
  }

  private handleUnauthorizedError(continuation: () => Observable<any>): Observable<any> {
    if (this.isRefreshingLogin) {
      return this.pauseTask(continuation);
    }

    this.isRefreshingLogin = true;
    const tokenApiModel = this.buildTokenApiModel();

    if (!tokenApiModel.token || !tokenApiModel.refreshToken) {
      // this.authService.redirectForLogin();
      return throwError(() => 'localnull');
    }

    return this.refreshToken<Response>(tokenApiModel).pipe(
      mergeMap<Response, Observable<any>>((response: Response) => {
        // this.authService.storeAdminRefreshToken(response.data.refreshToken);
        // this.authService.storeToken(response.data.accessToken);
        this.resumeTasks(true);
        return continuation();
      }),
      catchError<HttpErrorResponse, Observable<HttpErrorResponse>>((refreshError: HttpErrorResponse) =>
        this.processRefreshError(refreshError)
      )
    );
  }

  // Build Token Model
  private buildTokenApiModel() {
    return {
      token: '',
      refreshToken: '',
    };
  }

  // Token Refresh Logic
  private refreshToken<T>(tokenApiModel: any): Observable<T> {
    return from<Observable<T>>(of(tokenApiModel));
  }

  private processRefreshError(refreshLoginError: HttpErrorResponse): Observable<any> {
    this.isRefreshingLogin = false;
    this.resumeTasks(false);

    if (
      refreshLoginError.error?.statusCode === 400 &&
      refreshLoginError.error?.message.includes('refresh token expired') ||
      refreshLoginError.error?.message.includes('Please try again')
    ) {
      console.log('Invalid Token, refreshing...');
      return throwError(() => 'session expired');
    }

    return throwError(() => 'session expired');
  }

  // Pause task until token is refreshed
  private pauseTask(continuation: () => Observable<any>): Observable<any> {
    return this.taskPauser.pipe(
      switchMap((continueOp) =>
        continueOp ? continuation() : throwError(() => 'session expired')
      )
    );
  }

  // Resume paused tasks
  private resumeTasks(continueOp: boolean): void {
    setTimeout(() => {
      this.taskPauser.next(continueOp);
      this.taskPauser.complete();
    });
  }
}
