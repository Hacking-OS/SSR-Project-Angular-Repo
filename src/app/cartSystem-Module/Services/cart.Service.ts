import { Injectable, NgModule } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})

export class CartService {
  constructor(private Http:HttpClient) {}

  checkOut<T>(Token:any,userId:any):Observable<T>{
      return this.Http.post<T>(environment.baseUrl+'/cart/checkout',{id:userId});
  }

  getUserCart<T>(Token:any):Observable<T>{
      return this.Http.get<T>(environment.baseUrl+'/cart/get');
  }

  getUserCart2<T>(Token:any):Observable<T>{
      return this.Http.get<T>(environment.baseUrl+'/cart/getRemoved');
  }

  removeFromCart<T>(Token:any,cartId:any):Observable<T>{
      return this.Http.post<T>(environment.baseUrl+'/cart/remove',{id:cartId});
  }
}
