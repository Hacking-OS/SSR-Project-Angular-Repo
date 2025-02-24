import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { mergeMap, catchError, switchMap } from 'rxjs/operators';
import { AccessTokenResponse } from '../../Schemas/Enums/autherizeResponse.Enum';
import { Router } from '@angular/router';
import { PostType } from '../Schemas/Enums/responseType.Enum';
import { ApiServiceBase } from './ServiceBase/token.ApiServiceBase';
import { environment } from '../../../../environments/environment';
import { Utilities } from '../utilities.Service';
import { LoggerService } from '../Logging-Services/logging.Service';
import * as CryptoJS from 'crypto-js';
import { SharedService } from '../shared.Service';
import { HTTP_STATUS_CODES } from '../Schemas/Interfaces/shared.Interface';

@Injectable({
    providedIn: 'root'
  })
  // @Injectable()
export class EndpointBase extends ApiServiceBase {
  private readonly apiKey = environment.API_KEY; // Your API Key
  private readonly secretKey = environment.SECRET_AUTH_KEY; // Your Secret Key
  private readonly salt = environment.SALT_KEY; // Hardcoded salt value
  private taskPauser: Subject<any> | null = null;
  private isRefreshingLogin = false;
  private sharedService!: SharedService;

  constructor(
    private http: HttpClient,
    private injector: Injector,
    // private getToken: RefreshtokenService,
    private router: Router,
    private logger:LoggerService,
    // private cdr:ChangeDetectorRef
    // private sharedService:SharedService
    // private httpTokenService: HttpTokenService
  ) { super(); }


  private getSharedService(): SharedService {
    if (!this.sharedService) {
      this.sharedService = this.injector.get(SharedService);
    }
    return this.sharedService;
  }

