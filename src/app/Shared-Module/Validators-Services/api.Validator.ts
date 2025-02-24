import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subscription, tap, catchError, throwError, finalize } from "rxjs";
@Injectable()
export class APIValidator {
  async getDataAndSetList<T>(getData: () => Observable<T>, setData: (responseData: T) => void): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      let subscription: Subscription | null = null;
      try {
        subscription = getData().pipe(
          tap((response: T) => setData(response)),
          catchError((error: HttpErrorResponse) => {
            console.error('HTTP error occurred:', error);
            reject(error); // Reject the promise with the error
            return throwError(() => new Error('Error occurred while fetching data.'));
          }),
          finalize(() => {
            if (subscription) {
              subscription.unsubscribe();
            }
          })
        ).subscribe({
          next: (response: T) => resolve(response),
          error: (error: HttpErrorResponse) => reject(error), // Reject the promise with the error,
        });
      } catch (error:any) {
        reject(error);
        if (subscription) {
          subscription.unsubscribe();
        }
      }
    });
  }
}
