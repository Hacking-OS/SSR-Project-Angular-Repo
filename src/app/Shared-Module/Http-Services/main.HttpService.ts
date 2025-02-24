import { SharedService } from './../Shared-Services/shared.Service';
import { Injectable, Injector } from '@angular/core';
import { HttpMainEndpointService } from './main-end-point.HttpService';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription, catchError, tap, throwError } from 'rxjs';
// import { HttpLoginEndPointService } from '../../User-Module/HttpServices/login-end-point.HttpService';
import { EndpointBase } from '../Shared-Services/Token-Services/API-basePoint.TokenService';
import { PostType } from '../Shared-Services/Schemas/Enums/responseType.Enum';

// @NgModule({})
@Injectable()
export class HttpMainService {
  private httpEndPointService: HttpMainEndpointService;
  constructor(private http: HttpClient, private injector: Injector,private sharedService:SharedService) {
    const endpointBase = this.injector.get(EndpointBase);
    this.httpEndPointService = new HttpMainEndpointService(this.http, endpointBase,this.sharedService);
  }
  // constructor(private httpEndPointService:HttphttpEndPointService) { }
  GetApiResponse<responseType, paramType>(path: string, obj: paramType, postTypeResponse?: PostType) {
    return this.httpEndPointService.GetApiResponse<responseType, paramType>(path, obj, postTypeResponse);
  }

  async getDataAndSetList<T>(Subscribe_Observable: () => Observable<T>, Observable_Response: (responseData: T) => void,onError?: (error:HttpErrorResponse)=> void): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      let subscription: Subscription | null = null;
      try {
        subscription = Subscribe_Observable().pipe(
          tap((response: T) => {
            Observable_Response(response);
          }),
          catchError((error: HttpErrorResponse) => {
            console.error('HTTP error occurred:', error);
            return throwError(() => error);
            // return throwError(() => 'Error occurred while fetching data.');
          })
        ).subscribe({
          next: (response: T) => {
            resolve(response);
          },
          error: (error: HttpErrorResponse) => {
            onError ? onError(error) : null;
            reject(error);
          },
          complete: () => {
            if (subscription) {
              subscription.unsubscribe();
            }
          }
        });
      } catch (error) {
        reject(error);
        if (subscription) {
          subscription.unsubscribe();
        }
      }
    });
  }
}
