// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { catchError, map } from 'rxjs/operators';

// import { BehaviorSubject, EMPTY } from 'rxjs';
// import { environment } from '../../../../environments/environment';

// export interface SessionState {
//   loggedIn: boolean;
//   message: string;
// }

// const notSignedInMessage = `Not signed in`;

// @Injectable({ providedIn: 'root' })
// export class SessionService {
//   private _isLoggedIn = false;
//   private sessionStateSubject = new BehaviorSubject<SessionState>({
//     loggedIn: false,
//     message: notSignedInMessage,
//   });
//   accessToken: string;

//   public get isLoggedIn(): boolean {
//     return this._isLoggedIn;
//   }

//   readOnly = false; // TODO: This could be set based upon a role

//   sessionState$ = this.sessionStateSubject.asObservable();

//   constructor(private http: HttpClient) {}

//   signin(email: string, password: string) {
//     const root = environment.baseUrl;
//     const signinUrl = `${root}/signin/`;
//     const body: Partial<User> = {
//       email, // 'john@contoso.com',
//       password, // '1234'
//     };
//     return this.http.post<{ accessToken: string }>(signinUrl, body).pipe(
//       catchError((_) => {
//         this.logout();
//         return EMPTY;
//       }),
//       map((res) => {
//         if (res?.accessToken) {
//           const message = `Signed in as ${email}`;
//           this.accessToken = res.accessToken;
//           this.sessionStateSubject.next({ loggedIn: true, message });
//           this._isLoggedIn = true;
//           return true;
//         } else {
//           this.logout();
//           return false;
//         }
//       }),
//     );
//   }

//   logout() {
//     this.accessToken = null;
//     this._isLoggedIn = false;
//     this.sessionStateSubject.next({
//       loggedIn: false,
//       message: notSignedInMessage,
//     });
//   }
// }
