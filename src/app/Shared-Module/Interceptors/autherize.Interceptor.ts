// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
//   HttpHeaders,
//   HttpErrorResponse,
// } from '@angular/common/http';
// import {
//   Observable,
//   catchError,
//   switchMap,
//   throwError,
//   BehaviorSubject,
//   filter,
//   take,
// } from 'rxjs';
// import { AccessTokenResponse } from '../Schemas/Interfaces/autherizeResponse.Interface';
// import { Router } from '@angular/router';
// import { RefreshtokenService } from './refreshtoken.service';

// // @Injectable({
// //   providedIn:'root'
// // })
// @Injectable()
// export class AutherizeInterceptor implements HttpInterceptor {
//   private isRefreshing = false;
//   private refreshTokenSubject: BehaviorSubject<string | null> =
//     new BehaviorSubject<string | null>(null);

//   constructor(private getToken: RefreshtokenService, private router: Router) {}

//   intercept(
//     request: HttpRequest<unknown>,
//     next: HttpHandler
//   ): Observable<HttpEvent<unknown>> {
//     let token = localStorage.getItem('access_token');

//     if (!token) {
//       return next.handle(request);
//     }

//     let authRequest = this.addTokenToRequest(request, token);

//     return next.handle(authRequest).pipe(
//       catchError((error: HttpErrorResponse) => {
//         if (error.status >= 400) {
//           return this.handleError(request, next);
//         }
//         return throwError(() => error);
//       })
//     );
//   }

//   private handleError(request: HttpRequest<any>, next: HttpHandler) {
//     if (!this.isRefreshing) {
//       this.isRefreshing = true;
//       this.refreshTokenSubject.next(null);

//       return this.getToken.refreshToken<AccessTokenResponse>().pipe(
//         switchMap((token: AccessTokenResponse) => {
//           this.isRefreshing = false;
//           localStorage.setItem('access_token', token.access_token);
//           this.refreshTokenSubject.next(token.access_token);

//           return next.handle(this.addTokenToRequest(request, token.access_token));
//         }),
//         catchError((err) => {
//           this.isRefreshing = false;
//           this.logout();
//           return throwError(() => err);
//         })
//       );
//     }

//     // Queue other failed requests until token refresh is complete
//     return this.refreshTokenSubject.pipe(
//       filter((token) => token !== null),
//       take(1),
//       switchMap((token) => next.handle(this.addTokenToRequest(request, token!)))
//     );
//   }

//   private addTokenToRequest(
//     request: HttpRequest<any>,
//     token: string
//   ): HttpRequest<any> {
//     return request.clone({
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       }),
//       withCredentials: true,
//     });
//   }

//   private logout() {
//     localStorage.clear();
//     this.router.navigate(['user', 'login']);
//   }
// }
