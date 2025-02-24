import { SharedService } from './../../../../Shared-Module/Shared-Services/shared.Service';
import { Component } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../../Services/category.Service';
import { CategoriesList, categoryList, subCategoryList } from '../../Schemas/Interfaces/category-list.Interface';
import { HttpErrorResponse } from '@angular/common/http';
import { baseResponse } from '../../../../Shared-Module/Shared-Services/Schemas/Interfaces/baseResponse.Interface';
import { HttpCartService } from '../../../Http-Services/cart.HttpService';
import { PostType } from '../../../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum';
import { AlertService, AlertType } from '../../../../Shared-Module/Alert-Services/alert.AlertService';


@Component({
    selector: 'app-category',
    templateUrl: './add-category.component.html',
    styleUrls: ['./add-category.component.css'],
    standalone: false
})
export class AddCategoryComponent {
  condition:boolean|undefined=false
  isSubCat:boolean|undefined=false;
  catDropdown:categoryList[]=[];

userData={
  catname:"",
  subCatName:"",
  catId:0,
  subCatId:0,
  catnamenew:"",
  CurrentCatName:""
  }

  checkboxval:any=[];

  message: string | any;
  ipAddress: any;
  categoryList:categoryList[]=[];
  subCategoryList:subCategoryList[]=[];
  userRole:string;
  constructor(private sharedService:SharedService,private router: Router,private cartService:HttpCartService,private alertService:AlertService) {
    this.userRole = this.sharedService.getUserInfo()?.role;
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getUserCategories();
  }

 display = "none";
 getCatId:any;
openModal(catId:number,CatName:string,catOtherId?:number,isSubCat?:boolean):void {
    this.display = "block";
    this.userData.catId=catOtherId?catOtherId:0;
    this.getCatId=catId;
    this.isSubCat=isSubCat;
    this.userData.CurrentCatName=CatName;
  }
  onCloseHandled() {
    this.display = "none";
  }


  redirectUser(redirectTo:string):void{
    this.router.navigateByUrl("/"+redirectTo);
  }


  postData(formData:NgForm,addSubCat:boolean):void {
    this.cartService.getDataAndSetList<baseResponse>(()=>this.cartService.GetApiResponse<baseResponse,{catName:string,isSubCat:boolean,catID:number}>('/category/add',{catName:(this.userData.catname)?this.userData.catname:this.userData.subCatName,isSubCat:addSubCat,catID:this.userData.catId},PostType.POST),(response:baseResponse)=>{
      this.alertService.showAlert(response.message,AlertType.Success);
      this.getUserCategories();
      this.redirectUser("/cartSystem/category");
    });
     formData.reset();
  }


  getUserCategories():void {
    if(this.userRole==='user'){
     this.cartService.getDataAndSetList<CategoriesList>(()=>this.cartService.GetApiResponse<CategoriesList,null>('/category/getUserCategory',null,PostType.GET),(response:CategoriesList)=>{
      this.categoryList=response.categories;
      this.subCategoryList=response.subCategories;
    });
    }else{
      this.cartService.getDataAndSetList<CategoriesList>(()=>this.cartService.GetApiResponse<CategoriesList,null>('/category/get',null,PostType.GET),(response:CategoriesList)=>{
        this.subCategoryList=response.subCategories;
      });
    }
  }
}
