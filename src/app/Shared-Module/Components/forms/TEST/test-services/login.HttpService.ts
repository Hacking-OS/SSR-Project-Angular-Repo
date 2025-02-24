import { Injectable, Injector, NgModule } from '@angular/core';
import { HttpLoginEndPointService } from './login-end-point.HttpService';
import { firstValueFrom, Observable, Subscription, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PostType } from '../test-models/responseType.Enum';
// @NgModule({})
@Injectable({
  providedIn: 'root',
})
export class HttpLoginService{
  private httpEndPointService: HttpLoginEndPointService;
  // private httpEndPointService: HttpLoginEndPointService
  constructor(private http:HttpClient) {
    this.httpEndPointService = new HttpLoginEndPointService(this.http);
  }

  GetApiResponse<responseType, paramType>(path: string, obj: paramType, postTypeResponse?: PostType) {
    return this.httpEndPointService.GetApiResponse<responseType, paramType>(path,obj, postTypeResponse);
  }

  async GetApiResponseTest<responseType, paramType>(path: string, obj: paramType, postTypeResponse?: PostType) {
    try {
      const response = await firstValueFrom(this.httpEndPointService.GetApiResponse<responseType, paramType>(path, obj, postTypeResponse));
      console.log('Response:', response);
      return response;
    } catch (error) {
      console.error('Error:', error);
      // this.errorShowService.AdminErrorShow(error,'Unable to Load Data!');
    }
  }

  async getDataAndSetList<T>(Subscribe_Observable: () => Observable<T>, Observable_Response: (responseData: T) => void,onError?: () => void): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      let subscription: Subscription | null = null;
      try {
        subscription = Subscribe_Observable().pipe(
            tap((response: T) => {
              Observable_Response(response);
            })).subscribe({
            next: (response: T) => {
              resolve(response);
            },
            error: (error: HttpErrorResponse) => {
                console.error("Error :  " , error);
              // this.errorShowService.AdminErrorShow(error,'Unable to Load Data!');
              resolve(null);
                // reject(null);
                if (onError) {
                  onError();
                }
              // reject(error);
            },
            complete: () => {
              if (subscription) {
                subscription.unsubscribe();
              }
            },
          });
      } catch (error) {
        console.error("Error :  " , error);
        // this.errorShowService.AdminErrorShow(error,'Unable to Load Data!');
        // resolve(null);
        resolve(null);
         if (onError) {
           onError();
         }
        // reject(error);
        if (subscription) {
          subscription.unsubscribe();
        }
      }
    });
  }
}
