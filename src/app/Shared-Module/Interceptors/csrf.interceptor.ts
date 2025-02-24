import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { prefixReq } from './http-config';
import { logMessage } from './log';

@Injectable()
export class CSRFInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const token = this.getCookie('XSRF-TOKEN') ?? '';
    let token = this.getCookie('XSRF-TOKEN') ?? '';
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
          if(token === '') {
          token = sessionStorage.getItem("xsrfToken");
          }
    }
  console.log('XSRF-TOKEN:', token);
    console.log('Retrieved CSRF Token:', token);
    if (token) {
      const clonedReq = req.clone({ setHeaders: { 'X-XSRF-TOKEN': token }, withCredentials:true });
      // const noop = () => {};
      // const consoleMethods = [
      //   'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
      //   'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
      //   'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
      //   'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn',
      // ];

      // Override all console methods
      // consoleMethods.forEach((method) => {
      //   (window.console as any)[method] = noop; // Replace each console method with noop
      // });
      // console.log('Modified Request Headers:', clonedReq.headers.keys());
      return next.handle(clonedReq);
    }
    // const noop = () => {};
    // const consoleMethods = [
    //   'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    //   'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    //   'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    //   'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn',
    // ];

    // Override all console methods
    // consoleMethods.forEach((method) => {
    //   (window.console as any)[method] = noop; // Replace each console method with noop
    // });
    return next.handle(req);
  }

  // private getCookie(name: string): string | null {
  //   const nameEQ = name + "=";
  //   const ca = document.cookie.split(';');
  //   for (let i = 0; i < ca.length; i++) {
  //     let c = ca[i];
  //     while (c.charAt(0) === ' ') c = c.substring(1, c.length);
  //     if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  //   }
  //   return null;
  // }

  private getCookie(name: string): string | null {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
  }
    return null;
  }
}
