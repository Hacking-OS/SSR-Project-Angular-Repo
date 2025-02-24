import { DecryptService } from './Security-Services/decrypt.Service';
import { EncryptService } from './Security-Services/encrypt.Service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, AlertType } from '../Alert-Services/alert.AlertService';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
// import { CspNonceService } from './SecurityServices/cspnounce.Service';
import { EndpointBase } from './Token-Services/API-basePoint.TokenService';
import { PostType } from './Schemas/Enums/responseType.Enum';
import { SharedProfileDetails, SharedUserDetailsDto, SharedUserSessionDetailsDto } from './Schemas/Interfaces/shared.Interface';
import { Observable, catchError, map, Subscription, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
// import { CspNonceService } from './SecurityServices/cspnounce.Service';
// @NgModule()
// @Injectable()
@Injectable()
export class SharedCoreService {

  private readonly apiKey = environment.API_KEY; // Your API Key
  private readonly secretKey = environment.SECRET_AUTH_KEY; // Your Secret Key
  private readonly salt = environment.SALT_KEY; // Hardcoded salt value

  user = 0;
  isUserAdmin = 0;
  userRole;
  message: any | undefined;
  protected cspNonce: string | undefined;
  constructor(private http:HttpClient,private router: Router, private alert: AlertService,private endpointBase:EndpointBase , private decryptService:DecryptService) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    this.userRole = localStorage.getItem('role');
    }
   }

  setUserDetails(message: string): void {
    try {
      // Decrypt the message to get user profile details
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const userResponse = this.decryptService.decrypt<SharedProfileDetails>(message);

      // Set user details in localStorage
      localStorage.setItem("access_token", userResponse.token);
      localStorage.setItem("role", userResponse.userRole);
      localStorage.setItem(
        'userId',
        typeof userResponse.userId === 'string' ? userResponse.userId : userResponse.userId.toString()
      );
      localStorage.setItem("email", userResponse.email);
      localStorage.setItem("refreshToken", userResponse.refreshToken);
      localStorage.setItem("userName", userResponse.userName);

      // Set xsrfToken in sessionStorage
      sessionStorage.setItem("xsrfToken", userResponse.xsrfToken);
    }
    } catch (error) {
      console.error("Error decrypting user data", error);
      // Optionally, handle error (e.g., show an alert or log the error)
    }
  }

  encryptData(data:string):string {
    return EncryptService.encrypt(data);
  }

  logoutUser() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.clear();
    }
    setTimeout(() => {
      this.alert.showAlert("The user has been logged out", AlertType.Success);
      this.router.navigateByUrl("user/login");
    }, 3000);
  }

  async getUserCount() : Promise<{Checkout: number; Cart: number; Bill: number;} | number> {
   return new Promise((resolve,reject)=>{
   try{
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    if (localStorage.getItem('role') === 'admin') {

      this.isUserAdmin = 1;
      this.getDataAndSetList<number>(() => this.GetApiResponse<number, null>('/count/Adminbill', null,PostType.GET),
        (response) => {

          resolve(response);

        });

    } else if(localStorage.getItem('role') === 'user'){

      this.getDataAndSetList<{Checkout: number;Cart: number;Bill: number;}>(() =>
        this.GetApiResponse<{ Checkout: number; Cart: number; Bill: number},number>('/dashboard/user-details',Number(localStorage.getItem('userId') ?? 0),PostType.GET),(response) => {

        resolve(response);

      });
      }
    }
  } catch(e){
    reject();
   }
 });
}

  createRandomString( length: number = 8 ) : string {
    let randomString='';
    const params = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890";
    for(let i=0; i < length; i++){
      randomString += params[ Math.floor( Math.random() * params.length ) ];
    }
    return randomString;
  }

  scrollToNav() {
  }

  getCookie(name: string): string | null {

    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;

  }

  getUserInfo():SharedUserDetailsDto {
   return {
     role: (typeof window !== 'undefined' && typeof document !== 'undefined') ? localStorage.getItem('role') : null,
      userId:Number(  (typeof window !== 'undefined' && typeof document !== 'undefined') ? localStorage.getItem('userId') : 0) ?? null,
      userEmailId: (typeof window !== 'undefined' && typeof document !== 'undefined')  ? localStorage.getItem('email') : null,
      userName: (typeof window !== 'undefined' && typeof document !== 'undefined')  ? localStorage.getItem('userName') : null,
    }
  }


  getUserSessionInfo():SharedUserSessionDetailsDto {
    return {
      access_token:  (typeof window !== 'undefined' && typeof document !== 'undefined')  ? localStorage.getItem('access_token') : null,
      refreshToken: (typeof window !== 'undefined' && typeof document !== 'undefined')  ? localStorage.getItem('refreshToken') : null,
      xsrfToken:  (typeof window !== 'undefined' && typeof document !== 'undefined')  ? localStorage.getItem('xsrfToken') ?? sessionStorage.getItem('xsrfToken') : null,
     }
   }


   private get requestHeader(): { headers: HttpHeaders } {
         const url = environment.baseUrl; // Adjust based on your API endpoint
         const nonce = Math.random().toString(36).substring(2); // Generate a random nonce
         const timestamp = new Date(Date.now()).toISOString(); // Get current timestamp
         const dataToSign = `${this.apiKey}${nonce}${timestamp}${this.salt}`;
         const signature = this.endpointBase.generateHMAC(this.apiKey,nonce,timestamp,this.salt);
         const userAgent =  (typeof window !== 'undefined' && typeof document !== 'undefined')  ? window.navigator.userAgent : '';
       return {
         headers: new HttpHeaders({
         // 'Content-Type': 'application/json',
         'Authorization': `Bearer ${(typeof window !== 'undefined' && typeof document !== 'undefined') ? localStorage.getItem('access_token') : null}`,
         'X-XSRF-TOKEN': this.endpointBase.getCookie('XSRF-TOKEN') ?? (typeof window !== 'undefined' && typeof document !== 'undefined') ? sessionStorage.getItem("xsrfToken") :'','x-api-key': this.apiKey,
         'x-nonce': nonce,
         'x-timestamp': timestamp,
         'x-signature': signature,
         'HMAC-Signature': this.endpointBase.generateHmacSignature(this.secretKey,userAgent, this.salt),
         'User-Agent': userAgent
         })
       }
   }
   
 private GetApiResponse<Response, OtherParams = any>(apiPath: string, obj: OtherParams, postTypeResponse?: PostType): Observable<Response> {
       const url = environment.baseUrl + apiPath; // Construct the URL dynamically
       const options = {
         ...this.requestHeader,
         withCredentials: true // Include credentials in the request
       };
       switch (postTypeResponse) {
         case PostType.POST:
           console.log("post");
           return this.http.post<Response>(url, obj, {...options}).pipe(
             catchError((error: HttpErrorResponse): Observable<any> => {
               console.error(error);
               return this.endpointBase.handleError<Response | HttpErrorResponse>(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse));
             })
           );
         case PostType.GET:
           console.log("get");
           const getUrl = obj ? `${url}/${obj}` : url;
           // const getUrl = obj ? `${url}?${new URLSearchParams(obj as any).toString()}` : url;
           return this.http.get<Response>(getUrl, {...options}).pipe(
             catchError((error: HttpErrorResponse): Observable<any> => {
               console.error(error);
               return this.endpointBase.handleError<Response | HttpErrorResponse>(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse));
             })
           );
         case PostType.DELETE:
           console.log('delete');
           // const deleteUrl = obj ? `${url}?${new URLSearchParams(obj as any).toString()}` : url;
           const deleteUrl = obj ? `${url}/${obj}` : url;
           return this.http.delete<Response>(deleteUrl, {...options}).pipe(
             catchError((error: HttpErrorResponse): Observable<any> => {
               console.error(error);
               return this.endpointBase.handleError<Response | HttpErrorResponse>(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse));
             })
           );
         case PostType.PATCH:
           console.log('patch');
           return this.http.patch<Response>(url, obj, {...options}).pipe(
             catchError((error: HttpErrorResponse): Observable<any> => {
               console.error(error);
               return this.endpointBase.handleError<Response | HttpErrorResponse>(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse));
             })
           );
         case PostType.PUT:
           console.log('put');
           return this.http.put<Response>(url, obj, {...options}).pipe(
             catchError((error: HttpErrorResponse): Observable<any> => {
               console.error(error);
               return this.endpointBase.handleError<Response | HttpErrorResponse>(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse));
             })
           );
         default:
           console.log("Defult");
           return this.http.request<Response>('POST', url, { body: obj, ...options , observe: 'response' }).pipe(
             map((response: HttpResponse<Response>) => response.body as Response),
             catchError((error: HttpErrorResponse): Observable<any> => {
               return this.endpointBase.handleError<Response | HttpErrorResponse>(error, () => this.GetApiResponse(apiPath, obj, postTypeResponse));
             })
           );
       }
     }


   private  async getDataAndSetList<T>(Subscribe_Observable: () => Observable<T>, Observable_Response: (responseData: T) => void): Promise<T> {
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


   getStatusCategory(code: number): string {
        if (code >= 100 && code < 200) return "Informational";
        if (code >= 200 && code < 300) return "Success";
        if (code >= 300 && code < 400) return "Redirection";
        if (code >= 400 && code < 500) return "Client Error";
        if (code >= 500 && code < 600) return "Server Error";
        return "Unknown";
      }
}

















        // let userResponse = this.decryptService.decrypt<userProfileDetails>(data.message);
                // localStorage.setItem("token", userResponse.token);
        // localStorage.setItem("role", userResponse.userRole);
        // localStorage.setItem(
        //   'userId',
        //   typeof userResponse.userId === 'string'
        //     ? userResponse.userId
        //     : userResponse.userId.toString(),
        // )
        // localStorage.setItem("email", userResponse.email);
        // localStorage.setItem("refreshToken", userResponse.refreshToken);
        // localStorage.setItem("userName", userResponse.userName);
        // sessionStorage.setItem("xsrfToken", userResponse.xsrfToken);