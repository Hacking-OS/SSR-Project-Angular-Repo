import { Injectable, Input, NgModule } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@NgModule({})

@Injectable({
  providedIn: 'root'
})

export class BillService {
  constructor(private Http:HttpClient) {}
  getAllConsumerBill<T>(Token:any):Observable<T>{
      return this.Http.get<T>(environment.baseUrl+'/bill/getBills');
  }

  // getAllUserBill<T>(Token:any):Observable<T>{
      // return this.Http.get<T>(environment.baseUrl+'/bill/getBillsUsers/'+localStorage.getItem('userId'));
  // }

  deleteBill<T>(uuid:any,Token:any):Observable<T>{
      return this.Http.delete<T>(environment.baseUrl+'/bill/delete/'+uuid);
  }

  generateReport<T>(postUser:any,Token:any):Observable<T>{
      return this.Http.post<T>(environment.baseUrl+'/bill/GenerateReport/',{id:postUser});
  }

  // getPdf<T>(postUser:any,Token:any,userRole:string|null):Observable<Blob>{
  //   let header=new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     Authorization: "Bearer "+Token
  //    },
  //    );
  //    let userId=localStorage.getItem('userId');
  //    return this.Http.post(environment.baseUrl+'/bill/getPdf/',{id:postUser,userId:userId,role:userRole},{headers:header,  responseType: 'blob'});

  // }
}
