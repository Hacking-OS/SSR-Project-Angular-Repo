// refreshtoken.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
// import { AccessTokenResponse } from '../Schemas/Enums/autherizeResponse.Enum';
// import { HttpMainService } from '../Http-Services/main.HttpService';
// import { PostType } from '../Shared-Services/Schemas/Enums/responseType.Enum';
// import { refreshTokenParams } from '../Shared-Services/Schemas/Interfaces/refreshToken.Interface';


@Injectable({
  providedIn: 'root',
})
export class RefreshtokenService {
  constructor(private http: HttpClient) {}

  // Implement the logic to refresh the token
  // refreshToken<T>(): Observable<T> {
    // Make an HTTP request to your server to obtain a new access token using the refresh token
  //  return this.httpMainService.GetApiResponse<T,refreshTokenParams>("/users/refresh-token",params,PostType.POST);
    // return this.http.post<T>(environment.baseUrl+'/api/token/refresh-token', {token:localStorage.getItem('access_token'),refreshToken:localStorage.getItem('refreshToken')});
    // return this.http.post<T>(environment.baseUrl+'/users/refresh-token', {token:localStorage.getItem('token'),refreshToken:localStorage.getItem('refreshToken')});
  // }
}


