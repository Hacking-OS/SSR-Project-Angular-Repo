import { Injectable, NgModule } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
@NgModule({})

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private Http:HttpClient) {}

  addNewCategory<T>(CategoryName:string,Token:any,isSubCat:boolean=false,addCatIDwithSub?:number):Observable<T>{
      return this.Http.post<T>(environment.baseUrl+'/category/add',{token:Token,catName:CategoryName,isSubCat:isSubCat,catID:addCatIDwithSub});
  }

  getAllCategories<T>(Token:any):Observable<T>{
      return this.Http.get<T>(environment.baseUrl+'/category/get');
  }

  getAllCategoriesForUser<T>(Token:any):Observable<T>{
      return this.Http.get<T>(environment.baseUrl+'/category/getUserCategory');
  }

  updateCategoryById<T>(catId:any,Token:any,catNewName:string,isSubCat?:boolean,updateParentCat?:number):Observable<T>{
     if(isSubCat){
      return this.Http.patch<T>(environment.baseUrl+'/category/update',{id:catId,name:catNewName,isSubCat:isSubCat,updateParentCat:updateParentCat});
     }else{
      return this.Http.patch<T>(environment.baseUrl+'/category/update',{id:catId,name:catNewName,isSubCat:undefined,updateParentCat:undefined});
     }
  }
}
