import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EndpointBase } from '../../Shared-Module/Shared-Services/Token-Services/API-basePoint.TokenService';
// import { AlertService, AlertType } from '../../Shared-Module/Alert-Services/alert.AlertService';
// import { SharedService } from '../../Shared-Module/Shared-Services/shared.Service';
import { PostType } from '../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum';
import * as crypto from 'crypto-js';
import { SharedService } from '../../Shared-Module/Shared-Services/shared.Service';
// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class HttpMediaEndPointService {
  private readonly apiKey = environment.API_KEY; // Your API Key
  private readonly secretKey = environment.SECRET_AUTH_KEY; // Your Secret Key
  private readonly salt = environment.SALT_KEY; // Hardcoded salt value
  constructor(private http: HttpClient, private endPointBase: EndpointBase,private sharedService:SharedService) { }
  private get requestHeader(): { headers: HttpHeaders } {
    const url = environment.baseUrl; // Adjust based on your API endpoint
    const nonce = Math.random().toString(36).substring(2); // Generate a random nonce
    const timestamp = new Date(Date.now()).toISOString(); // Get current timestamp
    const dataToSign = `${this.apiKey}${nonce}${timestamp}${this.salt}`;
    const signature = this.endPointBase.generateHMAC(this.apiKey,nonce,timestamp,this.salt);
    const userAgent = window.navigator.userAgent;
  return {
    headers: new HttpHeaders({
    // 'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
    // 'X-XSRF-TOKEN': this.endPointBase.getCookie('XSRF-TOKEN') ?? sessionStorage.getItem("xsrfToken") ?? '','x-api-key': this.apiKey,
    'Authorization': `Bearer ${this.sharedService.getUserSessionInfo()?.access_token}`,
    'X-XSRF-TOKEN': this.endPointBase.getCookie('XSRF-TOKEN') ?? this.sharedService.getUserSessionInfo()?.xsrfToken ?? '','x-api-key': this.apiKey,
    'x-nonce': nonce,
    'x-timestamp': timestamp,
    'x-signature': signature,
    'HMAC-Signature': this.endPointBase.generateHmacSignature(this.secretKey,userAgent, this.salt),
    'User-Agent': userAgent
    })
  }
}
  GetApiResponse<Response, OtherParams = any>(apiPath: string, obj: OtherParams, postTypeResponse?: PostType): Observable<Response> {
    const url = environment.baseUrl + apiPath; // Construct the URL dynamically
    switch (postTypeResponse) {
      case PostType.POST:
        console.log("post");
        return this.http.post<Response>(url, obj, this.requestHeader).pipe(
          catchError((error: HttpErrorResponse): Observable<any> => {
            console.error(error);
            return this.endPointBase.handleError<Response | HttpErrorResponse>(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse));
          })
        );
      case PostType.GET:
        console.log("get");
        const getUrl = obj ? `${url}/${obj}` : url;
        // const getUrl = obj ? `${url}?${new URLSearchParams(obj as any).toString()}` : url;
        return this.http.get<Response>(getUrl, this.requestHeader).pipe(
          catchError((error: HttpErrorResponse): Observable<any> => {
            console.error(error);
            return this.endPointBase.handleError<Response | HttpErrorResponse>(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse));
          })
        );
      case PostType.DELETE:
        console.log('delete');
        // const deleteUrl = obj ? `${url}?${new URLSearchParams(obj as any).toString()}` : url;
        const deleteUrl = obj ? `${url}/${obj}` : url;
        return this.http.delete<Response>(deleteUrl, this.requestHeader).pipe(
          catchError((error: HttpErrorResponse): Observable<any> => {
            console.error(error);
            return this.endPointBase.handleError<Response | HttpErrorResponse>(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse));
          })
        );
      case PostType.PATCH:
        console.log('patch');
        return this.http.patch<Response>(url, obj, this.requestHeader).pipe(
          catchError((error: HttpErrorResponse): Observable<any> => {
            console.error(error);
            return this.endPointBase.handleError<Response | HttpErrorResponse>(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse));
          })
        );
      case PostType.PUT:
        console.log('put');
        return this.http.put<Response>(url, obj, this.requestHeader).pipe(
          catchError((error: HttpErrorResponse): Observable<any> => {
            console.error(error);
            return this.endPointBase.handleError<Response | HttpErrorResponse>(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse));
          })
        );
      default:
        console.log("Defult");
        return this.http.request<Response>('POST', url, { body: obj, ...this.requestHeader, observe: 'response' }).pipe(
          map((response: HttpResponse<Response>) => response.body as Response),
          catchError((error: HttpErrorResponse): Observable<any> => {
            return this.endPointBase.handleError<Response | HttpErrorResponse>(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse));
          })
        );
    }
  }
  private getCookie(name: string): string | null {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
  }
    return null;
  }
}

// .pipe(
//   catchError((error: HttpErrorResponse) => {
//     return throwError(() => error);
//   })
// );
// if (postTypeResponse?.toLowerCase().includes("post")) {
// } else if (postTypeResponse?.toLowerCase().includes("post")) {
// } else if (postTypeResponse?.toLowerCase().includes("get")) {
// } else if (postTypeResponse?.toLowerCase().includes("delete")) {
// } else if (postTypeResponse?.toLowerCase().includes("patch")) {
// } else if (postTypeResponse?.toLowerCase().includes("update")) { }
