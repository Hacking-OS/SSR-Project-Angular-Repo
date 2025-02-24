import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';

// import { AlertService, AlertType } from '../../Shared-Module/Alert-Services/alert.AlertService';
// import { SharedService } from '../../Shared-Module/Shared-Services/shared.Service';
import { PostType } from '../test-models/responseType.Enum';
import { EndpointExampleBase } from './endpointBase/endpoint-base.service';
import { environment } from '../../../../../../environments/environment';

// @Injectable({
//   providedIn: 'root',
// })
@Injectable()
/**
 * Constructor of HttpLoginEndPointService class
 * @param http injectable instance of HttpClient
 * @param authService injectable instance of AuthService
 * @param endPointBase injectable instance of EndpointBase
 */
export class HttpLoginEndPointService extends EndpointExampleBase {
  constructor(protected http: HttpClient) {
    super(http);
  }

  GetApiResponse<Response, OtherParams = any>(apiPath: string,obj: OtherParams,  postTypeResponse?: PostType): Observable<Response> {
    const url =  environment.baseUrl + apiPath; // Construct the URL dynamically
    switch (postTypeResponse) {
      case PostType.POST:
        console.log('post');
        return this.http.post<Response>(url, obj, this.buildHeaders(false)).pipe(
            catchError((error: HttpErrorResponse): Observable<any> => {
              console.error(error);
              return this.handleError(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse)
              );
            })
          );
      case PostType.GET:
        console.log('get');
        const getUrl = obj ? `${url}/${obj}` : url;
        // const getUrl = obj ? `${url}?${new URLSearchParams(obj as any).toString()}` : url;
        return this.http.get<Response>(getUrl, this.buildHeaders(false)).pipe(
          catchError((error: HttpErrorResponse): Observable<any> => {
            console.error(error);
            return this.handleError(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse)
            );
          })
        );
      case PostType.DELETE:
        console.log('delete');
        // const deleteUrl = obj ? `${url}?${new URLSearchParams(obj as any).toString()}` : url;
        const deleteUrl = obj ? `${url}/${obj}` : url;
        return this.http.delete<Response>(deleteUrl, this.buildHeaders(false)).pipe(
            catchError((error: HttpErrorResponse): Observable<any> => {
              console.error(error);
              return this.handleError(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse)
              );
            })
          );
      case PostType.PATCH:
        console.log('patch');
        return this.http.patch<Response>(url, obj, this.buildHeaders(false)).pipe(
            catchError((error: HttpErrorResponse): Observable<any> => {
              console.error(error);
              return this.handleError(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse)
              );
            })
          );
      case PostType.PUT:
        console.log('put');
        return this.http.put<Response>(url, obj , this.buildHeaders(false)).pipe(
          catchError((error: HttpErrorResponse): Observable<any> => {
            console.error(error);
            return this.handleError(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse)
            );
          })
        );
      default:
        console.log('Defult');
        return this.http.request<Response>('POST', url, {
            body: obj,
            ...this.buildHeaders(false),
            observe: 'response',
          }).pipe(map((response: HttpResponse<Response>) => response.body as Response),
            catchError((error: HttpErrorResponse): Observable<any> => {
              return this.handleError(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse)
              );
            })
          );
    }
  }

  // private getCsrfToken(): string | null {
  //   const name = 'XSRF-TOKEN=';
  //   const decodedCookie = decodeURIComponent(document.cookie);
  //   const cookies = decodedCookie.split(';');

  //   for (let i = 0; i < cookies.length; i++) {
  //     let cookie = cookies[i].trim();
  //     if (cookie.startsWith(name)) {
  //       return cookie.substring(name.length, cookie.length);
  //     }
  //   }
  //   return null;
  // }
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
