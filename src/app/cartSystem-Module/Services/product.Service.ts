import { Injectable, NgModule } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


@NgModule({})
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private Http:HttpClient) {}
  getAllProducts<T>(Token:any):Observable<T>{
      return this.Http.get<T>(environment.baseUrl+'/product/get');
  }
  getProductsById<T>(id:number):Observable<T>{
      return this.Http.get<T>(environment.baseUrl+'/product/getProductsById/'+id);
  }

  check(Token:any,response:any|null){
      return this.Http.get(environment.baseUrl+'/test/check');
  }

  getAllCategories<T>(Token:any):Observable<T>{
   return this.Http.get<T>(environment.baseUrl+'/category/get');
  }

  getAllProductsForUser<T>(Token:any):Observable<T>{
      return this.Http.get<T>(environment.baseUrl+'/product/getUserProducts');
  }

  getAllCategoriesForUser<T>(Token:any):Observable<T>{
   return this.Http.get<T>(environment.baseUrl+'/category/getUserCategory');
  //  return this.Http.get<T>(environment.baseUrl+'/category/getUserProductsCat');
  }

  updateImage<T>(productData:FormData):Observable<T>{
  console.log(productData);
      return this.Http.post<T>(environment.baseUrl+'/product/updateImage',productData);
  }

addNewProduct<T>(productData:FormData,Token:any):Observable<T>{
  console.log(productData);
      return this.Http.post<T>(environment.baseUrl+'/product/add',productData);
  }

// addToCart<T>(Token:any,productPrice:any,productId:any):Observable<T>{
//       return this.Http.post<T>(environment.baseUrl+'/product/addToCart',{productPrice:productPrice,productId:productId,userId:localStorage.getItem('userId')});
//   }
  updateProductById<T>(productData:any,Token:any):Observable<T>{
      return this.Http.patch<T>(environment.baseUrl+'/product/update',{userInput:productData});
  }

  changeStatus<T>(productData:any,Token:any,newStatus:any):Observable<T>{
      return this.Http.patch<T>(environment.baseUrl+'/product/updateStatus',{userInput:productData,status:newStatus});
  }

deleteProductById<T>(productId:any,Token:any):Observable<T>{
      return this.Http.delete<T>(environment.baseUrl+'/product/delete/'+productId);
  }

  getAllSubCategories<T>(catID:number):Observable<T>{
    return this.Http.post<T>(environment.baseUrl+'/category/getAllSubCategories',{catID:catID});
   }

}

