import { SharedService } from './../../Shared-Module/Shared-Services/shared.Service';
import { Injectable, Injector, NgModule } from '@angular/core';
import { HttpMainAdminEndPointService } from './admin-end-point.HttpService';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, Subscription, catchError, finalize, tap, throwError } from 'rxjs';
import { EndpointBase } from '../../Shared-Module/Shared-Services/Token-Services/API-basePoint.TokenService';
import { PostType } from '../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum';
// @NgModule({})
// @Injectable({
//   providedIn:'root'
// })
@Injectable()
export class HttpAdminService {
  // constructor(private adminEndPointService: HttpMainAdminEndPointService) { }
  private httpEndPointService: HttpMainAdminEndPointService;
  constructor(private http: HttpClient, private injector: Injector,private sharedService:SharedService) {
    const endpointBase = this.injector.get(EndpointBase);
    this.httpEndPointService = new HttpMainAdminEndPointService(this.http, endpointBase, this.sharedService);
  }
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
  // async getDataAndSetList<T>(getData: () => Observable<HttpResponse<T>>, setData: (responseData: HttpResponse<T>) => void): Promise<HttpResponse<T>> {
  //   return new Promise<HttpResponse<T>>((resolve, reject) => {
  //     let subscription: Subscription | null = null;

  //     try {
  //       subscription = getData().pipe(
  //         tap((response: HttpResponse<T>) => {
  //           setData(response);
  //         }),
  //         catchError((error: HttpErrorResponse) => {
  //           console.error('HTTP error occurred:', error);
  //           return throwError(() => error);
  //         })
  //       ).subscribe({
  //         next: (response: HttpResponse<T>) => {
  //           resolve(response);
  //         },
  //         error: (error: any) => {
  //           reject(error);
  //         },
  //         complete: () => {
  //           if (subscription) {
  //             subscription.unsubscribe();
  //           }
  //         }
  //       });
  //     } catch (error) {
  //       reject(error);
  //       if (subscription) {
  //         subscription.unsubscribe();
  //       }
  //     }
  //   });
  // }
}