  private get requestHeader(): { headers: HttpHeaders } {
    const url = environment.baseUrl; // Adjust based on your API endpoint
    const nonce = Math.random().toString(36).substring(2); // Generate a random nonce
    const timestamp = new Date(Date.now()).toISOString(); // Get current timestamp
    const signature = this.generateHMAC(this.apiKey,nonce,timestamp,this.salt);
    const userAgent = (typeof window !== 'undefined' && typeof document !== 'undefined') ? window.navigator.userAgent : 'Custom User Agent Name';
    // crypto.HmacSHA256(dataToSign, this.secretKey).toString(crypto.enc.Hex)
  return {
    headers: new HttpHeaders({
    // 'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.getSharedService().getUserSessionInfo()?.access_token}`,
    'X-XSRF-TOKEN': this.getCookie('XSRF-TOKEN') ?? this.getSharedService().getUserSessionInfo()?.xsrfToken ?? '',
    'x-api-key': this.apiKey,
    'x-nonce': nonce,
    'x-timestamp': timestamp,
     'x-signature': signature,
    'HMAC-Signature': this.generateHmacSignature(this.secretKey,userAgent, this.salt),
    'User-Agent': userAgent
    })
  }
}
  /**
   * Handles the error response from the API request.
   *
   * @param {HttpErrorResponse} error - The error response from the API request.
   * @param {() => Observable<T>} continuation - A function that returns an observable to continue the operation.
   * @return {Observable<T>} An observable with the response data or an error.
   */
handleError<T = any>(error: HttpErrorResponse, continuation: () => Observable<T>): Observable<any> {
  console.error('EndpointBase handleError:', error);
  const tokenApiModel: { token: string; refreshToken: string } = {
    token: this.getSharedService().getUserSessionInfo()?.access_token,
    refreshToken:this.getSharedService().getUserSessionInfo()?.refreshToken,
  };
  
if(error.status != 401 && error.status != 403 && HTTP_STATUS_CODES.includes(error.status)){
  return this.handleRefreshTokenError(error) as Observable<HttpEvent<HttpErrorResponse>>;
}

  // Check for unauthorized error
  if (this.isRefreshingLogin) {
    return this.pauseTask(continuation);
  }

  this.isRefreshingLogin = true;


  // Validate tokens
  if (!tokenApiModel.token && !tokenApiModel.refreshToken) {
    this.isRefreshingLogin = false;
    return throwError(() => Utilities.getHttpResponseMessage(error).replace('message:','') ?? 'Local null');
  }

    if (typeof error.error === 'string'  || error.error && (error.status===403||error.status===401)) {
      return this.GetApiResponse<AccessTokenResponse,{ token: string; refreshToken: string }>('/api/token/refresh-token',tokenApiModel,PostType.POST).pipe(
        mergeMap((response: AccessTokenResponse) => {
          this.isRefreshingLogin = false;
          if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem('access_token', response.access_token); // Updating Token
          sessionStorage.setItem('xsrfToken', response.xsrf_token); // Updating Token
          }
          console.log('Token refreshed successfully:', response.access_token); // Log success
          this.logger.setTokenRefreshStatus(true);
          this.resumeTasks(true);
          return continuation(); // Continue with the original operation
        }),
        catchError((refreshLoginError: HttpErrorResponse) => {
          this.isRefreshingLogin = false;
          this.resumeTasks(false);
          console.log('Error refreshing token:', refreshLoginError);
          return this.handleRefreshTokenError(refreshLoginError);
        })
      );
    } else if (error.error) {
     return this.handleRefreshTokenError(error);
    } else{
      return this.handleRefreshTokenError(error);
    }
}


  private pauseTask(continuation: () => Observable<any>): Observable<any> {
    if (!this.taskPauser) {
      this.taskPauser = new Subject();
    }

    return this.taskPauser.pipe(
      switchMap(continueOp => {
        return continueOp ? continuation() : throwError(() => 'Session expired');
      })
    );
  }

  private resumeTasks(continueOp: boolean): void {
    setTimeout(() => {
      if (this.taskPauser) {
        this.taskPauser.next(continueOp);
        this.taskPauser.complete();
        this.taskPauser = null;
      }
    });
  }

  private handleRefreshTokenError(error: HttpErrorResponse): Observable<HttpEvent<HttpErrorResponse>> {
    // Invalid refresh token!
  this.logger.error('EndpointBase handleError:' + JSON.stringify(Utilities.getHttpResponseMessage(error)));
  if(error.status === 0) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
    }
    this.router.navigate(['/user/login']);
    return throwError(() => Utilities.getHttpResponseMessage(error).replace('message:','') ?? 'Local null') as Observable<HttpEvent<HttpErrorResponse>>;
  }
  this.logger.setTokenRefreshStatus(false);
    console.log('Error refreshing token:', error);

    if (error.status === 401 || error.status === 403 && ((error.error && typeof error.error  === 'string') && error.error.includes('token'))) {
      this.isRefreshingLogin = false;
      this.resumeTasks(false);
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      }
      console.error('Invalid Token. Session expired.');
      this.router.navigate(['/user/login']);
      return throwError(() => 'Session expired') as Observable<HttpEvent<HttpErrorResponse>>;
    } else {
      return throwError(() => Utilities.getHttpResponseMessage(error)) as Observable<HttpEvent<HttpErrorResponse>>;
    }
  }


  GetApiResponse<Response, OtherParams = any>(apiPath: string, obj: OtherParams, postTypeResponse?: PostType): Observable<Response> {
    const options = {
      ...this.requestHeader,
      withCredentials: true // Include credentials in the request
    };
    const url = environment.baseUrl + apiPath; // Construct the URL dynamically
    switch (postTypeResponse) {
      case PostType.POST:
        console.log("post");
        return this.http.post<Response>(url, obj, {...options}).pipe(
          catchError((error: HttpErrorResponse): Observable<any> => {
            return this.handleRefreshTokenError(error);
          })
        );
      case PostType.GET:
        console.log("get");
        const getUrl = obj ? `${url}${obj}` : url;
        // const getUrl = obj ? `${url}?${new URLSearchParams(obj as any).toString()}` : url;
        return this.http.get<Response>(getUrl, {...options}).pipe(
          catchError((error: HttpErrorResponse): Observable<any> => {
            console.error(error);
            return this.handleRefreshTokenError(error);
          })
        );
      case PostType.DELETE:
        console.log('delete');
        // const deleteUrl = obj ? `${url}?${new URLSearchParams(obj as any).toString()}` : url;
        const deleteUrl = obj ? `${url}${obj}` : url;
        return this.http.delete<Response>(deleteUrl, {...options}).pipe(
          catchError((error: HttpErrorResponse): Observable<any> => {
            console.error(error);
            return this.handleRefreshTokenError(error);
          })
        );
      case PostType.PATCH:
        console.log('patch');
        return this.http.patch<Response>(url, obj, {...options}).pipe(
          catchError((error: HttpErrorResponse): Observable<any> => {
            console.error(error);
            return this.handleRefreshTokenError(error);
          })
        );
      case PostType.PUT:
        console.log('put');
        return this.http.put<Response>(url, obj, {...options}).pipe(
          catchError((error: HttpErrorResponse): Observable<any> => {
            console.error(error);
            return this.handleRefreshTokenError(error);
          })
        );
      default:
        console.log("Defult");
        return this.http.request<Response>(new HttpRequest(postTypeResponse ? postTypeResponse : 'POST', url, obj, {...options})).pipe(
          catchError((error: HttpErrorResponse): Observable<any> => {
            console.error(error);
            return this.handleRefreshTokenError(error);
          })
        );
    }
  }

generateHMAC(apiKey: string, nonce: string, timestamp: string, salt: string): string {
  const dataToSign = `${apiKey}:${nonce}:${timestamp}`;
  const hmac = CryptoJS.HmacSHA256(`${dataToSign}:${salt}`, `${this.secretKey}:${salt}`);
  return CryptoJS.enc.Base64.stringify(hmac);
  // const dataToSign = `${apiKey}:${nonce}:${timestamp}`;
  // const hmac = CryptoJS.HmacSHA256(`${dataToSign}:${salt}`, this.secretKey);
  // return CryptoJS.enc.Base64.stringify(hmac);
}

 generateHmacSignature(secretKey?: string, message?: string,salt?:string): string {
  const hmac = CryptoJS.HmacSHA256(`${message}:${this.salt}`, this.secretKey);
    return CryptoJS.enc.Base64.stringify(hmac);
  }

public getCookie(name: string): string | null {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
  }
  return null;
}
}
