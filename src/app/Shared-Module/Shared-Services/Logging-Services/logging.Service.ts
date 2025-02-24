// import { EndpointBase } from './../Token-Services/API-basePoint.TokenService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger, NgxLoggerLevel } from 'ngx-logger';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private tokenRefreshed = new BehaviorSubject<boolean>(false);
  private readonly apiKey = environment.API_KEY; // Your API Key
  private readonly secretKey = environment.SECRET_AUTH_KEY; // Your Secret Key
  private readonly salt = environment.SALT_KEY; // Hardcoded salt value
  constructor(private logger: NGXLogger,http:HttpClient) {
    // super(http,router,LoggerService);
  }

updateHeaders():void {
  const getCsrfToken = this.getCookie('XSRF-TOKEN') ?? (typeof window !== 'undefined' && typeof localStorage !== 'undefined') ? sessionStorage.getItem('xsrfToken') : '';
  const userAgent = (typeof window !== 'undefined' && typeof document !== 'undefined') ? window.navigator.userAgent : '';
  const timestamp = new Date(Date.now()).toISOString(); // Get current timestamp
  const headers = new HttpHeaders({
    Authorization: 'Bearer ' + (typeof window !== 'undefined' && typeof localStorage !== 'undefined') ? localStorage.getItem('access_token') : '',
    // 'Content-Type': 'application/json',
    'X-XSRF-TOKEN': getCsrfToken ?? '',
    'HMAC-Signature': this.generateHmacSignature('',userAgent,''),
    'x-timestamp': timestamp,
    'User-Agent': userAgent
  });

  this.logger.updateConfig({
    customHttpHeaders: headers,
    level: NgxLoggerLevel.DEBUG,
    withCredentials:true,
    serverLoggingUrl: environment.baseUrl + '/api/logger/logs',
    serverLogLevel: NgxLoggerLevel.DEBUG,
  });
}

  log(message: string) {
    // this.overrideConsoleMethods();
    this.updateHeaders();
    this.logger.debug(message);
  }

  error(message: string) {
    // this.setTokenRefreshStatus(true);
    // this.overrideConsoleMethods();
    this.updateHeaders();
    this.logger.error(message);
  }

  info(message: string) {
    // this.setTokenRefreshStatus(true);
    // this.overrideConsoleMethods();
    this.updateHeaders();
    this.logger.info(message);
  }

  warn(message: string) {
    // this.overrideConsoleMethods();
    this.logger.warn(message);
  }

  getTokenRefreshStatus(): Observable<boolean> {
    return this.tokenRefreshed.asObservable(); // Observable for token refresh
  }

  setTokenRefreshStatus(stat:boolean): void {
    return this.tokenRefreshed.next(stat); // Observable for token refresh
  }

  generateHmacSignature(secretKey?: string, message?: string,salt?:string): string {
    const hmac = CryptoJS.HmacSHA256(`${message}:${this.salt}`, this.secretKey);
    return CryptoJS.enc.Base64.stringify(hmac);
  }

  public getCookie(name: string): string | null {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
  return null;
}
}
