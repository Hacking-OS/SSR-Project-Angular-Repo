import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams, HttpRequest, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { Observable, catchError, filter, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EndpointBase } from '../../Shared-Module/Shared-Services/Token-Services/API-basePoint.TokenService';
import { PostType } from '../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum';
import * as crypto from 'crypto-js';
import { SharedService } from '../../Shared-Module/Shared-Services/shared.Service';
// @NgModule({})
interface RequestOptions {
  headers?: HttpHeaders;
  responseType?:  'arraybuffer' | 'blob' | 'json' | 'text';
  observe?: 'body' | 'response' | 'events';
}

@Injectable()
export class HttpCartEndPointService {
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
    // const signature = crypto.HmacSHA256(dataToSign, this.secretKey).toString(crypto.enc.Hex);
  return {
    headers: new HttpHeaders({
  // 'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.sharedService.getUserSessionInfo()?.access_token}`,
    'X-XSRF-TOKEN': this.endPointBase.getCookie('XSRF-TOKEN') ?? this.sharedService.getUserSessionInfo()?.xsrfToken ?? '','x-api-key': this.apiKey,
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
    // 'X-XSRF-TOKEN': this.endPointBase.getCookie('XSRF-TOKEN') ?? sessionStorage.getItem("xsrfToken") ?? '','x-api-key': this.apiKey,
    'x-nonce': nonce,
    'x-timestamp': timestamp,
     'x-signature': signature,
     'HMAC-Signature': this.endPointBase.generateHmacSignature(this.secretKey,userAgent, this.salt),
     'User-Agent': userAgent
    })
  }
}
  GetApiResponse<Response, OtherParams = any>(apiPath: string, obj: OtherParams, postTypeResponse?: PostType, responseType: 'arraybuffer' | 'blob' | 'json' | 'text'= 'json', observe: 'body' | 'response' | 'events' = 'body'): Observable<Response> {
    const url = environment.baseUrl + apiPath; // Construct the URL dynamically
    // Construct the options object
    const options: RequestOptions = {
      ...this.requestHeader,  // Assuming this.requestHeader.headers is of type HttpHeaders
      responseType: responseType as 'arraybuffer' | 'blob' | 'json' | 'text',  // Cast to correct types
      observe: observe as 'body' | 'response' | 'events',  // Cast to correct types
  };

  // Ensure observe and responseType are only set when necessary
  const requestOptions: any = { ...options, withCredentials: true };

  // Update the options only if they are provided
  if (observe) {
      requestOptions.observe = observe as 'body' | 'response' | 'events';
  }
  if (responseType) {
      requestOptions.responseType = responseType as 'arraybuffer' | 'blob' | 'json' | 'text';
  }
    switch (postTypeResponse) {
      case PostType.POST:
        console.log("post");
        return this.http.post<Response>(url, obj, requestOptions).pipe(
          catchError((error: HttpErrorResponse): Observable<any> => {
            console.error(error);
            return this.endPointBase.handleError<Response | HttpErrorResponse>(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse,responseType,observe));
          })
        );
      case PostType.GET:
        console.log("get");
        const getUrl = obj ? `${url}/${obj}` : url;
        // const getUrl = obj ? `${url}?${new URLSearchParams(obj as any).toString()}` : url;
        return this.http.get<Response>(getUrl, requestOptions).pipe(
          catchError((error: HttpErrorResponse): Observable<any> => {
            console.error(error);
            return this.endPointBase.handleError<Response | HttpErrorResponse>(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse,responseType,observe));
          })
        );
      case PostType.DELETE:
        console.log('delete');
        // const deleteUrl = obj ? `${url}?${new URLSearchParams(obj as any).toString()}` : url;
        const deleteUrl = obj ? `${url}/${obj}` : url;
        return this.http.delete<Response>(deleteUrl, requestOptions).pipe(
          catchError((error: HttpErrorResponse): Observable<any> => {
            console.error(error);
            return this.endPointBase.handleError<Response | HttpErrorResponse>(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse,responseType,observe));
          })
        );
      case PostType.PATCH:
        console.log('patch');
        return this.http.patch<Response>(url, obj, requestOptions).pipe(
          catchError((error: HttpErrorResponse): Observable<any> => {
            console.error(error);
            return this.endPointBase.handleError<Response | HttpErrorResponse>(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse,responseType,observe));
          })
        );
      case PostType.PUT:
        console.log('put');
        return this.http.put<Response>(url, obj, requestOptions).pipe(
          catchError((error: HttpErrorResponse): Observable<any> => {
            console.error(error);
            return this.endPointBase.handleError<Response | HttpErrorResponse>(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse,responseType,observe));
          })
        );
      default:
        console.log("Defult");
        // ...this.requestHeader, observe: 'response'
        return this.http.request<Response>(postTypeResponse || 'POST', url, {
          body: obj,
          ...requestOptions,
          observe: 'events' // Use 'events' to handle different event types
        }).pipe(
          filter((event: HttpEvent<any>): event is HttpResponse<Response> => event instanceof HttpResponse), // Correct type guard
          map((response: HttpResponse<Response>) => response.body as Response), // Extract body
          catchError((error: HttpErrorResponse) => {
            return this.endPointBase.handleError<Response | HttpErrorResponse>(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse,responseType,observe));
          })
        );

    }
  }
}
